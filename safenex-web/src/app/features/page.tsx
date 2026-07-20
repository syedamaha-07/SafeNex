import styles from './Features.module.css';
import Link from 'next/link';

export default function FeaturesPage() {
    return (
        <main className={styles.main}>
            <header className={styles.pageHeader}>
                <div className={styles.badge}>Technology</div>
                <h1 className="gradient-text">How SafeNex Protects You</h1>
                <p>Explore the smart tools working silently to protect your family.</p>
            </header>

            <section className={styles.bentoGrid}>
                <div className={`${styles.bentoItem} ${styles.large}`}>
                    <div className={styles.bentoContent}>
                        <h3>Live Location Tracking</h3>
                        <p>Your mobile app sends live location updates directly to your dashboard so you never lose sight.</p>
                    </div>
                    <div className={styles.bentoVisual}>
                        <div className={styles.radarVisual}>
                            <div className={styles.radarBlip}></div>
                        </div>
                    </div>
                </div>

                <div className={styles.bentoItem}>
                    <div className={styles.bentoContent}>
                        <h3>Smart Monitoring Brain</h3>
                        <p>Our smart alerts include <strong>Fall and Accident Detection</strong> and <strong>Off-Route Alerts</strong> to flag unusual activity.</p>
                        <div className={styles.scoreBadge}>Risk Level: Low</div>
                    </div>
                </div>

                <div className={styles.bentoItem}>
                    <div className={styles.bentoContent}>
                        <h3>Proactive Safety Tools</h3>
                        <p>Engage <strong>Walk-with-Me</strong> mode for 5-second GPS precision or set a <strong>Check-in Timer</strong> for automated safety confirmation.</p>
                        <button className={styles.sosPreviewBtn}>Learn More</button>
                    </div>
                </div>

                <div className={`${styles.bentoItem} ${styles.wide}`}>
                    <div className={styles.bentoContent}>
                        <h3>Smart Safe Zones</h3>
                        <p>Set up as many safe areas as you need. Our system always checks the map to send you an alert the moment someone leaves their safe zone.</p>
                    </div>
                    <div className={styles.bentoVisual}>
                        <div className={styles.fenceVisual}>
                            <div className={styles.fenceRing}></div>
                            <div className={styles.fencePoint}></div>
                        </div>
                    </div>
                </div>
            </section>

            <div className={styles.ctaBottom}>
                <h2>Experience true peace of mind.</h2>
                <Link href="/">
                    <button className="btn-primary">Return Home</button>
                </Link>
            </div>
        </main>
    );
}
