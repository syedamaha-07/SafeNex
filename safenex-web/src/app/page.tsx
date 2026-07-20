import styles from "./page.module.css";
import Link from 'next/link';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <img src="/logo.png" alt="SafeNex Logo" style={{ height: '120px', marginBottom: '32px' }} className="animate-fade-in" />
          <div className={styles.badge}>Next-Generation Safety</div>
          <h1 className="animate-fade-in">
            Protecting What <br />
            Matters <span className="gradient-text">Most</span>
          </h1>
          <p className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            SafeNex keeps your family safe with live location tracking, smart behavior monitoring, and secure alerts.
          </p>
          <div className={`${styles.heroActions} animate-fade-in`} style={{ animationDelay: '0.4s' }}>
            <Link href="/features">
              <button className="btn-primary">Explore Features</button>
            </Link>
            <Link href="/contact">
              <button className={styles.btnSecondary}>Contact Sales</button>
            </Link>
          </div>
        </div>
        <div className={`${styles.heroImage} animate-fade-in`} style={{ animationDelay: '0.6s' }}>
          <div className={styles.imagePlaceholder}>
            <div className={styles.glassCard}>
              <div className={styles.statusGroup}>
                <div className={styles.statusDot}></div>
                <span>Guardian Active</span>
              </div>
              <div className={styles.pulseRings}>
                <div className={styles.ring1}></div>
                <div className={styles.ring2}></div>
                <div className={styles.ring3}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className={styles.trustSection}>
        <p>Trusted by modern families and organizations worldwide</p>
        <div className={styles.logoRow}>
          <span className={styles.mockLogo}>SecurityCorp</span>
          <span className={styles.mockLogo}>GlobalGuard</span>
          <span className={styles.mockLogo}>FamilyTech</span>
          <span className={styles.mockLogo}>SafeZone</span>
        </div>
      </section>

      {/* Core Features Overview */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className="gradient-text">Core Safety Features</h2>
          <p>The perfect blend of proactive intelligence and real-time response.</p>
        </div>
        <div className={styles.grid}>
          <div className="card">
            <div className={styles.iconWrapper}>📍</div>
            <h3>Pinpoint Accuracy</h3>
            <p>Super fast live tracking shows exactly where your loved ones are on the map.</p>
          </div>
          <div className="card">
            <div className={styles.iconWrapper}>🛡️</div>
            <h3>Invisible Safe Zones</h3>
            <p>Set up safe areas on the map and get an instant alert if someone leaves their zone.</p>
          </div>
          <div className="card">
            <div className={styles.iconWrapper}>🧠</div>
            <h3>Smart Behavior Alerts</h3>
            <p>Our smart system watches for unusual movement, like high speeds or late-night travel, to keep you informed.</p>
          </div>
          <div className="card">
            <div className={styles.iconWrapper}>🚨</div>
            <h3>Instant SOS</h3>
            <p>One tap sends an emergency alert to your dashboard and notifies your trusted contacts immediately.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Ready to upgrade your family's security?</h2>
          <p>Join thousands of users who trust SafeNex with their priceless connections.</p>
          <button className="btn-primary" style={{ marginTop: '2rem' }}>Get Started Today</button>
        </div>
      </section>
    </main>
  );
}
