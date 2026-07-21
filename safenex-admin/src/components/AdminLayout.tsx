import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../app/page.module.css';

export default function AdminLayout({ children, selected = '/dashboard' }: { children: React.ReactNode, selected?: string }) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const isActive = (path: string) => {
        if (path === '/dashboard' && pathname === '/') return true;
        return pathname?.startsWith(path);
    };

    return (
        <div className={styles.container}>
            <button
            className={styles.menuButton}
            onClick={() => setMenuOpen(!menuOpen)}
            >
            ☰
            </button>
            <aside className={`${styles.sidebar} ${menuOpen ? styles.showSidebar : ''}`}>
                <div className={styles.logoContainer} style={{ padding: '32px 24px', textAlign: 'center' }}>
                    <img src="/logo.png" alt="SafeNex Logo" style={{ height: '80px', objectFit: 'contain' }} />
                </div>
                <nav className={styles.sidebarNav}>
                    <Link href="/" onClick={() => setMenuOpen(false)} className={isActive('/dashboard') ? styles.active : ''}>
                        <span>🏠</span> Safety Dashboard
                    </Link>
                    <Link href="/users" onClick={() => setMenuOpen(false)} className={isActive('/users') ? styles.active : ''}>
                        <span>👥</span> People List
                    </Link>
                    <Link href="/sos" onClick={() => setMenuOpen(false)} className={isActive('/sos') ? styles.active : ''}>
                        <span>🚨</span> Emergency Alerts
                    </Link>
                    <Link href="/geofences" onClick={() => setMenuOpen(false)} className={isActive('/geofences') ? styles.active : ''}>
                        <span>🛡️</span> Safe Zones
                    </Link>
                    <Link href="/devices" onClick={() => setMenuOpen(false)}className={isActive('/devices') ? styles.active : ''}>
                        <span>⌚</span> Hardware
                    </Link>
                </nav>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <h2>Safety Dashboard</h2>
                    <div className={styles.userProfile}>
                        <div style={{ marginRight: '12px', textAlign: 'right' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Admin User</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Super Admin</div>
                        </div>
                        <div className={styles.avatar} style={{ backgroundColor: '#1C54A8', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            A
                        </div>
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
}
