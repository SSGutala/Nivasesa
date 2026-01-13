'use client';

/**
 * Lead Distribution Dashboard
 *
 * Admin/Manager view for managing lead distribution across realtors.
 * Shows unassigned leads, distribution analytics, and allows manual/auto assignment.
 */

import { useState, useEffect } from 'react';
import { Users, TrendingUp, Activity, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import {
  getUnassignedLeads,
  getLeadDistributionAnalytics,
  getLeadMatchPreview,
  distributeAllUnassignedLeads,
  getTopPerformingRealtors,
  getUnderutilizedRealtors,
  manuallyAssignLead,
} from '@/actions/lead-management';
import { autoAssignLead } from '@/actions/lead-distribution';

export default function LeadDistributionDashboard() {
  const [loading, setLoading] = useState(true);
  const [unassignedLeads, setUnassignedLeads] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'unassigned' | 'analytics' | 'realtors'>('unassigned');
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [matchPreview, setMatchPreview] = useState<any>(null);
  const [distributing, setDistributing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [leads, stats] = await Promise.all([
      getUnassignedLeads(),
      getLeadDistributionAnalytics(),
    ]);

    setUnassignedLeads(leads);
    if (stats.success) {
      setAnalytics(stats.analytics);
    }
    setLoading(false);
  };

  const handleViewMatches = async (leadId: string) => {
    setSelectedLead(leadId);
    const preview = await getLeadMatchPreview(leadId);
    if (preview.success) {
      setMatchPreview(preview);
    }
  };

  const handleAutoAssign = async (leadId: string) => {
    setDistributing(true);
    const result = await autoAssignLead(leadId);
    if (result.success) {
      alert(`Lead assigned to ${result.assignedTo}`);
      loadData();
      setSelectedLead(null);
      setMatchPreview(null);
    } else {
      alert(result.error);
    }
    setDistributing(false);
  };

  const handleDistributeAll = async () => {
    if (!confirm(`Distribute all ${unassignedLeads.length} unassigned leads?`)) {
      return;
    }

    setDistributing(true);
    const result = await distributeAllUnassignedLeads();
    if (result.success) {
      alert(result.message);
      loadData();
    } else {
      alert(result.error);
    }
    setDistributing(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
        Loading lead distribution data...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'Inter, sans-serif', padding: '40px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
            Lead Distribution System
          </h1>
          <p style={{ color: '#6b7280' }}>Manage and distribute leads to realtors based on location, language, and availability</p>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <StatCard
              icon={<Activity size={24} />}
              label="Total Leads"
              value={analytics.totalLeads}
              color="#3b82f6"
            />
            <StatCard
              icon={<CheckCircle size={24} />}
              label="Assigned"
              value={`${analytics.assignedLeads} (${Math.round(analytics.assignmentPercentage)}%)`}
              color="#16a34a"
            />
            <StatCard
              icon={<AlertCircle size={24} />}
              label="Unassigned"
              value={analytics.unassignedLeads}
              color="#f59e0b"
            />
            <StatCard
              icon={<Users size={24} />}
              label="Verified Realtors"
              value={analytics.verifiedRealtors}
              color="#8b5cf6"
            />
          </div>
        )}

        {/* Tabs */}
        <div style={{ marginBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', gap: '32px' }}>
            <TabButton
              label="Unassigned Leads"
              active={activeTab === 'unassigned'}
              onClick={() => setActiveTab('unassigned')}
              badge={unassignedLeads.length}
            />
            <TabButton
              label="Analytics"
              active={activeTab === 'analytics'}
              onClick={() => setActiveTab('analytics')}
            />
            <TabButton
              label="Realtors"
              active={activeTab === 'realtors'}
              onClick={() => setActiveTab('realtors')}
            />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'unassigned' && (
          <UnassignedLeadsTab
            leads={unassignedLeads}
            onViewMatches={handleViewMatches}
            onAutoAssign={handleAutoAssign}
            onDistributeAll={handleDistributeAll}
            distributing={distributing}
            selectedLead={selectedLead}
            matchPreview={matchPreview}
            setSelectedLead={setSelectedLead}
            setMatchPreview={setMatchPreview}
          />
        )}

        {activeTab === 'analytics' && analytics && (
          <AnalyticsTab analytics={analytics} />
        )}

        {activeTab === 'realtors' && (
          <RealtorsTab />
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{ color }}>{icon}</div>
        <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: '28px', fontWeight: 600, color: '#111827' }}>{value}</div>
    </div>
  );
}

function TabButton({ label, active, onClick, badge }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 0',
        fontSize: '15px',
        fontWeight: active ? 600 : 500,
        color: active ? '#111827' : '#6b7280',
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {label}
      {badge !== undefined && (
        <span style={{
          backgroundColor: active ? '#3b82f6' : '#e5e7eb',
          color: active ? 'white' : '#6b7280',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 600,
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}

function UnassignedLeadsTab({ leads, onViewMatches, onAutoAssign, onDistributeAll, distributing, selectedLead, matchPreview, setSelectedLead, setMatchPreview }: any) {
  return (
    <div>
      {/* Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <p style={{ color: '#6b7280' }}>
          {leads.length} lead{leads.length !== 1 ? 's' : ''} awaiting assignment
        </p>
        {leads.length > 0 && (
          <button
            onClick={onDistributeAll}
            disabled={distributing}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: distributing ? 0.6 : 1,
            }}
          >
            <RefreshCw size={16} />
            {distributing ? 'Distributing...' : 'Auto-Distribute All'}
          </button>
        )}
      </div>

      {/* Leads Grid */}
      {leads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', backgroundColor: 'white', borderRadius: '12px', border: '1px dashed #d1d5db' }}>
          <CheckCircle size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#374151' }}>All leads are assigned!</h3>
          <p style={{ color: '#6b7280' }}>Great job! There are no unassigned leads at the moment.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedLead ? '1fr 1fr' : '1fr', gap: '24px' }}>
          {/* Leads List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {leads.map((lead: any) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onViewMatches={onViewMatches}
                onAutoAssign={onAutoAssign}
                isSelected={selectedLead === lead.id}
                distributing={distributing}
              />
            ))}
          </div>

          {/* Match Preview Panel */}
          {selectedLead && matchPreview && (
            <div style={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
              <MatchPreviewPanel
                matchPreview={matchPreview}
                onClose={() => { setSelectedLead(null); setMatchPreview(null); }}
                onAssign={onAutoAssign}
                distributing={distributing}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LeadCard({ lead, onViewMatches, onAutoAssign, isSelected, distributing }: any) {
  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
        boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>{lead.buyerName}</h3>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>
          {new Date(lead.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', color: '#4b5563' }}>
          <strong>Location:</strong> {lead.city}, {lead.zipcode}
        </div>
        {lead.languagePreference && (
          <div style={{ fontSize: '14px', color: '#4b5563' }}>
            <strong>Language:</strong> {lead.languagePreference}
          </div>
        )}
        {lead.interest && (
          <div style={{ fontSize: '14px', color: '#4b5563' }}>
            <strong>Interest:</strong> {lead.interest}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => onViewMatches(lead.id)}
          style={{
            flex: 1,
            padding: '8px 16px',
            borderRadius: '6px',
            backgroundColor: isSelected ? '#3b82f6' : '#f3f4f6',
            color: isSelected ? 'white' : '#111827',
            border: 'none',
            fontWeight: 500,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          {isSelected ? 'Viewing Matches' : 'View Matches'}
        </button>
        <button
          onClick={() => onAutoAssign(lead.id)}
          disabled={distributing}
          style={{
            flex: 1,
            padding: '8px 16px',
            borderRadius: '6px',
            backgroundColor: '#16a34a',
            color: 'white',
            border: 'none',
            fontWeight: 500,
            fontSize: '14px',
            cursor: 'pointer',
            opacity: distributing ? 0.6 : 1,
          }}
        >
          Auto-Assign
        </button>
      </div>
    </div>
  );
}

function MatchPreviewPanel({ matchPreview, onClose, onAssign, distributing }: any) {
  const { lead, matches } = matchPreview;

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Top Matches</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>
          ×
        </button>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
            {lead.buyerName}
          </div>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>
            {lead.city}, {lead.zipcode}
          </div>
        </div>

        {matches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
            No matching realtors found
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {matches.slice(0, 5).map((match: any, index: number) => (
              <div
                key={match.realtorId}
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  border: index === 0 ? '2px solid #16a34a' : '1px solid #e5e7eb',
                  backgroundColor: index === 0 ? '#f0fdf4' : 'white',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>
                      {match.realtorName}
                      {index === 0 && (
                        <span style={{ marginLeft: '8px', fontSize: '11px', fontWeight: 600, color: '#16a34a', backgroundColor: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>
                          BEST MATCH
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      {match.reason}
                    </div>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: match.score >= 80 ? '#16a34a' : match.score >= 60 ? '#3b82f6' : '#f59e0b' }}>
                    {match.score}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px', fontSize: '12px' }}>
                  <div style={{ color: '#6b7280' }}>
                    Location: <strong style={{ color: '#111827' }}>{match.locationScore}/40</strong>
                  </div>
                  <div style={{ color: '#6b7280' }}>
                    Language: <strong style={{ color: '#111827' }}>{match.languageScore}/30</strong>
                  </div>
                  <div style={{ color: '#6b7280' }}>
                    Verified: <strong style={{ color: '#111827' }}>{match.verificationScore}/20</strong>
                  </div>
                  <div style={{ color: '#6b7280' }}>
                    Available: <strong style={{ color: '#111827' }}>{match.availabilityScore}/10</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {matches.length > 0 && (
          <button
            onClick={() => onAssign(lead.id)}
            disabled={distributing}
            style={{
              width: '100%',
              marginTop: '20px',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              opacity: distributing ? 0.6 : 1,
            }}
          >
            {distributing ? 'Assigning...' : `Assign to ${matches[0].realtorName}`}
          </button>
        )}
      </div>
    </div>
  );
}

function AnalyticsTab({ analytics }: any) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>Distribution Overview</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <MetricRow label="Total Leads" value={analytics.totalLeads} />
          <MetricRow label="Assigned" value={`${analytics.assignedLeads} (${Math.round(analytics.assignmentPercentage)}%)`} />
          <MetricRow label="Unassigned" value={analytics.unassignedLeads} />
          <MetricRow label="Avg Leads/Realtor" value={analytics.avgLeadsPerRealtor} />
          <MetricRow label="Realtors at Capacity" value={analytics.realtorsAtCapacity} />
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>Last 7 Days</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <MetricRow label="New Leads" value={analytics.last7Days.totalLeads} />
          <MetricRow label="Assigned" value={analytics.last7Days.assigned} />
          <MetricRow label="Assignment Rate" value={`${analytics.last7Days.assignmentRate}%`} />
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value }: any) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ fontSize: '14px', color: '#6b7280' }}>{label}</span>
      <span style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>{value}</span>
    </div>
  );
}

function RealtorsTab() {
  const [topRealtors, setTopRealtors] = useState<any[]>([]);
  const [underutilized, setUnderutilized] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRealtorData = async () => {
      const [top, under] = await Promise.all([
        getTopPerformingRealtors(10),
        getUnderutilizedRealtors(5),
      ]);

      if (top.success) setTopRealtors(top.realtors || []);
      if (under.success) setUnderutilized(under.realtors || []);
      setLoading(false);
    };

    loadRealtorData();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading realtor data...</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>Top Performers</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {topRealtors.map((realtor, index) => (
            <div key={realtor.id} style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                    #{index + 1} {realtor.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    {realtor.cities}
                  </div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#3b82f6' }}>
                  {realtor.leadCount}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>Available Capacity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {underutilized.map((realtor) => (
            <div key={realtor.id} style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                    {realtor.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    {realtor.cities} • {realtor.languages}
                  </div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#16a34a' }}>
                  {realtor.leadCount} leads
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
