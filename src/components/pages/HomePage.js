import React, { useState, useEffect, useRef, useCallback } from "react";
import { getDatabase, ref, get, query, orderByKey, startAfter, limitToFirst, remove } from "firebase/database";
import { useNavigate, useLocation } from "react-router-dom";
import { FiUser, FiLock, FiHeart, FiShield, FiX, FiMapPin, FiCalendar, FiArrowRight, FiInfo, FiCamera, FiTrash2, FiSearch, FiCheckCircle, FiEye, FiEyeOff } from "react-icons/fi";

function HomePage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [totalPagesDiscovered, setTotalPagesDiscovered] = useState(1);
    const [loadingPage, setLoadingPage] = useState(null);
    const [isDiscoveringPages, setIsDiscoveringPages] = useState(false);
    const [estimatedTotalPages, setEstimatedTotalPages] = useState(null);
    const [pageSearchValue, setPageSearchValue] = useState("");
    const [searchingPage, setSearchingPage] = useState(false);
    const [totalUsers, setTotalUsers] = useState(0);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [isAdminLoading, setIsAdminLoading] = useState(false);
    const [showAdminPassword, setShowAdminPassword] = useState(false);
    const isRestoringStateRef = useRef(false);

    const [pageKeys, setPageKeys] = useState(() => {
        const savedKeys = localStorage.getItem("matrimony_users_pageKeys");
        if (savedKeys) {
            try {
                const parsed = JSON.parse(savedKeys);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            } catch { }
        }
        return [null];
    });

    const [currentPage, setCurrentPage] = useState(() => {
        const savedPage = localStorage.getItem("matrimony_users_page");
        return savedPage ? parseInt(savedPage, 10) : 0;
    });

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1200);
    const navigate = useNavigate();
    const location = useLocation();
    const scrollPositionRef = useRef(0);
    const isImageUrl = useCallback((url) => {
        if (!url || typeof url !== 'string') return false;
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        const lowerUrl = url.toLowerCase();
        return (lowerUrl.startsWith('http://') || lowerUrl.startsWith('https://')) &&
            imageExtensions.some(ext => lowerUrl.includes(ext));
    }, []);

    const calculateAge = useCallback((dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }, []);

    const genderIcon = useCallback((gender) => {
        if (!gender) return "👤";
        if (gender.toLowerCase() === "male") return "👨";
        if (gender.toLowerCase() === "female") return "👩";
        return "👤";
    }, []);

    const estimateTotalPages = useCallback(async () => {
        try {
            // Optimization: Use shallow REST fetch to get only keys (much faster than fetching all data)
            const dbUrl = "https://scroller-4d10f-default-rtdb.firebaseio.com";
            const response = await fetch(`${dbUrl}/Matrimony/users.json?shallow=true`);

            if (response.ok) {
                const data = await response.json();
                if (data) {
                    const totalUsersCount = Object.keys(data).length;
                    setTotalUsers(totalUsersCount);
                    const estimated = Math.ceil(totalUsersCount / 100);
                    setEstimatedTotalPages(estimated);
                    sessionStorage.setItem("matrimony_estimated_pages", estimated.toString());
                    sessionStorage.setItem("matrimony_total_users", totalUsersCount.toString());
                    console.log(`Estimated total pages (Fast): ${estimated} (${totalUsersCount} users)`);
                    return;
                }
            }

            // Fallback to existing method if fetch fails
            const db = getDatabase();
            const snapshot = await get(ref(db, "Matrimony/users"));
            if (snapshot.exists()) {
                const totalUsersCount = Object.keys(snapshot.val()).length;
                setTotalUsers(totalUsersCount);
                const estimated = Math.ceil(totalUsersCount / 100);
                setEstimatedTotalPages(estimated);
                sessionStorage.setItem("matrimony_estimated_pages", estimated.toString());
                sessionStorage.setItem("matrimony_total_users", totalUsersCount.toString());
                console.log(`Estimated total pages (Fallback): ${estimated} (${totalUsersCount} users)`);
            }
        } catch (error) {
            console.error("Error estimating total pages:", error);
        }
    }, []);

    const discoverPagesBatch = useCallback(async (targetPage) => {
        if (isDiscoveringPages || targetPage < pageKeys.length) return pageKeys;

        setIsDiscoveringPages(true);
        const db = getDatabase();
        let currentKey = pageKeys[pageKeys.length - 1];
        let tempKeys = [...pageKeys];

        try {
            for (let i = pageKeys.length; i <= targetPage; i++) {
                const queryRef = currentKey
                    ? query(ref(db, "Matrimony/users"), orderByKey(), startAfter(currentKey), limitToFirst(100))
                    : query(ref(db, "Matrimony/users"), orderByKey(), limitToFirst(100));

                const snapshot = await get(queryRef);
                if (snapshot.exists()) {
                    const usersData = snapshot.val();
                    const userEntries = Object.entries(usersData);
                    if (userEntries.length > 0) {
                        currentKey = userEntries[userEntries.length - 1][0];
                        tempKeys.push(currentKey);
                        setTotalPagesDiscovered(tempKeys.length);
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }

            setPageKeys(tempKeys);
            localStorage.setItem("matrimony_users_pageKeys", JSON.stringify(tempKeys));
            sessionStorage.setItem("matrimony_users_pageKeys", JSON.stringify(tempKeys));
            return tempKeys;
        } catch (error) {
            console.error("Error discovering pages:", error);
            return pageKeys;
        } finally {
            setIsDiscoveringPages(false);
        }
    }, [isDiscoveringPages, pageKeys]);

    const fetchUsers = useCallback(async (startKey) => {
        // Don't fetch if we're restoring state and already have users for the SAME page
        const savedPage = parseInt(sessionStorage.getItem("matrimony_users_page") || "0", 10);
        if (isRestoringStateRef.current && users.length > 0 && currentPage === savedPage) {
            console.log("Skipping fetch - restoring state with existing users for same page");
            setLoading(false);
            setLoadingPage(null);
            setSearchingPage(false);
            return;
        }

        try {
            setLoading(true);
            console.log("Fetching users with startKey:", startKey, "for page:", currentPage + 1);
            const db = getDatabase();
            const fetchLimit = 101;

            let queryRef;
            if (startKey) {
                queryRef = query(
                    ref(db, "Matrimony/users"),
                    orderByKey(),
                    startAfter(startKey),
                    limitToFirst(fetchLimit)
                );
            } else {
                queryRef = query(
                    ref(db, "Matrimony/users"),
                    orderByKey(),
                    limitToFirst(fetchLimit)
                );
            }

            const snapshot = await get(queryRef);
            if (snapshot.exists()) {
                const usersData = snapshot.val();
                const userEntries = Object.entries(usersData);

                setHasNextPage(userEntries.length > 100);

                const displayUsers = userEntries.slice(0, 100);

                const pageUsers = displayUsers.map(([key, value]) => {
                    const personal = value.personal || {};
                    const educational = value.educational || {};
                    const contact = value.contact || {};
                    const fullName = [personal.firstName, personal.middleName, personal.lastName]
                        .filter(Boolean)
                        .join(" ");
                    const age = personal.dateOfBirth ? calculateAge(personal.dateOfBirth) : "Not specified";

                    let photo = null;
                    if (value.photos && Array.isArray(value.photos) && value.photos.length > 0) {
                        const validPhotos = value.photos.filter(photoUrl =>
                            photoUrl && typeof photoUrl === 'string' && isImageUrl(photoUrl)
                        );
                        if (validPhotos.length > 0) {
                            photo = validPhotos[0];
                        }
                    }

                    return {
                        id: key,
                        name: fullName || "Unnamed User",
                        age,
                        gender: personal.gender || "Not specified",
                        location: educational.currentPlace || educational.district || educational.nativePlace || "Not specified",
                        photo,
                        phoneNumber: personal.phoneNumber || contact.callingNumber || key,
                    };
                });

                setUsers(pageUsers);

                // If we fetched a new page, update the pageKeys for the NEXT page
                if (userEntries.length > 100) {
                    const nextKey = userEntries[100][0];
                    setPageKeys(prev => {
                        const newKeys = [...prev];
                        if (currentPage + 1 < newKeys.length) {
                            newKeys[currentPage + 1] = nextKey;
                        } else if (currentPage + 1 === newKeys.length) {
                            newKeys.push(nextKey);
                        }
                        return newKeys;
                    });
                }
            } else {
                setUsers([]);
                setHasNextPage(false);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]);
            setHasNextPage(false);
        } finally {
            setLoading(false);
            setLoadingPage(null);
            setSearchingPage(false);
            isRestoringStateRef.current = false;
        }
    }, [currentPage, users.length, calculateAge, isImageUrl]);

    const handleAdminLogin = (e) => {
        e.preventDefault();
        setIsAdminLoading(true);
        setLoginError('');

        // Simulate login process
        setTimeout(() => {
            if (loginData.username === 'goldenmatchadmin@gmail.com' && loginData.password === 'GoldenMatch@1234') {
                alert('🎉 Admin Login Successful! Welcome to the Golden Match Admin Panel.');
                setShowLoginModal(false);
                setLoginData({ username: '', password: '' });
            } else {
                setLoginError('Invalid credentials. Please try again.');
            }
            setIsAdminLoading(false);
        }, 1000);
    };

    // Enhanced state restoration
    useEffect(() => {
        const handlePopState = (event) => {
            // Prevent page reload on browser back navigation
            isRestoringStateRef.current = true;
            console.log("Pop state detected - preventing reload");
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1200);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const saveScrollPosition = () => {
            scrollPositionRef.current = window.scrollY;
            sessionStorage.setItem("matrimony_scroll_position", window.scrollY.toString());
        };

        window.addEventListener("beforeunload", saveScrollPosition);
        return () => window.removeEventListener("beforeunload", saveScrollPosition);
    }, []);

    // Enhanced state restoration logic
    useEffect(() => {
        const isComingFromDetails = sessionStorage.getItem("matrimony_returning_from_details");
        const wasNavigated = sessionStorage.getItem("matrimony_navigated");

        if (isComingFromDetails === "true" || wasNavigated === "true") {
            console.log("Restoring state from navigation");
            isRestoringStateRef.current = true;

            // Restore saved state
            const savedPage = sessionStorage.getItem("matrimony_users_page");
            const savedKeys = sessionStorage.getItem("matrimony_users_pageKeys");
            const savedScrollPosition = sessionStorage.getItem("matrimony_scroll_position");
            const savedUsers = sessionStorage.getItem("matrimony_current_users");
            const savedTotalPages = sessionStorage.getItem("matrimony_total_pages");
            const savedEstimatedPages = sessionStorage.getItem("matrimony_estimated_pages");
            const savedTotalUsers = sessionStorage.getItem("matrimony_total_users");

            if (savedPage && savedKeys) {
                const pageNum = parseInt(savedPage, 10);
                const keys = JSON.parse(savedKeys);

                // Restore state without triggering new fetch
                setCurrentPage(pageNum);
                setPageKeys(keys);

                if (savedTotalPages) {
                    setTotalPagesDiscovered(parseInt(savedTotalPages, 10));
                }

                if (savedEstimatedPages) {
                    setEstimatedTotalPages(parseInt(savedEstimatedPages, 10));
                }

                if (savedTotalUsers) {
                    setTotalUsers(parseInt(savedTotalUsers, 10));
                }

                // Restore users data if available
                if (savedUsers) {
                    try {
                        const usersData = JSON.parse(savedUsers);
                        setUsers(usersData);
                        setLoading(false);
                        console.log("Restored users from session storage");
                    } catch (error) {
                        console.log("Error restoring users data, will fetch fresh");
                    }
                }

                // Restore scroll position
                if (savedScrollPosition) {
                    setTimeout(() => {
                        window.scrollTo({
                            top: parseInt(savedScrollPosition, 10),
                            behavior: 'instant'
                        });
                        console.log("Restored scroll position");
                    }, 100);
                }
            }

            // Clear navigation flags
            sessionStorage.removeItem("matrimony_returning_from_details");
            sessionStorage.removeItem("matrimony_navigated");

            // Reset restoration flag after a delay
            setTimeout(() => {
                isRestoringStateRef.current = false;
            }, 1000);
        }
    }, [location.pathname]);

    useEffect(() => {
        estimateTotalPages();
    }, [estimateTotalPages]);

    // Modified useEffect to prevent unnecessary fetching
    // Modified useEffect to handle pagination properly
    useEffect(() => {
        // Determine if we should fetch based on different conditions
        const shouldFetch =
            !isRestoringStateRef.current && (
                users.length === 0 || // First load
                loadingPage !== null || // Page navigation in progress
                currentPage !== parseInt(sessionStorage.getItem("matrimony_users_page") || "0", 10) // Page changed
            );

        if (shouldFetch) {
            console.log("Fetching users for page", currentPage);
            fetchUsers(pageKeys[currentPage]);
        }

        // Always update storage for persistence
        localStorage.setItem("matrimony_users_page", currentPage.toString());
        localStorage.setItem("matrimony_users_pageKeys", JSON.stringify(pageKeys));

        // Also update sessionStorage for immediate restoration
        sessionStorage.setItem("matrimony_users_page", currentPage.toString());
        sessionStorage.setItem("matrimony_users_pageKeys", JSON.stringify(pageKeys));
        sessionStorage.setItem("matrimony_total_pages", totalPagesDiscovered.toString());

        if (estimatedTotalPages) {
            sessionStorage.setItem("matrimony_estimated_pages", estimatedTotalPages.toString());
        }

        if (currentPage + 1 > totalPagesDiscovered) {
            setTotalPagesDiscovered(currentPage + 1);
        }
    }, [currentPage, pageKeys, totalPagesDiscovered, estimatedTotalPages, loadingPage, fetchUsers, users.length]);

    // Save users data whenever it changes
    useEffect(() => {
        if (users.length > 0 && !isRestoringStateRef.current) {
            sessionStorage.setItem("matrimony_current_users", JSON.stringify(users));
            console.log("Saved users to session storage");
        }
    }, [users]);



    // Enhanced handleViewDetails with comprehensive state preservation
    const handleViewDetails = (id) => {
        console.log("Navigating to user details:", id);

        // Save current scroll position
        scrollPositionRef.current = window.scrollY;

        // Save all necessary state to sessionStorage for immediate access
        sessionStorage.setItem("matrimony_users_page", currentPage.toString());
        sessionStorage.setItem("matrimony_users_pageKeys", JSON.stringify(pageKeys));
        sessionStorage.setItem("matrimony_scroll_position", scrollPositionRef.current.toString());
        sessionStorage.setItem("matrimony_current_users", JSON.stringify(users));
        sessionStorage.setItem("matrimony_total_pages", totalPagesDiscovered.toString());
        if (estimatedTotalPages) {
            sessionStorage.setItem("matrimony_estimated_pages", estimatedTotalPages.toString());
        }
        sessionStorage.setItem("matrimony_returning_from_details", "true");
        sessionStorage.setItem("matrimony_navigated", "true");

        // Also save to localStorage for persistence
        localStorage.setItem("matrimony_users_page", currentPage.toString());
        localStorage.setItem("matrimony_users_pageKeys", JSON.stringify(pageKeys));
        localStorage.setItem("matrimony_scroll_position", scrollPositionRef.current.toString());

        console.log("State saved, navigating to details page");

        // Navigate to details page
        navigate(`/user/${id}`);
    };

    // NEW: Handle update photos navigation
    const handleUpdatePhotos = (userId) => {
        console.log("Navigating to update photos for user:", userId);

        // Save current scroll position
        scrollPositionRef.current = window.scrollY;

        // Save all necessary state to sessionStorage for immediate access
        sessionStorage.setItem("matrimony_users_page", currentPage.toString());
        sessionStorage.setItem("matrimony_users_pageKeys", JSON.stringify(pageKeys));
        sessionStorage.setItem("matrimony_scroll_position", scrollPositionRef.current.toString());
        sessionStorage.setItem("matrimony_current_users", JSON.stringify(users));
        sessionStorage.setItem("matrimony_total_pages", totalPagesDiscovered.toString());
        if (estimatedTotalPages) {
            sessionStorage.setItem("matrimony_estimated_pages", estimatedTotalPages.toString());
        }
        sessionStorage.setItem("matrimony_returning_from_details", "true");
        sessionStorage.setItem("matrimony_navigated", "true");

        // Also save to localStorage for persistence
        localStorage.setItem("matrimony_users_page", currentPage.toString());
        localStorage.setItem("matrimony_users_pageKeys", JSON.stringify(pageKeys));
        localStorage.setItem("matrimony_scroll_position", scrollPositionRef.current.toString());

        console.log("State saved, navigating to edit page");

        // Navigate to edit page
        navigate(`/edit/${userId}`);
    };

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete profile of "${userName}"? This action cannot be undone.`)) {
            try {
                setLoading(true);
                const db = getDatabase();
                await remove(ref(db, `Matrimony/users/${userId}`));

                // Update local state
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                setTotalUsers(prev => Math.max(0, prev - 1));

                // User deleted successfully message removed as requested

            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const goToPage = async (targetPage) => {
        if (targetPage === currentPage || targetPage < 0) return;

        console.log("Going to page", targetPage + 1);

        setLoadingPage(targetPage);

        // Clear restoration flag when manually navigating
        isRestoringStateRef.current = false;

        // Clear cached users to force fresh fetch
        setUsers([]);

        // Discover pages if needed
        if (targetPage >= pageKeys.length) {
            await discoverPagesBatch(targetPage);
        }

        setCurrentPage(targetPage);

        if (!isRestoringStateRef.current) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleNextPage = () => {
        if (hasNextPage) {
            goToPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            goToPage(currentPage - 1);
        }
    };

    // Enhanced page number generation with proper sliding window
    const generatePageNumbers = () => {
        const pages = [];
        const totalKnown = Math.max(totalPagesDiscovered, estimatedTotalPages || 1);
        const windowSize = isMobile ? 5 : 10;

        let windowStart = Math.max(0, currentPage - Math.floor(windowSize / 2));
        let windowEnd = windowStart + windowSize;

        if (windowEnd > totalKnown) {
            windowEnd = totalKnown;
            windowStart = Math.max(0, windowEnd - windowSize);
        }

        if (windowStart > 0) {
            pages.push(0);
            if (windowStart > 1) {
                pages.push('ellipsis-start');
            }
        }

        for (let i = windowStart; i < windowEnd; i++) {
            if (!pages.includes(i)) {
                pages.push(i);
            }
        }

        if (windowEnd < totalKnown) {
            if (windowEnd < totalKnown - 1) {
                pages.push('ellipsis-end');
            }
            for (let i = Math.max(windowEnd, totalKnown - 2); i < totalKnown; i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }
        }

        return pages;
    };

    const handlePageSearch = async () => {
        const targetPage = parseInt(pageSearchValue, 10) - 1;
        const maxPage = estimatedTotalPages || totalPagesDiscovered;

        if (isNaN(targetPage) || targetPage < 0) {
            alert("Please enter a valid page number");
            return;
        }

        if (targetPage >= maxPage) {
            const shouldContinue = window.confirm(`Page ${pageSearchValue} might not exist. Current known range is 1-${maxPage}. Do you want to try anyway?`);
            if (!shouldContinue) return;
        }

        setSearchingPage(true);
        setPageSearchValue("");

        await goToPage(targetPage);
    };

    const handleImageError = (e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
    };

    // Get appropriate loading message
    const getLoadingMessage = () => {
        if (isRestoringStateRef.current) {
            return "✨ Restoring your view...";
        }
        if (searchingPage) {
            return "🔍 Searching for page...";
        }
        return "📊 Loading profiles...";
    };

    // Styles (keeping all your existing styles)
    const pageStyle = {
        padding: isMobile ? "20px" : isTablet ? "30px" : "40px",
        background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "'Outfit', 'Inter', sans-serif",
    };

    const headerStyle = {
        textAlign: "left",
        margin: 0,
        padding: isMobile ? "12px 0" : "16px 0",
    };

    const titleStyle = {
        fontSize: isMobile ? "1.5rem" : isTablet ? "1.8rem" : "2rem",
        fontWeight: "800",
        color: "#7c3aed",
        margin: 0,
        lineHeight: 1.2,
    };

    const sloganStyle = {
        fontSize: isMobile ? "0.9rem" : "1rem",
        color: "#475569",
        fontWeight: "400",
        margin: "4px 0 0 0",
    };

    const listStyle = {
        listStyleType: "none",
        padding: 0,
        display: "grid",
        gridTemplateColumns: isMobile
            ? "1fr"
            : isTablet
                ? "repeat(auto-fill, minmax(260px, 1fr))"
                : "repeat(auto-fill, minmax(300px, 1fr))",
        gap: isMobile ? "12px" : isTablet ? "16px" : "24px",
    };

    const userCardStyle = {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(10px)",
        position: "relative",
    };



    const userImageStyle = {
        width: "100%",
        height: isMobile ? "200px" : isTablet ? "260px" : "300px",
        objectFit: "cover",
        objectPosition: "top",
        borderTopLeftRadius: "16px",
        borderTopRightRadius: "16px",
    };

    const placeholderImageStyle = {
        ...userImageStyle,
        backgroundColor: "#e5e7eb",
        color: "#6b7280",
        display: "none",
        justifyContent: "center",
        alignItems: "center",
        fontSize: isMobile ? "0.9rem" : "1rem",
        fontWeight: "500",
    };

    const userDetailsStyle = {
        padding: isMobile ? "16px" : "24px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        flex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.4)",
    };

    const buttonStyle = {
        padding: isMobile ? "8px 14px" : "10px 18px",
        background: "linear-gradient(90deg, #7c3aed 0%, #db2777 100%)",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontWeight: "600",
        fontSize: isMobile ? "0.85rem" : "0.9rem",
        marginTop: "10px",
        alignSelf: "flex-start",
        transition: "all 0.3s ease",
        cursor: "pointer",
    };



    // NEW: Style for Update Photos button
    const updatePhotosButtonStyle = {
        ...buttonStyle,
        background: "linear-gradient(90deg, #059669 0%, #047857 100%)",
        fontSize: isMobile ? "0.8rem" : "0.85rem",
        padding: isMobile ? "6px 12px" : "8px 14px",
        marginTop: "6px",
    };



    // NEW: Button container style for multiple buttons
    const buttonContainerStyle = {
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        flexWrap: "wrap",
        gap: isMobile ? "6px" : "8px",
        marginTop: "10px",
    };

    const deleteButtonStyle = {
        ...buttonStyle,
        background: "linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)",
        fontSize: isMobile ? "0.8rem" : "0.85rem",
        padding: isMobile ? "6px 12px" : "8px 14px",
        marginTop: isMobile ? "4px" : "0",
    };



    const paginationContainerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: isMobile ? "4px" : "6px",
        margin: "24px 0",
        flexWrap: "wrap",
    };

    const pageButtonStyle = {
        padding: isMobile ? "8px 12px" : "10px 14px",
        border: "2px solid #e5e7eb",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        color: "#374151",
        fontWeight: "600",
        fontSize: isMobile ? "0.85rem" : "0.9rem",
        cursor: "pointer",
        transition: "all 0.2s ease",
        minWidth: isMobile ? "36px" : "40px",
        textAlign: "center",
    };

    const activePageButtonStyle = {
        ...pageButtonStyle,
        background: "linear-gradient(90deg, #7c3aed 0%, #db2777 100%)",
        color: "#ffffff",
        border: "2px solid #7c3aed",
        transform: "scale(1.1)",
        fontWeight: "700",
    };

    const disabledPageButtonStyle = {
        ...pageButtonStyle,
        opacity: 0.5,
        cursor: "not-allowed",
        backgroundColor: "#f3f4f6",
    };

    const loadingPageButtonStyle = {
        ...pageButtonStyle,
        background: "linear-gradient(90deg, #f59e0b 0%, #f97316 100%)",
        color: "#ffffff",
        border: "2px solid #f59e0b",
    };

    const ellipsisStyle = {
        padding: isMobile ? "8px 4px" : "10px 8px",
        color: "#6b7280",
        fontWeight: "600",
        fontSize: isMobile ? "0.85rem" : "0.9rem",
        cursor: "pointer",
        textAlign: "center",
    };

    const pageIndicatorStyle = {
        textAlign: "center",
        fontSize: isMobile ? "0.85rem" : "0.95rem",
        color: "#475569",
        margin: "16px 0",
        fontWeight: "500",
    };

    const searchContainerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
        margin: "16px 0",
        flexWrap: "wrap",
    };

    const searchInputStyle = {
        padding: "8px 12px",
        border: "2px solid #e5e7eb",
        borderRadius: "8px",
        fontSize: isMobile ? "0.9rem" : "1rem",
        width: "80px",
        textAlign: "center",
        outline: "none",
        transition: "border-color 0.2s ease",
    };

    const searchButtonStyle = {
        ...buttonStyle,
        padding: "8px 16px",
        marginTop: 0,
        alignSelf: "auto",
    };

    const progressDialogStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    };

    const progressContentStyle = {
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "12px",
        textAlign: "center",
        maxWidth: "300px",
        width: "90%",
    };

    const restoringIndicatorStyle = {
        textAlign: "center",
        fontSize: isMobile ? "0.85rem" : "0.9rem",
        color: "#7c3aed",
        fontWeight: "600",
        padding: "8px 16px",
        backgroundColor: "rgba(124, 58, 237, 0.1)",
        borderRadius: "8px",
        margin: "8px 0",
        border: "1px solid rgba(124, 58, 237, 0.2)",
    };




    return (
        <div style={pageStyle}>
            {/* Progress Dialog */}
            {(isDiscoveringPages || searchingPage || (loading && !isRestoringStateRef.current)) && (
                <div style={progressDialogStyle}>
                    <div style={progressContentStyle}>
                        <div style={{ fontSize: "1.2rem", marginBottom: "12px", color: "#1e293b", fontWeight: "700" }}>
                            {searchingPage ? "🔍 Searching Page..." :
                                isDiscoveringPages ? "📊 Discovering Pages..." :
                                    "⏳ Loading Profiles..."}
                        </div>
                        <div style={{ color: "#64748b", marginBottom: "20px" }}>
                            {searchingPage ? "Loading your requested page" :
                                isDiscoveringPages ? "Please wait while we find more pages" :
                                    `Fetching users for Page ${currentPage + 1}`}
                        </div>
                        <div className="spinner" />
                    </div>
                </div>
            )}
 
            {/* Header Section */}
            <div style={{ ...headerStyle, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "30px" }}>
                <div>
                    <h1 style={titleStyle}>Golden Match</h1>
                    <p style={sloganStyle}>Find your perfect companion with ease and elegance</p>
                </div>
                {totalUsers > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <div style={{
                            background: "rgba(255, 255, 255, 0.6)",
                            backdropFilter: "blur(10px)",
                            padding: "12px 24px",
                            borderRadius: "20px",
                            border: "1px solid rgba(255, 255, 255, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.03)"
                        }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(109, 40, 217, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>👥</div>
                            <div>
                                <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Members</div>
                                <div style={{ fontSize: "1.3rem", color: "#1e293b", fontWeight: "900" }}>{totalUsers.toLocaleString()}</div>
                            </div>
                        </div>
 
                    </div>
                )}
            </div>
 
            {/* Stats & Search Bar */}
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: "30px",
                flexWrap: "wrap",
                gap: "20px"
            }}>
                <div style={{ color: "#64748b", fontWeight: "600", fontSize: "0.95rem" }}>
                    Showing page <span style={{ color: "#7c3aed" }}>{currentPage + 1}</span> of <span style={{ color: "#7c3aed" }}>{estimatedTotalPages || totalPagesDiscovered}</span>
                </div>
 
                <div style={searchContainerStyle}>
                    <FiSearch style={{ color: "#94a3b8" }} />
                    <span style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "500" }}>Jump to:</span>
                    <input
                        type="number"
                        placeholder="Page"
                        value={pageSearchValue}
                        onChange={(e) => setPageSearchValue(e.target.value)}
                        style={searchInputStyle}
                        onKeyPress={(e) => e.key === 'Enter' && handlePageSearch()}
                    />
                    <button style={searchButtonStyle} onClick={handlePageSearch}>Go</button>
                </div>
            </div>
 
            {loading && !isRestoringStateRef.current ? (
                <div style={{ textAlign: "center", padding: "100px 0" }}>
                    <div className="spinner" style={{ margin: "0 auto 20px" }} />
                    <p style={{ color: "#64748b", fontSize: "1.1rem", fontWeight: "500" }}>{getLoadingMessage()}</p>
                </div>
            ) : users.length > 0 ? (
                <>
                    <ul style={listStyle}>
                        {users.map((user) => (
                            <li key={user.id} style={userCardStyle} className="user-card">
                                {user.photo ? (
                                    <div style={{ position: "relative" }}>
                                        <img src={user.photo} alt={user.name} style={userImageStyle} onError={handleImageError} />
                                        <div style={{ position: "absolute", top: "15px", right: "15px", background: "rgba(255,255,255,0.9)", padding: "5px 12px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "800", color: "#7c3aed", backdropFilter: "blur(4px)" }}>
                                            ID: {user.id.substring(0, 8)}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ ...userImageStyle, backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "10px" }}>
                                        <FiUser size={40} color="#cbd5e1" />
                                        <span style={{ color: "#94a3b8", fontSize: "0.9rem", fontWeight: "600" }}>No Image Available</span>
                                    </div>
                                )}
                                
                                <div style={userDetailsStyle}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <div>
                                            <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#1e293b", margin: 0, letterSpacing: "-0.01em" }}>
                                                {user.name}
                                            </h3>
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "0.85rem", marginTop: "4px", fontWeight: "600" }}>
                                                <FiMapPin size={14} style={{ color: "#059669" }} />
                                                {user.location}
                                            </div>
                                        </div>
                                        <div style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", padding: "4px 8px", borderRadius: "8px", fontSize: "0.7rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "4px" }}>
                                            <FiCheckCircle size={12} /> VERIFIED
                                        </div>
                                    </div>
 
                                    <div style={{ display: "flex", gap: "15px", margin: "10px 0" }}>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Age</span>
                                            <span style={{ fontSize: "1rem", color: "#1e293b", fontWeight: "700" }}>{user.age} Yrs</span>
                                        </div>
                                        <div style={{ width: "1px", height: "30px", background: "#e2e8f0" }}></div>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Gender</span>
                                            <span style={{ fontSize: "1rem", color: "#1e293b", fontWeight: "700" }}>{user.gender}</span>
                                        </div>
                                    </div>
 
                                    <div style={buttonContainerStyle}>
                                        <button
                                            style={buttonStyle}
                                            onClick={() => handleViewDetails(user.id)}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-2px)";
                                                e.currentTarget.style.boxShadow = "0 8px 20px rgba(109, 40, 217, 0.25)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(109, 40, 217, 0.2)";
                                            }}
                                        >
                                            View Profile <FiArrowRight />
                                        </button>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                            <button
                                                style={updatePhotosButtonStyle}
                                                onClick={(e) => { e.stopPropagation(); handleUpdatePhotos(user.id); }}
                                            >
                                                <FiCamera /> Photos
                                            </button>
                                            <button
                                                style={deleteButtonStyle}
                                                onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id, user.name); }}
                                            >
                                                <FiTrash2 /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
 
                    <div style={paginationContainerStyle}>
                        <button
                            style={currentPage === 0 ? disabledPageButtonStyle : pageButtonStyle}
                            onClick={handlePrevPage}
                            disabled={currentPage === 0}
                        >
                            ← Previous
                        </button>
 
                        {generatePageNumbers().map((page, index) => {
                            if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                                return (
                                    <span key={`ellipsis-${index}`} style={ellipsisStyle}>...</span>
                                );
                            }
 
                            const isCurrentPage = page === currentPage;
                            return (
                                <button
                                    key={page}
                                    style={isCurrentPage ? activePageButtonStyle : pageButtonStyle}
                                    onClick={() => goToPage(page)}
                                >
                                    {page + 1}
                                </button>
                            );
                        })}
 
                        <button
                            style={!hasNextPage ? disabledPageButtonStyle : pageButtonStyle}
                            onClick={handleNextPage}
                            disabled={!hasNextPage}
                        >
                            Next →
                        </button>
                    </div>
                </>
            ) : (
                <div style={{ textAlign: "center", padding: "100px 0" }}>
                    <FiSearch size={50} color="#cbd5e1" style={{ marginBottom: "20px" }} />
                    <p style={{ color: "#64748b", fontSize: "1.1rem", fontWeight: "500" }}>No profiles found in this section.</p>
                </div>
            )}
            {/* Admin Login Modal */}
            {showLoginModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0, 0, 0, 0.6)",
                        backdropFilter: "blur(8px)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowLoginModal(false);
                            setLoginError('');
                            setLoginData({ username: '', password: '' });
                        }
                    }}
                >
                    <div
                        style={{
                            background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                            borderRadius: "24px",
                            padding: "40px",
                            width: "100%",
                            maxWidth: "420px",
                            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
                            position: "relative",
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => {
                                setShowLoginModal(false);
                                setLoginError('');
                                setLoginData({ username: '', password: '' });
                            }}
                            style={{
                                position: "absolute",
                                top: "15px",
                                right: "15px",
                                background: "rgba(0, 0, 0, 0.1)",
                                border: "none",
                                borderRadius: "50%",
                                width: "36px",
                                height: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                color: "#666",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#dc3545";
                                e.currentTarget.style.color = "white";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
                                e.currentTarget.style.color = "#666";
                            }}
                        >
                            <FiX size={18} />
                        </button>

                        <div style={{ textAlign: "center", marginBottom: "30px" }}>
                            <div
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 20px",
                                    boxShadow: "0 10px 30px rgba(106, 17, 203, 0.3)",
                                }}
                            >
                                <FiHeart size={36} color="white" />
                            </div>
                            <h2 style={{ fontSize: "1.75rem", fontWeight: "700", color: "#1a1a2e", margin: "0 0 8px" }}>Admin Login</h2>
                            <p style={{ color: "#6c757d", fontSize: "0.95rem", margin: 0 }}>Access the matrimony admin panel</p>
                        </div>

                        <form onSubmit={handleAdminLogin}>
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", fontWeight: "600", color: "#495057" }}>Username</label>
                                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                    <FiUser style={{ position: "absolute", left: "16px", color: "#6c757d", fontSize: "1.1rem" }} />
                                    <input
                                        type="text"
                                        value={loginData.username}
                                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                        placeholder="Enter username"
                                        style={{ width: "100%", padding: "14px 14px 14px 48px", border: "2px solid #e9ecef", borderRadius: "12px", fontSize: "1rem", outline: "none", background: "#f8f9fa" }}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: "24px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", fontWeight: "600", color: "#495057" }}>Password</label>
                                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                    <FiLock style={{ position: "absolute", left: "16px", color: "#6c757d", fontSize: "1.1rem" }} />
                                    <input
                                        type={showAdminPassword ? "text" : "password"}
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        placeholder="Enter password"
                                        style={{ width: "100%", padding: "14px 48px 14px 48px", border: "2px solid #e9ecef", borderRadius: "12px", fontSize: "1rem", outline: "none", background: "#f8f9fa" }}
                                        required
                                    />
                                    <div 
                                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                                        style={{ position: "absolute", right: "16px", color: "#6c757d", cursor: "pointer", display: "flex", alignItems: "center" }}
                                    >
                                        {showAdminPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                    </div>
                                </div>
                            </div>

                            {loginError && (
                                <div style={{ background: "#fff5f5", border: "1px solid #fc8181", color: "#c53030", padding: "12px", borderRadius: "10px", marginBottom: "20px", fontSize: "0.9rem" }}>
                                    ⚠️ {loginError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isAdminLoading}
                                style={{
                                    width: "100%",
                                    padding: "16px",
                                    background: isAdminLoading ? "#9ca3af" : "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                                    border: "none",
                                    borderRadius: "12px",
                                    color: "white",
                                    fontSize: "1.1rem",
                                    fontWeight: "600",
                                    cursor: isAdminLoading ? "not-allowed" : "pointer",
                                    boxShadow: "0 8px 20px rgba(106, 17, 203, 0.35)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px",
                                }}
                            >
                                {isAdminLoading ? "Logging in..." : <><FiShield size={20} /> Login to Admin Panel</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;
