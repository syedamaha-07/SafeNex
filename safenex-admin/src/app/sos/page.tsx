"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';
import styles from '../page.module.css';

interface SOSAlert {
    id: string;
    user_id: string;
    status: string;
    triggered_at: string;
    resolved_at: string | null;
}

export default function SOSPage() {
    const [alerts, setAlerts] = useState<SOSAlert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            const { data, error } = await supabase
                .from('sos_alerts')
                .select('*')
                .order('triggered_at', { ascending: false });

            if (data) setAlerts(data);
            setLoading(false);
        };

        fetchAlerts();
    }, []);

    return (
        <AdminLayout>
            <section style={{ padding: '0 24px' }}>
                <h3 className={styles.cardTitle}>Emergency Alert Center</h3>
                <div className={styles.glassCard}>
                    {loading ? (
                        <p className={styles.textMuted}>Connecting to secure emergency signals...</p>
                    ) : alerts.length > 0 ? (
                        <div className={styles.tableContainer}>
                            <table className={styles.dataTable}>
                                <thead>
                                    <tr>
                                        <th>Timestamp</th>
                                        <th>Device User</th>
                                        <th>Alert Priority</th>
                                        <th>Help Status</th>
                                        <th>Resolution</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alerts.map(alert => (
                                        <tr key={alert.id}>
                                            <td>{new Date(alert.triggered_at).toLocaleString()}</td>
                                            <td style={{ fontWeight: 600 }}>{alert.user_id.slice(0, 8)}...</td>
                                            <td>
                                                <span className={`${styles.badge} ${alert.status === 'active' ? styles.badgeHigh : styles.badgeLow}`}>
                                                    {alert.status === 'active' ? 'URGENT HELP' : 'RESOLVED'}
                                                </span>
                                            </td>
                                            <td>
                                                {alert.status === 'active' ? (
                                                    <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.75rem' }}>
                                                        🛰️ HELP NOTIFIED (1122)
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#64748b' }}>Standby</span>
                                                )}
                                            </td>
                                            <td className={styles.textMuted}>{alert.resolved_at ? new Date(alert.resolved_at).toLocaleTimeString() : 'Monitoring...'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className={styles.textMuted}>All clear. No active distress signals detected.</p>
                    )}
                </div>
            </section>
        </AdminLayout>
    );
}
