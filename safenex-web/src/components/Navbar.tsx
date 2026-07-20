"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                <div className={styles.brand}>
                    <Link href="/">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src="/logo.png" alt="SafeNex Logo" width={56} height={56} style={{ objectFit: 'contain' }} />
                        </div>
                    </Link>
                </div>

                <div className={styles.navLinks}>
                    <Link href="/" className={pathname === '/' ? styles.active : ''}>Home</Link>
                    <Link href="/features" className={pathname === '/features' ? styles.active : ''}>Features</Link>
                    <Link href="/contact" className={pathname === '/contact' ? styles.active : ''}>Contact</Link>
                </div>

                <div className={styles.navActions}>
                    <a href="https://safenex-admin.onrender.com" target="_blank" rel="noopener noreferrer" className="btn-secondary">Admin Login</a>
                  <a href="/app-release.apk"download className="btn-primary"> Download App</a>
                </div>
            </div>
        </nav>
    );
}
