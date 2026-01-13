'use server';

import { prisma } from '@/lib/prisma';

export interface AgentSearchParams {
  city?: string;
  state?: string;
  language?: string;
  query?: string;
  page?: number;
  limit?: number;
}

export interface AgentSummary {
  id: string;
  userId: string;
  name: string;
  image: string | null;
  brokerage: string;
  languages: string[];
  experienceYears: number;
  cities: string[];
  states: string[];
  bio: string | null;
  isVerified: boolean;
}

export interface AgentSearchResult {
  agents: AgentSummary[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Search for agents/realtors with filters
 */
export async function searchAgentsAction(params: AgentSearchParams): Promise<AgentSearchResult> {
  const { city, state, language, query, page = 1, limit = 12 } = params;

  const where: Record<string, unknown> = {
    isVerified: true,
  };

  // Filter by city (CSV field)
  if (city) {
    where.cities = { contains: city, mode: 'insensitive' };
  }

  // Filter by state (CSV field)
  if (state) {
    where.states = { contains: state, mode: 'insensitive' };
  }

  // Filter by language (CSV field)
  if (language) {
    where.languages = { contains: language, mode: 'insensitive' };
  }

  // Search query (name or brokerage)
  if (query) {
    where.OR = [
      { user: { name: { contains: query, mode: 'insensitive' } } },
      { brokerage: { contains: query, mode: 'insensitive' } },
      { bio: { contains: query, mode: 'insensitive' } },
    ];
  }

  const [profiles, total] = await Promise.all([
    prisma.realtorProfile.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: [{ experienceYears: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.realtorProfile.count({ where }),
  ]);

  const agents: AgentSummary[] = profiles.map((profile) => ({
    id: profile.id,
    userId: profile.userId,
    name: profile.user.name || 'Agent',
    image: profile.user.image,
    brokerage: profile.brokerage,
    languages: profile.languages.split(',').map((l) => l.trim()),
    experienceYears: profile.experienceYears,
    cities: profile.cities.split(',').map((c) => c.trim()),
    states: profile.states.split(',').map((s) => s.trim()),
    bio: profile.bio,
    isVerified: profile.isVerified,
  }));

  return {
    agents,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get a single agent by ID
 */
export async function getAgentAction(agentId: string): Promise<AgentSummary | null> {
  const profile = await prisma.realtorProfile.findUnique({
    where: { id: agentId },
    include: {
      user: {
        select: {
          name: true,
          image: true,
          email: true,
        },
      },
    },
  });

  if (!profile) return null;

  return {
    id: profile.id,
    userId: profile.userId,
    name: profile.user.name || 'Agent',
    image: profile.user.image,
    brokerage: profile.brokerage,
    languages: profile.languages.split(',').map((l) => l.trim()),
    experienceYears: profile.experienceYears,
    cities: profile.cities.split(',').map((c) => c.trim()),
    states: profile.states.split(',').map((s) => s.trim()),
    bio: profile.bio,
    isVerified: profile.isVerified,
  };
}

/**
 * Get featured agents for homepage
 */
export async function getFeaturedAgentsAction(limit = 6): Promise<AgentSummary[]> {
  const profiles = await prisma.realtorProfile.findMany({
    where: { isVerified: true },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: { experienceYears: 'desc' },
    take: limit,
  });

  return profiles.map((profile) => ({
    id: profile.id,
    userId: profile.userId,
    name: profile.user.name || 'Agent',
    image: profile.user.image,
    brokerage: profile.brokerage,
    languages: profile.languages.split(',').map((l) => l.trim()),
    experienceYears: profile.experienceYears,
    cities: profile.cities.split(',').map((c) => c.trim()),
    states: profile.states.split(',').map((s) => s.trim()),
    bio: profile.bio,
    isVerified: profile.isVerified,
  }));
}

/**
 * Get available filter options
 */
export async function getAgentFilterOptionsAction(): Promise<{
  states: string[];
  cities: string[];
  languages: string[];
}> {
  const profiles = await prisma.realtorProfile.findMany({
    where: { isVerified: true },
    select: {
      states: true,
      cities: true,
      languages: true,
    },
  });

  const statesSet = new Set<string>();
  const citiesSet = new Set<string>();
  const languagesSet = new Set<string>();

  profiles.forEach((p) => {
    p.states.split(',').forEach((s) => statesSet.add(s.trim()));
    p.cities.split(',').forEach((c) => citiesSet.add(c.trim()));
    p.languages.split(',').forEach((l) => languagesSet.add(l.trim()));
  });

  return {
    states: Array.from(statesSet).sort(),
    cities: Array.from(citiesSet).sort(),
    languages: Array.from(languagesSet).sort(),
  };
}
