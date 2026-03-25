import React from "react";

function TermsAndConditions() {
    const styles = {
        container: {
            padding: "40px 20px",
            background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        },
        content: {
            maxWidth: "900px",
            width: "100%",
            background: "white",
            padding: "50px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            color: "#333",
        },
        title: {
            fontSize: "2.5rem",
            marginBottom: "30px",
            color: "#2c3e50",
            borderBottom: "2px solid #eee",
            paddingBottom: "15px",
        },
        sectionTitle: {
            fontSize: "1.4rem",
            color: "#34495e",
            marginTop: "25px",
            marginBottom: "10px",
            fontWeight: "600",
        },
        text: {
            lineHeight: "1.6",
            color: "#555",
            marginBottom: "15px",
            fontSize: "1rem",
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}>Terms and Conditions</h1>
                <p style={styles.text}>Effective Date: 20/01/2026</p>

                <h2 style={styles.sectionTitle}>1. Introduction</h2>
                <p style={styles.text}>
                    Welcome to Golden Match. By accessing or using our website, you agree to be bound by these terms and conditions. If you disagree with any part of these terms, you may not access the service.
                </p> 

                <h2 style={styles.sectionTitle}>2. Eligibility</h2>
                <p style={styles.text}>
                    You must be at least 18 years of age to use this Service. By using this Service, you warrant that you have the right, authority, and capacity to enter into this Agreement.
                </p>

                <h2 style={styles.sectionTitle}>3. Account Responsibilities</h2>
                <p style={styles.text}>
                    You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                </p>

                <h2 style={styles.sectionTitle}>4. User Content</h2>
                <p style={styles.text}>
                    You retain ownership of the photos and information you upload. However, by uploading content, you grant us a license to use, display, and distribute such content in connection with the Service.
                </p>

                <h2 style={styles.sectionTitle}>5. Prohibited Activities</h2>
                <p style={styles.text}>
                    Harassment, creating fake profiles, or soliciting money from other users is strictly prohibited and will result in immediate account termination.
                </p>

                <h2 style={styles.sectionTitle}>6. Disclaimer</h2>
                <p style={styles.text}>
                    We do not guarantee that you will find a match. The Service is provided "as is" without warranties of any kind.
                </p>

                <h2 style={styles.sectionTitle}>7. Changes to Terms</h2>
                <p style={styles.text}>
                    We reserve the right to modify these terms at any time. Your continued use of the Service after changes constitutes acceptance of the new terms.
                </p>

                <h2 style={styles.sectionTitle}>8. Contact Us</h2>
                <p style={styles.text}>
                    If you have any questions about these Terms, please contact us.
                </p>
            </div>
        </div>
    );
}

export default TermsAndConditions;
