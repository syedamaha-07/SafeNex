"use client";

import styles from './Contact.module.css';

export default function ContactPage() {
    return (
        <main className={styles.main}>
            <header className={styles.pageHeader}>
                <div className={styles.badge}>Get In Touch</div>
                <h1 className="gradient-text">Priority Support</h1>
                <p>Our dedicated team is ready to answer your questions and help you secure what matters most.</p>
            </header>

            <section className={styles.contactContainer}>
                <div className={styles.contactInfo}>
                    <div className={styles.infoCard}>
                        <span className={styles.icon}>🏢</span>
                        <h3>Headquarters</h3>
                        <p>100 Guardian Way<br />Tech District, CA 94103</p>
                    </div>

                    <div className={styles.infoCard}>
                        <span className={styles.icon}>📞</span>
                        <h3>Direct Line</h3>
                        <p>+1 (800) 555-SAFE<br />Mon-Fri, 9am - 8pm EST</p>
                    </div>

                    <div className={styles.infoCard}>
                        <span className={styles.icon}>✉️</span>
                        <h3>Email Us</h3>
                        <p>support@safenex.com<br />partners@safenex.com</p>
                    </div>
                </div>

                <div className={styles.contactForm}>
                    <h3>Send a secure message</h3>
                    <p className={styles.formDesc}>All communications are end-to-end encrypted for your privacy.</p>

                    <form className={styles.formElements} onSubmit={(e) => e.preventDefault()}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" placeholder="Jane Doe" required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" placeholder="jane@example.com" required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="topic">Reason for contact</label>
                            <select id="topic" defaultValue="support">
                                <option value="sales">Enterprise Sales</option>
                                <option value="support">Technical Support</option>
                                <option value="partnership">Partnership</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="message">Message</label>
                            <textarea id="message" rows={5} placeholder="How can our team assist you today?" required></textarea>
                        </div>

                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                            Send Message
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}
