import React from "react";

function ChildSafety() {
    const styles = {
        container: {
            padding: "40px 20px",
            background: "linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)",
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
            borderRadius: "30px",
            padding: "60px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
            fontFamily: "'Poppins', sans-serif",
            color: "#2d3748",
            lineHeight: "1.8",
        },
        header: {
            textAlign: "center",
            marginBottom: "50px",
            borderBottom: "4px solid #feb2b2",
            paddingBottom: "30px",
        },
        title: {
            fontSize: "3.5rem",
            color: "#c53030",
            fontWeight: "900",
            margin: "0 0 10px 0",
            letterSpacing: "-1px",
        },
        subtitle: {
            color: "#4a5568",
            fontSize: "1.3rem",
            fontWeight: "500",
        },
        section: {
            marginBottom: "50px",
        },
        sectionTitle: {
            fontSize: "2rem",
            color: "#1a202c",
            fontWeight: "800",
            marginBottom: "25px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
        },
        sectionTitleIcon: {
            width: "10px",
            height: "40px",
            backgroundColor: "#e53e3e",
            borderRadius: "5px",
        },
        paragraph: {
            margin: "0 0 25px 0",
            fontSize: "1.15rem",
            color: "#4a5568",
        },
        list: {
            listStyleType: "none",
            padding: 0,
            margin: "0 0 35px 0",
        },
        listItem: {
            padding: "15px 20px 15px 55px",
            fontSize: "1.1rem",
            position: "relative",
            color: "#2d3748",
            backgroundColor: "#fff5f5",
            borderRadius: "15px",
            marginBottom: "15px",
            transition: "all 0.3s ease",
            borderLeft: "0px solid #e53e3e",
        },
        bullet: {
            position: "absolute",
            left: "20px",
            color: "#e53e3e",
            fontWeight: "900",
            fontSize: "1.4rem",
        },
        highlightBox: {
            backgroundColor: "#1a202c",
            color: "#f7fafc",
            padding: "40px",
            borderRadius: "20px",
            marginTop: "40px",
            borderLeft: "10px solid #e53e3e",
            boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
        },
        importantText: {
            color: "#e53e3e",
            fontWeight: "800",
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
            marginTop: "20px",
        },
        card: {
            padding: "25px",
            background: "white",
            borderRadius: "15px",
            border: "1px solid #fed7d7",
            boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
        }
    };

    const BulletItem = ({ children }) => (
        <li 
            style={styles.listItem} 
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(10px)";
                e.currentTarget.style.borderLeftWidth = "5px";
                e.currentTarget.style.boxShadow = "0 5px 15px rgba(229, 62, 62, 0.1)";
            }} 
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.borderLeftWidth = "0px";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            <span style={styles.bullet}>✓</span>
            {children}
        </li>
    );

    return (
        <div style={styles.container}>
            <div style={styles.contentWrapper}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Child Safety & Matrimony</h1>
                    <p style={styles.subtitle}>Our commitment to ethical matchmaking and the protection of children.</p>
                </div>

                <div style={styles.section}>
                    <div style={styles.sectionTitle}>
                        <div style={styles.sectionTitleIcon}></div>
                        <h2>Strict Legal Compliance</h2>
                    </div>
                    <p style={styles.paragraph}>
                        Golden Match strictly adheres to the legal age requirements for marriage. We believe that a strong foundation for marriage begins with maturity and legal compliance.
                    </p>
                    <div style={styles.grid}>
                        <div style={styles.card}>
                            <h3 style={{ color: "#c53030", marginTop: 0 }}>Legal Age of Marriage</h3>
                            <p>We strictly follow the <span style={styles.importantText}>Prohibition of Child Marriage Act</span>. Registration is only permitted for individuals who have reached the legal age for marriage.</p>
                        </div>
                        <div style={styles.card}>
                            <h3 style={{ color: "#c53030", marginTop: 0 }}>Identity Verification</h3>
                            <p>We implement mandatory document checks to ensure that no minor is able to create a profile or misrepresent their age.</p>
                        </div>
                    </div>
                </div>

                <div style={styles.section}>
                    <div style={styles.sectionTitle}>
                        <div style={styles.sectionTitleIcon}></div>
                        <h2>Protection of Minors</h2>
                    </div>
                    <ul style={styles.list}>
                        <BulletItem>
                            <span style={styles.importantText}>Zero Child Marriage Policy:</span> We actively monitor and block any profiles that suggest or promote child marriage.
                        </BulletItem>
                        <BulletItem>
                            <span style={styles.importantText}>Privacy of Children:</span> For members who are windows or divorcees with children, we advise <span style={styles.importantText}>never</span> sharing photos or specific details of your children on your public profile.
                        </BulletItem>
                        <BulletItem>
                            <span style={styles.importantText}>Background Checks:</span> We encourage families to conduct thorough background checks and never allow unsupervised interaction between a match and your children in the early stages.
                        </BulletItem>
                    </ul>
                </div>

                <div style={styles.section}>
                    <div style={styles.sectionTitle}>
                        <div style={styles.sectionTitleIcon}></div>
                        <h2>Red Flags to Watch For</h2>
                    </div>
                    <p style={styles.paragraph}>
                        Be vigilant and report any member who exhibits the following behaviors:
                    </p>
                    <ul style={styles.list}>
                        <BulletItem>Asking for photos or personal information of your children too early in the conversation.</BulletItem>
                        <BulletItem>Insisting on meeting your children before a significant level of trust is established with you.</BulletItem>
                        <BulletItem>Providing inconsistent information regarding their own family or background.</BulletItem>
                        <BulletItem>Expressing views that seem to justify or normalize child marriage or exploitation.</BulletItem>
                    </ul>
                </div>

                <div style={styles.section}>
                    <div style={styles.sectionTitle}>
                        <div style={styles.sectionTitleIcon}></div>
                        <h2>Our Technology for Safety</h2>
                    </div>
                    <p style={styles.paragraph}>
                        We use advanced AI and human moderation to keep the platform safe:
                    </p>
                    <ul style={styles.list}>
                        <BulletItem>AI-driven image scanning to prevent the upload of inappropriate child-related content.</BulletItem>
                        <BulletItem>Keyword filtering to flag conversations that may involve threats to child safety.</BulletItem>
                        <BulletItem>Proactive coordination with cyber-security cells to report suspicious activities.</BulletItem>
                    </ul>
                </div>

                <div style={styles.highlightBox}>
                    <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#feb2b2", fontSize: "1.5rem" }}>REPORT SUSPICIOUS ACTIVITY</h3>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: "1.1rem" }}>
                        Protecting children is a collective responsibility. If you see something, say something. 
                        Contact our dedicated 24/7 Safety Team at <span style={{ fontWeight: 700, textDecoration: "underline" }}>support@infoyashonand.com</span> or use the 
                        <span style={{ fontWeight: 700 }}> 'REPORT'</span> feature on any profile immediately.
                    </p>
                </div>

                <div style={{ textAlign: "center", marginTop: "60px", color: "#718096", fontSize: "1rem" }}>
                    © 2026 Golden Match Matrimony. Committed to Building Safe Families for a Better Future.
                </div>
            </div>
        </div>
    );
}

export default ChildSafety;
