"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';
import styles from '../page.module.css';

interface Device {
    id: string;
    user_id: string;
    device_name: string;
    device_type: string;
    status: string;
    last_seen: string;
}

export default function DevicesPage() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [users, setUsers] = useState<{ id: string, full_name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [deviceName, setDeviceName] = useState('');
    const [deviceType, setDeviceType] = useState('ble');
    const [userId, setUserId] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const { data: deviceData } = await supabase
            .from('devices')
            .select('*')
            .order('last_seen', { ascending: false });

        const { data: userData } = await supabase
            .from('users')
            .select('id, full_name');

        if (deviceData) setDevices(deviceData);
        if (userData) setUsers(userData);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePairDevice = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!deviceName || !userId) return alert('Please fill all fields');

        setSubmitting(true);
        const { error } = await supabase
            .from('devices')
            .insert([
                {
                    device_name: deviceName,
                    device_type: deviceType,
                    user_id: userId,
                    status: 'active'
                }
            ]);

        if (error) {
            alert('Error pairing device: ' + error.message);
        } else {
            setShowModal(false);
            setDeviceName('');
            setUserId('');
            fetchData();
        }
        setSubmitting(false);
    };

    return (
        <AdminLayout>
            <section style={{ padding: '0 24px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 className={styles.cardTitle}>Hardware Management</h3>
                    <button
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        onClick={() => setShowModal(true)}
                    >
                        + Pair New Device
                    </button>
                </div>

                {/* Pairing Modal */}
                {showModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        backdropFilter: 'blur(4px)'
                    }}>
                        <div className={styles.glassCard} style={{ width: '100%', maxWidth: '450px', padding: '32px' }}>
                            <h3 style={{ marginBottom: '24px' }}>Pair New Hardware</h3>
                            <form onSubmit={handlePairDevice}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>Device Name</label>
                                    <input
                                        type="text"
                                        value={deviceName}
                                        onChange={(e) => setDeviceName(e.target.value)}
                                        placeholder="e.g. ESP32 Beacon X1"
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>Device Type</label>
                                    <select
                                        value={deviceType}
                                        onChange={(e) => setDeviceType(e.target.value)}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    >
                                        <option value="ble">BLE (Bluetooth)</option>
                                        <option value="wifi">WiFi / Cellular</option>
                                        <option value="lora">LoRaWAN</option>
                                    </select>
                                </div>
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>Assign to User</label>
                                    <select
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    >
                                        <option value="">Select a user...</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.full_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'transparent' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="btn-primary"
                                        style={{ padding: '10px 24px', borderRadius: '8px' }}
                                    >
                                        {submitting ? 'Pairing...' : 'Complete Pairing'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className={styles.glassCard}>
                    {loading ? (
                        <p className={styles.textMuted}>Scanning for paired hardware...</p>
                    ) : devices.length > 0 ? (
                        <div className={styles.tableContainer}>
                            <table className={styles.dataTable}>
                                <thead>
                                    <tr>
                                        <th>Device Name</th>
                                        <th>Type</th>
                                        <th>Linked User</th>
                                        <th>Status</th>
                                        <th>Last Seen</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {devices.map(device => (
                                        <tr key={device.id}>
                                            <td style={{ fontWeight: 600 }}>{device.device_name}</td>
                                            <td>
                                                <span className={styles.badge} style={{ textTransform: 'uppercase' }}>
                                                    {device.device_type}
                                                </span>
                                            </td>
                                            <td className={styles.textMuted}>{device.user_id.slice(0, 8)}...</td>
                                            <td>
                                                <span className={`${styles.badge} ${device.status === 'active' ? styles.badgeLow : styles.badgeMedium}`}>
                                                    {device.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className={styles.textMuted}>{new Date(device.last_seen).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <p className={styles.textMuted}>No hardware devices paired yet.</p>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '8px' }}>
                                Pair a BLE wearable or ESP32 beacon to enable hybrid safety tracking.
                            </p>
                        </div>
                    )}
                </div>

                {/* Hybrid Info Section */}
                <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div className={styles.glassCard} style={{ padding: '24px' }}>
                        <h4 style={{ marginBottom: '12px', color: '#1e293b' }}>Hardware Benefits</h4>
                        <ul style={{ fontSize: '0.85rem', color: '#64748b', paddingLeft: '20px', lineHeight: '1.8' }}>
                            <li>Indoor Tracking via Bluetooth Beacons</li>
                            <li>Continuous Heart Rate & Stress Monitoring</li>
                            <li>Fall Detection via Movement Sensors</li>
                            <li>Secondary Tracking if Phone Battery Fails</li>
                        </ul>
                    </div>
                    <div className={styles.glassCard} style={{ padding: '24px' }}>
                        <h4 style={{ marginBottom: '12px', color: '#1e293b' }}>System Status</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#4ade80' }}></div>
                            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Hardware Connection: **ACTIVE**</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '12px' }}>
                            System is ready to receive data from paired devices.
                        </p>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}
