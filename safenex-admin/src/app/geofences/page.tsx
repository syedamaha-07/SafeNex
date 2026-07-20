"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';
import styles from '../page.module.css';

interface Geofence {
    id: string;
    user_id: string;
    name: string;
    radius: number;
    center_lat: number;
    center_lng: number;
    created_at: string;
}

export default function GeofencesPage() {
    const [geofences, setGeofences] = useState<Geofence[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGeofences = async () => {
            const { data, error } = await supabase
                .from('geofences')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setGeofences(data);
            setLoading(false);
        };

        fetchGeofences();
    }, []);

    return (
        <AdminLayout>
            <section style={{ padding: '0 24px' }}>
                <h3 className={styles.cardTitle}>Active Safe Zones</h3>
                <div className={styles.glassCard}>
                    {loading ? (
                        <p className={styles.textMuted}>Loading safe zone data...</p>
                    ) : geofences.length > 0 ? (
                        <div className={styles.tableContainer}>
                            <table className={styles.dataTable}>
                                <thead>
                                    <tr>
                                        <th>Zone Name</th>
                                        <th>User ID</th>
                                        <th>Radius (m)</th>
                                        <th>Map Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {geofences.map(fence => (
                                        <tr key={fence.id}>
                                            <td style={{ fontWeight: 600 }}>{fence.name}</td>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{fence.user_id}</td>
                                            <td>
                                                <span className={`${styles.badge} ${styles.badgeMedium}`}>
                                                    {fence.radius}m
                                                </span>
                                            </td>
                                            <td className={styles.textMuted}>
                                                {fence.center_lat.toFixed(6)}, {fence.center_lng.toFixed(6)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className={styles.textMuted}>No safe areas set up yet.</p>
                    )}
                </div>
            </section>
        </AdminLayout>
    );
}
