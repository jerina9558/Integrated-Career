import React, { useState, useEffect } from "react";
import { FaUser, FaBell, FaPalette, FaInfoCircle, FaTrash } from "react-icons/fa";
import AccountSettings from "./AccountSettings";
import AppearanceSettings from "./AppearanceSettings";
import AboutSettings from "./AboutSettings";
import DeleteAccount from "./DeleteAccount";
import styles from "./settingsStyles";

const Settings = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const isDark = theme === "dark"; // <-- Fix added here

  const goBack = () => setActiveSection(null);

  // Listen for theme changes from AppearanceSettings
  useEffect(() => {
    const handleThemeChange = () => {
      const savedTheme = localStorage.getItem("theme") || "light";
      setTheme(savedTheme);
    };

    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  const themeStyles = {
    light: { backgroundColor: "#ffffff", color: "#111827" },
    dark: { backgroundColor: "#1f2937", color: "#ffffff" },
  };

  const sections = [
    { key: "account", icon: <FaUser size={20} />, title: "Account", description: "Manage personal info" },
    { key: "appearance", icon: <FaPalette size={20} />, title: "Appearance", description: "Customize look" },
    { key: "about", icon: <FaInfoCircle size={20} />, title: "About", description: "App info and support" },
    { key: "delete", icon: <FaTrash size={20} />, title: "Delete Account", description: "Permanently delete" },
  ];

  const renderMainMenu = () => (
    <>
      {/* Hero Section */}
      <div style={{
        background: isDark
          ? "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)"
          : "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
        padding: "48px 340px",
        borderRadius: "16px",
        marginBottom: "48px",
        border: `1px solid ${isDark ? "#4a5568" : "#c7d2fe"}`,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(63, 81, 181, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
        }}></div>

        <h2 style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          marginBottom: "12px",
          background: isDark
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "linear-gradient(135deg, #3f51b5 0%, #5a67d8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          ⚙️ Settings
        </h2>
        <p style={{
          fontSize: "1.1rem",
          color: isDark ? "#a0aec0" : "#6b7280",
          maxWidth: "600px",
        }}>
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        gap: "28px",
      }}>
        {sections.map(({ key, icon, title, description }) => (
          <div
            key={key}
            style={{
              backgroundColor: isDark ? "#2d3748" : "white",
              color: isDark ? "#ffffff" : "#111827",
              padding: "32px",
              borderRadius: "16px",
              boxShadow: isDark
                ? "0 10px 30px rgba(0, 0, 0, 0.4)"
                : "0 6px 20px rgba(0, 0, 0, 0.08)",
              border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
            }}
            onClick={() => setActiveSection(key)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = isDark
                ? "0 16px 40px rgba(0, 0, 0, 0.5)"
                : "0 12px 30px rgba(0, 0, 0, 0.12)";
              e.currentTarget.style.borderColor = "#3f51b5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = isDark
                ? "0 10px 30px rgba(0, 0, 0, 0.4)"
                : "0 6px 20px rgba(0, 0, 0, 0.08)";
              e.currentTarget.style.borderColor = isDark ? "#4a5568" : "#e5e7eb";
            }}
          >
            <div style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "120px",
              height: "120px",
              background: "linear-gradient(135deg, #3f51b5 0%, #5a67d8 100%)",
              opacity: 0.08,
              borderRadius: "0 0 0 100%",
            }}></div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "16px",
            }}>
              <div style={{
                backgroundColor: isDark ? "#4a5568" : "#ede9fe",
                color: isDark ? "#c3dafe" : "#5b21b6",
                padding: "14px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
              }}>
                {icon}
              </div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: isDark ? "#90cdf4" : "#3f51b5",
                lineHeight: "1.3",
                margin: 0,
              }}>
                {title}
              </h3>
            </div>

            <p style={{
              fontSize: "1rem",
              lineHeight: "1.7",
              color: isDark ? "#cbd5e0" : "#4b5563",
              marginBottom: "16px",
            }}>
              {description}
            </p>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: isDark ? "#90cdf4" : "#3f51b5",
              fontWeight: "600",
              fontSize: "0.95rem",
            }}>
              <span>Open</span>
              <span style={{ fontSize: "1.2rem" }}>&#8250;</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        marginLeft: "50px",
        padding: "40px 60px",
        backgroundColor: themeStyles[theme].backgroundColor,
        color: themeStyles[theme].color,
        minHeight: "100vh",
        transition: "all 0.3s ease",
      }}
    >
      {activeSection === null && renderMainMenu()}
      {activeSection === "account" && <AccountSettings goBack={goBack} />}
      {activeSection === "appearance" && <AppearanceSettings goBack={goBack} />}
      {activeSection === "about" && <AboutSettings goBack={goBack} />}
      {activeSection === "delete" && <DeleteAccount goBack={goBack} />}
    </div>
  );
};

export default Settings;
