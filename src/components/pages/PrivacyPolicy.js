import React from "react";

function PrivacyPolicy() {
    const styles = {
        container: {
            padding: "40px 20px",
            background: "linear-gradient(135deg, #c3dafe 0%, #e9d5ff 100%)",
            minHeight: "100vh",
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "center",
        },
        contentWrapper: {
            maxWidth: "1000px",
            width: "100%",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "40px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: "#333",
            lineHeight: "1.6",
        },
        header: {
            textAlign: "center",
            marginBottom: "40px",
            borderBottom: "2px solid #f0f0f0",
            paddingBottom: "20px",
        },
        title: {
            fontSize: "2.5rem",
            color: "#7c3aed",
            fontWeight: "700",
            margin: "0 0 10px 0",
        },
        effectiveDate: {
            color: "#6b7280",
            fontSize: "1rem",
            fontStyle: "italic",
        },
        section: {
            marginBottom: "30px",
        },
        sectionTitle: {
            fontSize: "1.5rem",
            color: "#4c1d95", // Deep purple
            fontWeight: "600",
            marginBottom: "15px",
            borderLeft: "4px solid #7c3aed",
            paddingLeft: "15px",
        },
        paragraph: {
            margin: "0 0 15px 0",
            fontSize: "1.05rem",
            color: "#374151",
        },
        list: {
            listStyleType: "none",
            padding: 0,
            margin: "0 0 20px 0",
        },
        listItem: {
            padding: "8px 0 8px 25px",
            fontSize: "1.05rem",
            position: "relative",
            color: "#374151",
        },
        bullet: {
            position: "absolute",
            left: "0",
            color: "#7c3aed",
            fontWeight: "bold",
        },
        nestedList: {
            marginLeft: "20px",
            marginTop: "10px",
            listStyleType: "disc",
            color: "#4b5563",
        },
        contactBox: {
            backgroundColor: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "20px",
            marginTop: "20px",
        },
    };

    const BulletItem = ({ children }) => (
        <li style={styles.listItem}>
            <span style={styles.bullet}>•</span>
            {children}
        </li>
    );

    return (
        <div style={styles.container}>
            <div style={styles.contentWrapper}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Privacy Policy</h1>
                </div>

                <div style={styles.section}>
                    <p style={styles.paragraph}>
                        Welcome to <strong>Golden Match</strong>.
                        We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our matrimony services.
                    </p>
                    <p style={styles.paragraph}>
                        By using our website, you agree to this Privacy Policy.
                    </p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>1. Information We Collect</h2>
                    <p style={styles.paragraph}>We collect information to provide better matchmaking services:</p>

                    <h3 style={{ ...styles.paragraph, fontWeight: 'bold', marginTop: '20px' }}>Personal Information</h3>
                    <ul style={styles.list}>
                        <BulletItem>Full Name</BulletItem>
                        <BulletItem>Gender</BulletItem>
                        <BulletItem>Date of Birth / Age</BulletItem>
                        <BulletItem>Email Address</BulletItem>
                        <BulletItem>Mobile Number</BulletItem>
                        <BulletItem>Religion, Caste, Community</BulletItem>
                        <BulletItem>Education and Profession</BulletItem>
                        <BulletItem>Marital Status</BulletItem>
                        <BulletItem>Profile Photos</BulletItem>
                    </ul>

                    <h3 style={{ ...styles.paragraph, fontWeight: 'bold', marginTop: '20px' }}>Account Information</h3>
                    <ul style={styles.list}>
                        <BulletItem>Username and Password</BulletItem>
                        <BulletItem>Partner Preferences</BulletItem>
                        <BulletItem>Profile Description</BulletItem>
                    </ul>

                    <h3 style={{ ...styles.paragraph, fontWeight: 'bold', marginTop: '20px' }}>Technical Information</h3>
                    <ul style={styles.list}>
                        <BulletItem>IP Address</BulletItem>
                        <BulletItem>Browser and Device Information</BulletItem>
                        <BulletItem>Login Activity</BulletItem>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>2. How We Use Your Information</h2>
                    <p style={styles.paragraph}>Your information is used to:</p>
                    <ul style={styles.list}>
                        <BulletItem>Create and manage your matrimony profile</BulletItem>
                        <BulletItem>Show matching profiles based on preferences</BulletItem>
                        <BulletItem>Enable communication between members</BulletItem>
                        <BulletItem>Improve website performance and user experience</BulletItem>
                        <BulletItem>Send service-related notifications</BulletItem>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>3. Profile Visibility & Privacy Control</h2>
                    <ul style={styles.list}>
                        <BulletItem>Your profile is visible only to registered users.</BulletItem>
                        <BulletItem>Contact details are shared only with your permission.</BulletItem>
                        <BulletItem>You can control profile visibility from your account settings.</BulletItem>
                        <BulletItem>We do not sell or rent your personal data to third parties.</BulletItem>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>4. Photos & User Content</h2>
                    <ul style={styles.list}>
                        <BulletItem>Users must upload genuine and respectful photos.</BulletItem>
                        <BulletItem>Inappropriate, fake, or offensive content will be removed.</BulletItem>
                        <BulletItem>Photos are shown based on your privacy settings.</BulletItem>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>5. Data Security</h2>
                    <p style={styles.paragraph}>We use reasonable security measures to protect your data, including:</p>
                    <ul style={styles.list}>
                        <BulletItem>Secure servers</BulletItem>
                        <BulletItem>Password encryption</BulletItem>
                        <BulletItem>Limited access to user information</BulletItem>
                    </ul>
                    <p style={styles.paragraph}>Despite our efforts, no online platform can guarantee 100% security.</p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>6. Cookies Policy</h2>
                    <p style={styles.paragraph}>We use cookies to:</p>
                    <ul style={styles.list}>
                        <BulletItem>Maintain login sessions</BulletItem>
                        <BulletItem>Improve website functionality</BulletItem>
                        <BulletItem>Analyze traffic for better services</BulletItem>
                    </ul>
                    <p style={styles.paragraph}>You can disable cookies in your browser settings if you prefer.</p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>7. Third-Party Services</h2>
                    <p style={styles.paragraph}>We may use trusted third-party services such as:</p>
                    <ul style={styles.list}>
                        <BulletItem>Payment gateways</BulletItem>
                        <BulletItem>SMS / Email services</BulletItem>
                        <BulletItem>Analytics tools</BulletItem>
                    </ul>
                    <p style={styles.paragraph}>These services have their own privacy policies.</p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>8. Account Deletion</h2>
                    <p style={styles.paragraph}>You can delete your account at any time through:</p>
                    <ul style={styles.list}>
                        <BulletItem>Account settings</BulletItem>
                        <BulletItem>Contacting customer support</BulletItem>
                    </ul>
                    <p style={styles.paragraph}>Once deleted, your profile will no longer be visible on the website.</p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>9. Age Restriction</h2>
                    <p style={styles.paragraph}>
                        This matrimony website is strictly for users 18 years and above.
                        We do not allow registration of minors.
                    </p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>10. Policy Updates</h2>
                    <p style={styles.paragraph}>
                        We may update this Privacy Policy when required.
                        Any changes will be posted on this page.
                    </p>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>11. Contact Us</h2>
                    <p style={styles.paragraph}>If you have any questions about this Privacy Policy, contact us at:</p>
                    <div style={styles.contactBox}>
                        <p style={{ ...styles.paragraph, marginBottom: '5px' }}><strong>Email:</strong> support@infoyashonand.com</p>
                        <p style={{ ...styles.paragraph, marginBottom: '5px' }}><strong>Phone:</strong> +91 8055514368</p>
                        <p style={{ ...styles.paragraph, marginBottom: '0' }}><strong>Address:</strong> infoyashonand technology pvt.ltd  vishrambaug , sangli , maharashtra 416416</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
