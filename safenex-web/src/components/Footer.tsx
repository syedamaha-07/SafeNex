import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <div className={styles.footerBrand}>
                    <img src="/logo.png" alt="SafeNex Logo" width={72} height={72} style={{ objectFit: 'contain', marginBottom: '16px' }} />
                    <p className={styles.footerDesc}>
                        The ultimate AI-powered safety platform for modern families. Real-time GPS tracking, smart geofencing, and behavioral intelligence.
                    </p>
                </div>

                <div className={styles.footerLinks}>
                    <div className={styles.linkGroup}>
                        <h4>Product</h4>
                        <Link href="/features">Features</Link>
                        <Link href="#">How it Works</Link>
                        <Link href="#">Pricing</Link>
                    </div>

                    <div className={styles.linkGroup}>
                        <h4>Company</h4>
                        <Link href="/contact">Contact Us</Link>
                        <Link href="#">About SafeNex</Link>
                        <Link href="#">Careers</Link>
                    </div>

                    <div className={styles.linkGroup}>
                        <h4>Legal</h4>
                        <Link href="#">Privacy Policy</Link>
                        <Link href="#">Terms of Service</Link>
                        <Link href="#">Cookie Policy</Link>
                    </div>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <p>&copy; {currentYear} SafeNex Corporation. All rights reserved.</p>
                <div className={styles.socialIcons}>
                    <span>📱</span>
                    <span>💼</span>
                    <span>🐦</span>
                </div>
            </div>
        </footer>
    );
}
