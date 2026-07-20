"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';
import AdminLayout from '@/components/AdminLayout';

// Dynamically import map to avoid SSR issues with Leaflet
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const Map = dynamic(
  () => import('./LiveMap'),
  {
    ssr: false,
    loading: () => <p>Loading Live Map...</p>
  }
) as React.ComponentType<{ locations: Location[] }>;

interface Location {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface SOSAlert {
  id: string;
  user_id: string;
  status: string;
}

interface ActivityLog {
  id: string;
  action: string;
  created_at: string;
  user_id: string;
}

interface AIInsight {
  id: string;
  user_id: string;
  anomaly_type: string;
  score: number;
  created_at: string;
}

interface DailySummary {
  id: string;
  user_id: string;
  summary_text: string;
  risk_level: string;
  date: string;
}

export default function Dashboard() {
  const [locations, setLocations] = useState<Record<string, Location>>({});
  const [activeSOS, setActiveSOS] = useState<SOSAlert[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [summaries, setSummaries] = useState<DailySummary[]>([]);
  const [showAllActivities, setShowAllActivities] = useState(false);

  useEffect(() => {
    // Fetch initial state
    const fetchInitialData = async () => {
      // Fetch latest location for each user
      const { data: locationsData } = await supabase
        .from('locations')
        .select('*')
        .order('timestamp', { ascending: false });

      if (locationsData) {
        const latestLocs: Record<string, Location> = {};
        locationsData.forEach(loc => {
          if (!latestLocs[loc.user_id]) {
            latestLocs[loc.user_id] = loc;
          }
        });
        setLocations(latestLocs);
      }

      const { data: insightsData } = await supabase
        .from('ai_insights')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: summariesData } = await supabase
        .from('daily_summaries')
        .select('*')
        .order('date', { ascending: false })
        .limit(5);

      if (insightsData) setInsights(insightsData);
      if (summariesData) setSummaries(summariesData);

      // Fetch recent activity
      const { data: activityData } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (activityData) setActivities(activityData);
    };

    fetchInitialData();

    // 1. Subscribe to Location Updates
    const locationSubscription = supabase
      .channel('public:locations')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'locations' }, payload => {
        console.log('Location Update Received:', payload);
        const newLoc = payload.new as Location;
        setLocations(prev => ({ ...prev, [newLoc.user_id]: newLoc }));
      })
      .subscribe((status) => console.log('Location Sub Status:', status));

    // 2. Subscribe to SOS Alerts
    const sosSubscription = supabase
      .channel('public:sos_alerts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sos_alerts' }, payload => {
        console.log('SOS Update Received:', payload);
        const newSOS = payload.new as SOSAlert;
        if (newSOS.status === 'active') {
          setActiveSOS(prev => [newSOS, ...prev]);
        }
      })
      .subscribe((status) => console.log('SOS Sub Status:', status));

    // 3. Subscribe to Activity Logs
    const activitySubscription = supabase
      .channel('public:activity_logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs' }, payload => {
        console.log('Activity Update Received:', payload);
        const newLog = payload.new as ActivityLog;
        setActivities(prev => [newLog, ...prev].slice(0, 50));
      })
      .subscribe((status) => console.log('Activity Sub Status:', status));

    return () => {
      supabase.removeChannel(locationSubscription);
      supabase.removeChannel(sosSubscription);
      supabase.removeChannel(activitySubscription);
    };
  }, []);

  const displayedActivities = showAllActivities ? activities : activities.slice(0, 10);

  return (
    <AdminLayout>
      {activeSOS.length > 0 && (
        <div className={styles.sosBanner}>
          🚨 EMERGENCY SOS ACTIVATED FOR {activeSOS.length} USER(S)
        </div>
      )}

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>People Online</div>
          <div className={styles.statValue}>{Object.keys(locations).length}</div>
          <div style={{ fontSize: '0.8rem', color: '#4ade80' }}>● Connected & Live</div>
        </div>
        <div className={`${styles.statCard} ${activeSOS.length > 0 ? styles.sosValueActive : ''}`}>
          <div className={styles.statLabel}>Active SOS</div>
          <div className={`${styles.statValue} ${activeSOS.length > 0 ? styles.sosValueActive : ''}`}>
            {activeSOS.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: activeSOS.length > 0 ? '#f87171' : '#94a3b8' }}>
            {activeSOS.length > 0 ? 'ATTENTION REQUIRED' : 'No active alerts'}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Safe Zone Alerts</div>
          <div className={styles.statValue}>
            {activities.filter(a => a.action === 'geofence_breach').length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#fbbf24' }}>Total alerts today</div>
        </div>
      </section>

      <section className={styles.dashboardSplit}>
        <div className={styles.mapContainer}>
          <Map locations={Object.values(locations)} />
        </div>

        <div className={styles.feedContainer}>
          <h3 className={styles.cardTitle}>Live Movement Feed</h3>
          <div className={styles.activityFeed}>
            {displayedActivities.map(log => (
              <div key={log.id} className={styles.activityItem}>
                <div className={styles.activityMeta}>
                  <strong style={{ color: log.action.includes('breach') ? '#fbbf24' : '#60a5fa' }}>
                    {log.action.toUpperCase()}
                  </strong>
                  <span className={styles.timeText}>{new Date(log.created_at).toLocaleTimeString()}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Device ID: {log.user_id.slice(0, 8)}...</div>
              </div>
            ))}
            {activities.length === 0 && <p className={styles.textMuted}>Waiting for incoming location updates...</p>}
          </div>
          {activities.length > 10 && (
            <button
              className={styles.readMoreBtn}
              onClick={() => setShowAllActivities(!showAllActivities)}
            >
              {showAllActivities ? 'Show Less' : `View All (${activities.length})`}
            </button>
          )}
        </div>
      </section>

      <section className={styles.insightsGrid}>
        <div className={styles.glassCard}>
          <h3 className={styles.cardTitle}>Smart Behavior Alerts</h3>
          {insights.length > 0 ? (
            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Alert Time</th>
                    <th>Alert Type</th>
                    <th>Risk Score</th>
                  </tr>
                </thead>
                <tbody>
                  {insights.map(insight => (
                    <tr key={insight.id}>
                      <td>{new Date(insight.created_at).toLocaleTimeString()}</td>
                      <td>{insight.anomaly_type.replace(/_/g, ' ')}</td>
                      <td>
                        <span className={`${styles.badge} ${insight.score > 60 ? styles.badgeHigh : insight.score > 30 ? styles.badgeMedium : insight.score > 30 ? styles.badgeMedium : styles.badgeLow}`}>
                          {insight.score}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={styles.textMuted}>No unusual activity detected lately.</p>
          )}
        </div>

        <div className={styles.glassCard}>
          <h3 className={styles.cardTitle}>Daily Safety Summaries</h3>
          {summaries.length > 0 ? (
            <div>
              {summaries.map(summary => (
                <div key={summary.id} className={styles.summaryCard}>
                  <div className={styles.summaryDate}>{new Date(summary.date).toLocaleDateString()}</div>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6' }}>{summary.summary_text.replace(/anomaly|telemetry/gi, 'activity')}</p>
                  <div style={{ marginTop: '16px' }}>
                    <span className={`${styles.badge} ${summary.risk_level === 'High' ? styles.badgeHigh : summary.risk_level === 'Medium' ? styles.badgeMedium : styles.badgeLow}`}>
                      {summary.risk_level} Risk Day
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.textMuted}>Waiting for daily summary to be created...</p>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}
