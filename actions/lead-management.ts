'use server';

/**
 * Lead Management Actions
 *
 * High-level actions for managing leads, including distribution,
 * assignment, and analytics.
 */

import prisma from '@/lib/prisma';
import {
  distributeLeadToRealtors,
  getLeadDistributionRecommendations,
  batchDistributeLeads,
} from './lead-distribution';
import { getMatchQuality, calculateLeadPriority } from '@/lib/lead-matching';

/**
 * Get all unassigned leads (leads without an agentId)
 */
export async function getUnassignedLeads(): Promise<any[]> {
  try {
    const leads = await prisma.lead.findMany({
      where: {
        agentId: null,
        status: 'locked',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return leads;
  } catch (error) {
    console.error('Error fetching unassigned leads:', error);
    return [];
  }
}

/**
 * Get lead distribution status for a specific lead
 */
export async function getLeadDistributionStatus(leadId: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        agent: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!lead) {
      return { success: false, error: 'Lead not found' };
    }

    // Get distribution recommendations
    const recommendations = await getLeadDistributionRecommendations(leadId);

    return {
      success: true,
      lead,
      isAssigned: !!lead.agentId,
      assignedTo: lead.agent?.user.name,
      recommendations: recommendations.recommendations,
    };
  } catch (error) {
    console.error('Error getting lead distribution status:', error);
    return { success: false, error: 'Failed to get distribution status' };
  }
}

/**
 * Manually assign a lead to a specific realtor
 */
export async function manuallyAssignLead(
  leadId: string,
  realtorId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify realtor exists and is verified
    const realtor = await prisma.realtorProfile.findUnique({
      where: { id: realtorId },
      include: { user: true },
    });

    if (!realtor) {
      return { success: false, error: 'Realtor not found' };
    }

    if (!realtor.isVerified) {
      return { success: false, error: 'Realtor is not verified' };
    }

    // Assign the lead
    await prisma.lead.update({
      where: { id: leadId },
      data: { agentId: realtorId },
    });

    return { success: true };
  } catch (error) {
    console.error('Error manually assigning lead:', error);
    return { success: false, error: 'Failed to assign lead' };
  }
}

/**
 * Unassign a lead from its current realtor
 */
export async function unassignLead(leadId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { agentId: null },
    });

    return { success: true };
  } catch (error) {
    console.error('Error unassigning lead:', error);
    return { success: false, error: 'Failed to unassign lead' };
  }
}

/**
 * Get lead distribution analytics
 */
export async function getLeadDistributionAnalytics() {
  try {
    const [totalLeads, assignedLeads, unassignedLeads, verifiedRealtors] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { agentId: { not: null } } }),
      prisma.lead.count({ where: { agentId: null } }),
      prisma.realtorProfile.count({ where: { isVerified: true } }),
    ]);

    // Get leads per realtor
    const realtorLeadCounts = await prisma.lead.groupBy({
      by: ['agentId'],
      _count: {
        id: true,
      },
      where: {
        agentId: { not: null },
      },
    });

    const avgLeadsPerRealtor = realtorLeadCounts.length > 0
      ? realtorLeadCounts.reduce((sum, r) => sum + r._count.id, 0) / realtorLeadCounts.length
      : 0;

    // Find realtors at capacity (>30 leads)
    const realtorsAtCapacity = realtorLeadCounts.filter(r => r._count.id > 30).length;

    // Get recent assignment rate
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const recentAssignments = await prisma.lead.count({
      where: {
        agentId: { not: null },
        createdAt: { gte: last7Days },
      },
    });

    const recentLeads = await prisma.lead.count({
      where: {
        createdAt: { gte: last7Days },
      },
    });

    const assignmentRate = recentLeads > 0 ? (recentAssignments / recentLeads) * 100 : 0;

    return {
      success: true,
      analytics: {
        totalLeads,
        assignedLeads,
        unassignedLeads,
        assignmentPercentage: totalLeads > 0 ? (assignedLeads / totalLeads) * 100 : 0,
        verifiedRealtors,
        avgLeadsPerRealtor: Math.round(avgLeadsPerRealtor * 10) / 10,
        realtorsAtCapacity,
        last7Days: {
          totalLeads: recentLeads,
          assigned: recentAssignments,
          assignmentRate: Math.round(assignmentRate * 10) / 10,
        },
      },
    };
  } catch (error) {
    console.error('Error getting lead distribution analytics:', error);
    return { success: false, error: 'Failed to get analytics' };
  }
}

/**
 * Get top performing realtors (by number of assigned leads)
 */
export async function getTopPerformingRealtors(limit: number = 10) {
  try {
    const realtors = await prisma.realtorProfile.findMany({
      where: {
        isVerified: true,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        leads: {
          select: {
            id: true,
            createdAt: true,
          },
        },
      },
    });

    // Sort by lead count
    const sorted = realtors
      .map(r => ({
        id: r.id,
        name: r.user.name || 'Unknown',
        email: r.user.email,
        leadCount: r.leads.length,
        cities: r.cities,
        languages: r.languages,
      }))
      .sort((a, b) => b.leadCount - a.leadCount)
      .slice(0, limit);

    return {
      success: true,
      realtors: sorted,
    };
  } catch (error) {
    console.error('Error getting top performing realtors:', error);
    return { success: false, error: 'Failed to get top performers' };
  }
}

/**
 * Get underutilized realtors (verified realtors with few leads)
 */
export async function getUnderutilizedRealtors(maxLeads: number = 5) {
  try {
    const realtors = await prisma.realtorProfile.findMany({
      where: {
        isVerified: true,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        leads: {
          select: {
            id: true,
          },
        },
      },
    });

    const underutilized = realtors
      .filter(r => r.leads.length <= maxLeads)
      .map(r => ({
        id: r.id,
        name: r.user.name || 'Unknown',
        email: r.user.email,
        leadCount: r.leads.length,
        cities: r.cities,
        states: r.states,
        languages: r.languages,
      }))
      .sort((a, b) => a.leadCount - b.leadCount);

    return {
      success: true,
      realtors: underutilized,
    };
  } catch (error) {
    console.error('Error getting underutilized realtors:', error);
    return { success: false, error: 'Failed to get underutilized realtors' };
  }
}

/**
 * Run lead distribution for all unassigned leads
 */
export async function distributeAllUnassignedLeads() {
  try {
    const unassignedLeads = await getUnassignedLeads();

    if (unassignedLeads.length === 0) {
      return {
        success: true,
        message: 'No unassigned leads to distribute',
        results: [],
      };
    }

    const leadIds = unassignedLeads.map(l => l.id);
    const distribution = await batchDistributeLeads(leadIds);

    return {
      success: true,
      message: `Distributed ${distribution.results?.filter(r => r.assigned).length || 0} of ${unassignedLeads.length} leads`,
      results: distribution.results,
    };
  } catch (error) {
    console.error('Error distributing all unassigned leads:', error);
    return { success: false, error: 'Failed to distribute leads' };
  }
}

/**
 * Get lead match preview (without assigning)
 */
export async function getLeadMatchPreview(leadId: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return { success: false, error: 'Lead not found' };
    }

    const distribution = await distributeLeadToRealtors({ leadId, maxRealtors: 10 });

    if (!distribution.success || !distribution.matches) {
      return { success: false, error: distribution.error };
    }

    // Add quality and priority info to matches
    const enrichedMatches = distribution.matches.map(match => ({
      ...match,
      quality: getMatchQuality(match.score),
      priority: calculateLeadPriority(match.score, lead),
    }));

    return {
      success: true,
      lead,
      matches: enrichedMatches,
    };
  } catch (error) {
    console.error('Error getting lead match preview:', error);
    return { success: false, error: 'Failed to get match preview' };
  }
}

/**
 * Reassign lead to a better match
 */
export async function reassignLeadToBetterMatch(leadId: string) {
  try {
    // Get current assignment
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        agent: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!lead) {
      return { success: false, error: 'Lead not found' };
    }

    // Get distribution recommendations
    const distribution = await distributeLeadToRealtors({ leadId, maxRealtors: 5 });

    if (!distribution.success || !distribution.matches || distribution.matches.length === 0) {
      return { success: false, error: 'No better matches found' };
    }

    const topMatch = distribution.matches[0];

    // Only reassign if the new match is significantly better (at least 10 points higher)
    if (lead.agentId) {
      const currentMatch = distribution.matches.find(m => m.realtorId === lead.agentId);
      if (currentMatch && topMatch.score - currentMatch.score < 10) {
        return {
          success: false,
          error: 'Current assignment is already optimal',
        };
      }
    }

    // Reassign
    await prisma.lead.update({
      where: { id: leadId },
      data: { agentId: topMatch.realtorId },
    });

    return {
      success: true,
      message: `Lead reassigned to ${topMatch.realtorName} (score: ${topMatch.score})`,
      previousAgent: lead.agent?.user?.name,
      newAgent: topMatch.realtorName,
    };
  } catch (error) {
    console.error('Error reassigning lead:', error);
    return { success: false, error: 'Failed to reassign lead' };
  }
}
