"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';
import styles from '../page.module.css';

interface User {
    id: string;
    email: string;
    full_name: string;
    role: string;
    created_at: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setUsers(data);
            setLoading(false);
        };

        fetchUsers();
    }, []);

    return (
        <AdminLayout>
            <section style={{ padding: '0 24px' }}>
                <h3 className={styles.cardTitle}>People List</h3>
                <div className={styles.glassCard}>
                    {loading ? (
                        <p className={styles.textMuted}>Loading directory...</p>
                    ) : users.length > 0 ? (
                        <div className={styles.tableContainer}>
                            <table className={styles.dataTable}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Access Level</th>
                                        <th>Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.full_name || 'Anonymous User'}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`${styles.badge} ${user.role === 'parent' ? styles.badgeMedium : user.role === 'admin' ? styles.badgeHigh : styles.badgeLow}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className={styles.textMuted}>No users found in the system.</p>
                    )}
                </div>
            </section>
        </AdminLayout>
    );
}
