import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiShield, FiHeart, FiLock, FiUser, FiX, FiCheckCircle,
    FiSearch, FiMessageCircle, FiStar, FiInstagram, FiFacebook,
    FiTwitter, FiArrowRight, FiSmartphone, FiUsers, FiAward,
    FiEye, FiEyeOff
} from "react-icons/fi";
import { FaRing } from "react-icons/fa";

function LandingPage({ onLoginSuccess }) {
    const navigate = useNavigate();
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });
    const [loginError, setLoginError] = useState("");
    const [loading, setLoading] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showAdminPassword, setShowAdminPassword] = useState(false);

    // Image Constants (High Quality Unsplash IDs)
    const IMAGES = {
        HERO: "https://images.unsplash.com/photo-1511285560929-83b456ffdb6c?auto=format&fit=crop&q=80&w=1920", // Romantic Wedding Couple
        ABOUT: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?auto=format&fit=crop&q=80&w=1000", // Traditional Indian Jewelry/Bride
        TRUST: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1000", // Wedding Rings/Commitment
        MOBILE: "https://images.unsplash.com/photo-1556656793-08538bc3d666?auto=format&fit=crop&q=80&w=1000"
    };

    const logAction = (action) => {
        console.log(`[Golden Match Log]: ${action} - ${new Date().toISOString()}`);
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleAdminLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setLoginError("");
        logAction("Admin login attempt initiated");
        setTimeout(() => {
            if (adminCredentials.username === "goldenmatchadmin@gmail.com" && adminCredentials.password === "GoldenMatch@1234") {
                logAction("Admin login successful");
                setShowAdminModal(false);
                setAdminCredentials({ username: "", password: "" });
                // Globally log in the user
                localStorage.setItem("isAdmin", "true");
                if (onLoginSuccess) {
                    onLoginSuccess();
                } else {
                    navigate("/home");
                }
            } else {
                logAction("Admin login failed - invalid credentials");
                setLoginError("Invalid username or password");
            }
            setLoading(false);
        }, 1200);
    };

    const styles = {
        container: {
            width: "100%",
            fontFamily: "'Poppins', sans-serif",
            color: "#333",
            overflowX: "hidden",
            backgroundColor: "#fff",
        },
        // NAVBAR
        navbar: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            padding: scrolled ? "15px 40px" : "30px 50px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 1000,
            background: scrolled ? "rgba(255, 255, 255, 0.98)" : "transparent",
            backdropFilter: scrolled ? "blur(10px)" : "none",
            boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.4s ease",
            boxSizing: "border-box",
        },
        logo: {
            fontSize: "1.8rem",
            fontWeight: "900",
            color: scrolled ? "#e11d48" : "white",
            textTransform: "uppercase",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            letterSpacing: "1px",
        },
        navLinks: { display: "flex", gap: "30px", alignItems: "center" },
        navLink: {
            color: scrolled ? "#1f2937" : "white",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "color 0.3s",
        },
        adminBtn: {
            padding: "10px 24px",
            background: scrolled ? "#e11d48" : "rgba(255,255,255,0.15)",
            color: "white",
            border: scrolled ? "none" : "1px solid rgba(255,255,255,0.5)",
            borderRadius: "50px",
            cursor: "pointer",
            fontWeight: "600",
            backdropFilter: "blur(4px)",
            transition: "all 0.3s",
            display: "flex",
            alignItems: "center",
            gap: "8px",
        },

        // HERO
        heroSection: {
            height: "100vh",
            width: "100%",
            background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('${IMAGES.HERO}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "white",
            padding: "20px",
            boxSizing: "border-box",
        },
        heroContent: { maxWidth: "1000px", animation: "fadeUp 1s ease-out" },
        heroTitle: {
            fontSize: "clamp(3.5rem, 6vw, 5.5rem)",
            fontWeight: "800",
            marginBottom: "15px",
            textShadow: "0 10px 30px rgba(0,0,0,0.3)",
            lineHeight: "1.1",
            letterSpacing: "-1px",
        },
        heroSubtitle: {
            fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
            fontWeight: "400",
            marginBottom: "50px",
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            opacity: 0.95,
        },
        ctaButton: {
            padding: "20px 60px",
            fontSize: "1.3rem",
            fontWeight: "700",
            borderRadius: "50px",
            border: "none",
            background: "#e11d48",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 20px 40px rgba(225, 29, 72, 0.4)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            margin: "0 auto",
        },

        // ABOUT SECTION (New)
        aboutSection: {
            padding: "100px 5%",
            display: "flex",
            alignItems: "center",
            gap: "60px",
            background: "#fff",
            flexWrap: "wrap",
        },
        aboutImageWrapper: {
            flex: "1 1 500px",
            height: "600px",
            borderRadius: "30px",
            overflow: "hidden",
            boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
            position: "relative",
        },
        aboutImage: { width: "100%", height: "100%", objectFit: "cover" },
        aboutContent: { flex: "1 1 500px", maxWidth: "600px" },
        sectionLabel: { color: "#e11d48", fontWeight: "700", letterSpacing: "2px", fontSize: "0.9rem", marginBottom: "10px", display: "block" },
        sectionTitle: { fontSize: "3rem", fontWeight: "800", color: "#111827", marginBottom: "25px", lineHeight: "1.2" },
        sectionText: { fontSize: "1.1rem", color: "#6b7280", lineHeight: "1.8", marginBottom: "30px" },
        statsRow: { display: "flex", gap: "40px", marginTop: "40px" },
        statItem: { display: "flex", flexDirection: "column" },
        statNum: { fontSize: "2.5rem", fontWeight: "800", color: "#e11d48" },
        statLabel: { fontSize: "1rem", color: "#4b5563", fontWeight: "500" },

        // FEATURES
        featuresSection: {
            padding: "100px 5%",
            background: "#f9fafb",
            textAlign: "center",
        },
        featuresGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "40px",
            marginTop: "60px",
        },
        featureCard: {
            background: "white",
            padding: "50px 30px",
            borderRadius: "24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            transition: "all 0.3s ease",
            cursor: "pointer",
            textAlign: "left",
            border: "1px solid rgba(0,0,0,0.03)",
        },
        featureIcon: {
            width: "70px", height: "70px", borderRadius: "18px",
            background: "#ffe4e6", color: "#e11d48", fontSize: "30px",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "25px",
        },
        featureTitle: { fontSize: "1.5rem", fontWeight: "700", marginBottom: "15px", color: "#111827" },
        featureDesc: { color: "#6b7280", lineHeight: "1.6" },

        // TRUST BANNER
        trustSection: {
            background: `linear-gradient(rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0.9)), url('${IMAGES.TRUST}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "100px 5%",
            textAlign: "center",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },

        // FOOTER
        footer: {
            background: "#0f172a",
            color: "#94a3b8",
            padding: "80px 5% 30px 5%",
        },
        footerGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "50px",
            maxWidth: "1400px",
            margin: "0 auto",
            borderBottom: "1px solid #334155",
            paddingBottom: "60px",
        },
        colTitle: { color: "white", fontSize: "1.2rem", fontWeight: "700", marginBottom: "25px" },
        linkItem: { display: "block", marginBottom: "15px", cursor: "pointer", transition: "color 0.3s" },
    };

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <nav style={styles.navbar}>
                <div style={styles.logo} onClick={() => navigate("/")}>
                    <FaRing /> Golden Match
                </div>
                <div style={styles.navLinks}>
                    {!scrolled && (
                        <>
                            <span style={styles.navLink} onClick={() => navigate("/login")}>Login</span>
                            <span style={styles.navLink} onClick={() => navigate("/registration")}>Register</span>
                        </>
                    )}
                    <button style={styles.adminBtn} onClick={() => setShowAdminModal(true)}>
                        <FiShield /> Admin Login
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div style={styles.heroSection}>
                <div style={{ ...styles.heroContent, animation: "fadeInUp 0.8s ease-out" }}>
                    <h1 style={styles.heroTitle}>Match Made in Heaven <br /> Begins Locally.</h1>
                    <p style={styles.heroSubtitle}>
                        Join India's most trusted matrimony platform. <br />
                        Over 2 Million verified profiles waiting for you.
                    </p>
                    <button
                        style={styles.ctaButton}
                        onClick={() => navigate("/login")}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 25px 50px rgba(225,29,72,0.6)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(225,29,72,0.4)"; }}
                    >
                        Find Your Soulmate <FiArrowRight />
                    </button>
                </div>
            </div>

            {/* About Section */}
            <div style={styles.aboutSection}>
                <div style={styles.aboutImageWrapper}>
                    <img src={IMAGES.ABOUT} alt="Couple" style={styles.aboutImage} />
                </div>
                <div style={styles.aboutContent}>
                    <span style={styles.sectionLabel}>WHY CHOOSE GOLDEN MATCH</span>
                    <h2 style={styles.sectionTitle}>Bringing Hearts Together, <br /> One Story at a Time.</h2>
                    <p style={styles.sectionText}>
                        We understand that marriage is not just about two individuals, but the union of two families.
                        Our platform is designed with Indian traditions and values at its core, blending them seamlessly with modern technology
                        to help you find a companion who truly complements you.
                    </p>
                    <div style={styles.statsRow}>
                        <div style={styles.statItem}>
                            <span style={styles.statNum}>100%</span>
                            <span style={styles.statLabel}>Verified Profiles</span>
                        </div>
                        <div style={styles.statItem}>
                            <span style={styles.statNum}>2M+</span>
                            <span style={styles.statLabel}>Active Users</span>
                        </div>
                        <div style={styles.statItem}>
                            <span style={styles.statNum}>15+</span>
                            <span style={styles.statLabel}>Years of Trust</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div style={styles.featuresSection}>
                <span style={styles.sectionLabel}>HOW IT WORKS</span>
                <h2 style={styles.sectionTitle}>Your Journey to Forever</h2>
                <div style={styles.featuresGrid}>
                    <div style={styles.featureCard} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-10px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                        <div style={styles.featureIcon}><FiUser /></div>
                        <h3 style={styles.featureTitle}>Create Profile</h3>
                        <p style={styles.featureDesc}>Register for free and showcase your personality with a detailed profile and photos.</p>
                    </div>
                    <div style={styles.featureCard} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-10px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                        <div style={styles.featureIcon}><FiSearch /></div>
                        <h3 style={styles.featureTitle}>Browse Matches</h3>
                        <p style={styles.featureDesc}>Use our advanced filters to find matches by community, profession, location, and more.</p>
                    </div>
                    <div style={styles.featureCard} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-10px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                        <div style={styles.featureIcon}><FiMessageCircle /></div>
                        <h3 style={styles.featureTitle}>Connect & Chat</h3>
                        <p style={styles.featureDesc}>Start a conversation securely. Get to know each other before taking the next big step.</p>
                    </div>
                </div>
            </div>

            {/* Trust Section */}
            <div style={styles.trustSection}>
                <FiLock size={50} color="#e11d48" style={{ marginBottom: "20px" }} />
                <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "20px" }}>Your Privacy is Our Priority</h2>
                <p style={{ maxWidth: "700px", fontSize: "1.2rem", lineHeight: "1.6", opacity: 0.9, marginBottom: "40px" }}>
                    We ensure 100% data security and privacy. Your contact details are safe and only shared with matches you approve.
                </p>
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.1)", padding: "10px 20px", borderRadius: "30px" }}>
                        <FiCheckCircle color="#10b981" /> Manual Screening
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.1)", padding: "10px 20px", borderRadius: "30px" }}>
                        <FiCheckCircle color="#10b981" /> Secure Servers
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.1)", padding: "10px 20px", borderRadius: "30px" }}>
                        <FiCheckCircle color="#10b981" /> ID Verification
                    </div>
                </div>
            </div>

            {/* Large Footer */}
            <div style={styles.footer}>
                <div style={styles.footerGrid}>
                    <div>
                        <div style={{ ...styles.logo, color: "white", marginBottom: "20px", fontSize: "1.5rem" }}>
                            <FaRing /> GOLDEN MATCH
                        </div>
                        <p style={{ lineHeight: "1.6", opacity: 0.8 }}>
                            The most trusted matrimony brand <br /> helping happy marriages happen <br /> since 2010.
                        </p>
                    </div>
                    <div>
                        <h4 style={styles.colTitle}>Company</h4>
                        <span style={styles.linkItem} onClick={() => navigate("#")}>About Us</span>
                        <span style={styles.linkItem} onClick={() => navigate("/privacy-policy")}>Privacy Policy</span>
                        <span style={styles.linkItem} onClick={() => navigate("/terms")}>Terms & Conditions</span>
                        <span style={styles.linkItem}>Careers</span>
                    </div>
                    <div>
                        <h4 style={styles.colTitle}>Help & Support</h4>
                        <span style={styles.linkItem}>24x7 Live Chat</span>
                        <span style={styles.linkItem}>Contact Us</span>
                        <span style={styles.linkItem}>Feedback</span>
                        <span style={styles.linkItem}>FAQs</span>
                    </div>
                    <div>
                        <h4 style={styles.colTitle}>Connect</h4>
                        <div style={{ display: "flex", gap: "20px", fontSize: "1.5rem", color: "white" }}>
                            <FiInstagram style={{ cursor: "pointer" }} />
                            <FiFacebook style={{ cursor: "pointer" }} />
                            <FiTwitter style={{ cursor: "pointer" }} />
                        </div>
                        <button style={{ marginTop: "30px", background: "#e11d48", border: "none", color: "white", padding: "12px 25px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                            <FiSmartphone /> Get App
                        </button>
                    </div>
                </div>
                <div style={{ textAlign: "center", borderTop: "1px solid #334155", paddingTop: "30px", fontSize: "0.9rem", opacity: 0.6 }}>
                    © 2026 Golden Match. All rights reserved. Made with love in India.
                </div>
            </div>


            {/* Admin Modal */}
            {showAdminModal && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)",
                    backdropFilter: "blur(5px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000
                }} onClick={(e) => e.target === e.currentTarget && setShowAdminModal(false)}>
                    <div style={{ background: "white", padding: "40px", borderRadius: "16px", width: "90%", maxWidth: "400px", textAlign: "center", position: 'relative' }}>
                        <button onClick={() => setShowAdminModal(false)} style={{ position: 'absolute', top: 15, right: 15, border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}><FiX /></button>
                        <h2 style={{ color: "#1f2937", marginBottom: "20px" }}>Admin Login</h2>
                        <form onSubmit={handleAdminLogin}>
                            <div style={{ position: "relative", marginBottom: "15px" }}>
                                <FiUser style={{ position: "absolute", left: "12px", top: "14px", color: "#9ca3af" }} />
                                <input
                                    type="email"
                                    placeholder="Admin Email"
                                    style={{ width: "100%", padding: "12px 12px 12px 40px", border: "1px solid #ddd", borderRadius: "8px", boxSizing: "border-box", outline: 'none' }}
                                    value={adminCredentials.username}
                                    onChange={e => setAdminCredentials({ ...adminCredentials, username: e.target.value })}
                                />
                            </div>
                            <div style={{ position: "relative", marginBottom: "20px" }}>
                                <FiLock style={{ position: "absolute", left: "12px", top: "14px", color: "#9ca3af" }} />
                                <input
                                    type={showAdminPassword ? "text" : "password"}
                                    placeholder="Password"
                                    style={{ width: "100%", padding: "12px 40px 12px 40px", border: "1px solid #ddd", borderRadius: "8px", boxSizing: "border-box", outline: 'none' }}
                                    value={adminCredentials.password}
                                    onChange={e => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                                />
                                <div 
                                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                                    style={{ position: "absolute", right: "12px", top: "12px", color: "#9ca3af", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                    {showAdminPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </div>
                            </div>
                            {loginError && <p style={{ color: "red", fontSize: "0.9rem", marginBottom: "15px" }}>{loginError}</p>}
                            <button type="submit" style={{ width: "100%", padding: "12px", background: "#e11d48", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: loading ? "wait" : "pointer" }} disabled={loading}>
                                {loading ? "Verifying..." : "Login"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

export default LandingPage;
