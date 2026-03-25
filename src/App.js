import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Outlet } from "react-router-dom";
import Sidebar, { menuItems } from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ProfileDetails from "./components/pages/ProfilePage";
import UserDetail from "./components/pages/UserDetail";
import UserLogin from "./components/pages/UserLogin";
import Edit from "./components/pages/Edit";
import "./App.css";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";

import LandingPage from "./components/pages/LandingPage";
import TermsAndConditions from "./components/pages/TermsAndConditions";
import ChildSafety from "./components/pages/ChildSafety";

function App() {
  const [activeMenu, setActiveMenu] = useState("Home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check localStorage for authentication on app load
  useEffect(() => {
    const storedPhone = localStorage.getItem("matrimonyUserPhone");
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (storedPhone || isAdmin) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Update document title based on active menu
  useEffect(() => {
    document.title = `Matrimony - ${activeMenu}`;
  }, [activeMenu]);

  // Update activeMenu based on current route
  useEffect(() => {
    const path = location.pathname;

    if (path === "/home") {
      setActiveMenu("Home");
    } else if (path === "/login") {
      setActiveMenu("Login");
    } else if (
      path.startsWith("/profile/") ||
      path.startsWith("/user/") ||
      path.startsWith("/edit/")
    ) {
      // Don't change the active menu on detail pages or edit pages
      return;
    } else {
      const menuName = path.substring(1);
      const menuItem = menuItems.find(
        (item) => item.label.toLowerCase() === menuName.toLowerCase()
      );

      if (menuItem) {
        setActiveMenu(menuItem.label);
      }
    }
  }, [location]);

  // Redirect based on authentication status
  useEffect(() => {
    // List of public routes that don't need authentication
    const publicRoutes = ["/", "/login", "/privacy-policy", "/terms", "/child-safety"];

    if (isAuthenticated && (location.pathname === "/login" || location.pathname === "/")) {
      navigate("/home");
    } else if (
      !isAuthenticated &&
      !publicRoutes.includes(location.pathname)
    ) {
      navigate("/"); // Redirect to landing page instead of login
    }
  }, [isAuthenticated, location, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = (label) => {
    if (label === "Logout") {
      alert("Logging out...");
      setIsAuthenticated(false);
      localStorage.removeItem("matrimonyUserPhone");
      localStorage.removeItem("isAdmin");
      setActiveMenu("Login");
      navigate("/");
    } else {
      setActiveMenu(label);
      navigate(label === "Home" ? "/home" : `/${label.toLowerCase()}`);
    }
  };

  // Handle successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setActiveMenu("Home");
    navigate("/home");
  };

  return (
    <div className="app-container" role="main" aria-label="Matrimony dashboard">
      {isAuthenticated && location.pathname !== "/" && (
        <Sidebar
          activeMenu={activeMenu}
          setActiveMenu={handleMenuClick}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/login" element={<UserLogin onLoginSuccess={handleLoginSuccess} />} />

        {/* Conditionally wrapped public pages to handle Sidebar offset when logged in */}
        <Route path="/privacy-policy" element={
          isAuthenticated ? (
            <div className={`dashboard ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
              <PrivacyPolicy />
            </div>
          ) : (
            <PrivacyPolicy />
          )
        } />
        <Route path="/terms" element={
          isAuthenticated ? (
            <div className={`dashboard ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
              <TermsAndConditions />
            </div>
          ) : (
            <TermsAndConditions />
          )
        } />
        <Route path="/child-safety" element={
          isAuthenticated ? (
            <div className={`dashboard ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
              <ChildSafety />
            </div>
          ) : (
            <ChildSafety />
          )
        } />

        {/* Private Routes Wrapper */}
        {isAuthenticated && (
          <Route element={
            <div className={`dashboard ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
              <Outlet />
            </div>
          }>
            <Route path="/home" element={<Dashboard activeMenu="Home" />} />
            <Route path="/profile" element={<Dashboard activeMenu="Profile" />} />
            <Route path="/matches" element={<Dashboard activeMenu="Matches" />} />
            <Route path="/messages" element={<Dashboard activeMenu="Messages" />} />
            <Route path="/settings" element={<Dashboard activeMenu="Settings" />} />
            <Route path="/registration" element={<Dashboard activeMenu="Registration" />} />
            <Route path="/user/:id" element={<UserDetail />} />
            <Route path="/profile/:id" element={<ProfileDetails />} />
            <Route path="/edit/:userId" element={<Edit />} />
          </Route>
        )}
      </Routes>
    </div>
  );
}

export default App;
