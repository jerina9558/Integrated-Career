import React, { useEffect, useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "student";
  const token = localStorage.getItem("token");
  const isViewMode = localStorage.getItem("viewMode") === "true";

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [fontStyle, setFontStyle] = useState(() => localStorage.getItem("fontStyle") || "Arial");
  const [fontSize, setFontSize] = useState(() => localStorage.getItem("fontSize") || "medium");

  const isDark = theme === "dark";

  const themeStyles = {
    light: {
      sidebarBg: "linear-gradient(180deg, #3f51b5 0%, #303f9f 100%)",
      sidebarColor: "#ffffff",
      mainBg: "#f8f9fa",
      mainColor: "#111827",
      bodyBg: "#f8f9fa",
      bodyColor: "#111827",
      borderColor: "#e5e7eb",
      hoverBg: "rgba(255, 255, 255, 0.15)",
      activeBg: "rgba(255, 255, 255, 0.25)",
    },
    dark: {
      sidebarBg: "linear-gradient(180deg, #1a202c 0%, #111827 100%)",
      sidebarColor: "#ffffff",
      mainBg: "#1a202c",
      mainColor: "#ffffff",
      bodyBg: "#1a202c",
      bodyColor: "#ffffff",
      borderColor: "#4a5568",
      hoverBg: "rgba(144, 205, 244, 0.15)",
      activeBg: "rgba(144, 205, 244, 0.25)",
    },
  };

  const fontSizeMap = { small: "14px", medium: "16px", large: "18px" };

  useEffect(() => {
    if (!token) navigate("/login");

    const updateThemeFromStorage = () => {
      const newTheme = localStorage.getItem("theme") || "light";
      setTheme(newTheme);
      const ts = themeStyles[newTheme];
      if (ts) {
        document.documentElement.style.backgroundColor = ts.bodyBg;
        document.documentElement.style.color = ts.bodyColor;
        document.body.style.backgroundColor = ts.bodyBg;
        document.body.style.color = ts.bodyColor;
      }
    };

    const updateFontStyleFromStorage = () => {
      const newFont = localStorage.getItem("fontStyle") || "Arial";
      setFontStyle(newFont);
      document.body.style.fontFamily = newFont;
    };

    const updateFontSizeFromStorage = () => {
      const newSize = localStorage.getItem("fontSize") || "medium";
      setFontSize(newSize);
      document.body.style.fontSize = fontSizeMap[newSize];
    };

    updateThemeFromStorage();
    updateFontStyleFromStorage();
    updateFontSizeFromStorage();

    window.addEventListener("themeChange", updateThemeFromStorage);
    window.addEventListener("fontStyleChange", updateFontStyleFromStorage);
    window.addEventListener("fontSizeChange", updateFontSizeFromStorage);

    return () => {
      window.removeEventListener("themeChange", updateThemeFromStorage);
      window.removeEventListener("fontStyleChange", updateFontStyleFromStorage);
      window.removeEventListener("fontSizeChange", updateFontSizeFromStorage);
    };
  }, [token, navigate]);

  const handleRoleSwitch = (newRole, path) => {
    localStorage.setItem("role", newRole);
    localStorage.setItem("viewMode", "true");
    navigate(path);
  };

  const backToAdmin = () => {
    localStorage.setItem("role", "admin");
    localStorage.removeItem("viewMode");
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("viewMode");
    navigate("/login");
  };

  const navItems =
    role === "student"
      ? [
          { name: "Dashboard", path: "/dashboard", icon: "📊" },
          { name: "Jobs & Internships", path: "/dashboard/StudentJobs", disabled: isViewMode, icon: "💼" },
          { name: "Resume Builder", path: "/dashboard/Resume", icon: "📄" },
          { name: "Career Path", path: "/dashboard/Career", icon: "🎯" },
          { name: "Application Tracker", path: "/dashboard/Tracking", disabled: isViewMode, icon: "📋" },
          { name: "Skill Assessment", path: "/dashboard/SkillAssessment", icon: "📈" },
          ...(isViewMode ? [] : [{ name: "Feedback", path: "/dashboard/Feedback", icon: "💬" }]),
          { name: "Settings", path: "/dashboard/Settings", icon: "⚙️" },
          ...(isViewMode ? [{ name: "Back to Admin", action: backToAdmin, icon: "🔙" }] : []),
          { name: "Logout", action: handleLogout, icon: "🚪" },
        ]
      : role === "employer"
      ? [
          { name: "Dashboard", path: "/dashboard", icon: "📊" },
          { name: "Post Jobs", path: "/dashboard/EmployerJobs", disabled: isViewMode, icon: "📝" },
          { name: "Application Tracker", path: "/dashboard/EmployerApplicationTracker", disabled: isViewMode, icon: "📋" },
          { name: "Skill Assessment", path: "/dashboard/SkillAssessment", icon: "📈" },
          ...(isViewMode ? [] : [{ name: "Feedback", path: "/dashboard/Feedback", icon: "💬" }]),
          { name: "Settings", path: "/dashboard/Settings", icon: "⚙️" },
          ...(isViewMode ? [{ name: "Back to Admin", action: backToAdmin, icon: "🔙" }] : []),
          { name: "Logout", action: handleLogout, icon: "🚪" },
        ]
      : [
          { name: "Dashboard", path: "/dashboard", icon: "📊" },
          { name: "View Student Dashboard", action: () => handleRoleSwitch("student", "/dashboard"), icon: "🎓" },
          { name: "View Employer Dashboard", action: () => handleRoleSwitch("employer", "/dashboard"), icon: "👔" },
          ...(isViewMode ? [] : [{ name: "Feedback", path: "/dashboard/Feedback", icon: "💬" }]),
          { name: "Settings", path: "/dashboard/Settings", icon: "⚙️" },
          { name: "Logout", action: handleLogout, icon: "🚪" },
        ];

  const portalTitle = 
    role === "student" ? "Student Portal" : 
    role === "employer" ? "Employer Portal" : 
    "Admin Portal";

  return (
    <div
      style={{
        display: "flex",
        fontFamily: `'Inter', '${fontStyle}', 'Segoe UI', Arial, sans-serif`,
        fontSize: fontSizeMap[fontSize],
        backgroundColor: themeStyles[theme].bodyBg,
        color: themeStyles[theme].bodyColor,
        minHeight: "100vh",
        transition: "all 0.3s ease",
      }}
    >
      {/* Sidebar */}
      <nav
        style={{
          width: "260px",
          background: themeStyles[theme].sidebarBg,
          color: themeStyles[theme].sidebarColor,
          height: "100vh",
          padding: "0",
          position: "fixed",
          top: 0,
          left: 0,
          transition: "all 0.3s ease",
          boxShadow: isDark 
            ? "4px 0 20px rgba(0, 0, 0, 0.5)"
            : "4px 0 20px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "32px 24px",
          borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.2)"}`,
        }}>
          <h3 style={{ 
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: "700",
            letterSpacing: "-0.5px",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}>
            {portalTitle}
          </h3>
          {isViewMode && (
            <span style={{
              display: "inline-block",
              marginTop: "8px",
              padding: "4px 12px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "12px",
              fontSize: "0.75rem",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}>
              View Mode
            </span>
          )}
        </div>

        {/* Navigation Items */}
        <ul style={{ 
          listStyle: "none", 
          padding: "16px 12px",
          margin: 0,
          flexGrow: 1,
          overflowY: "auto",
        }}>
          {navItems.map((item) => {
            const isDisabled = item.disabled;
            const ItemComponent = item.action ? "span" : Link;
            const itemProps = item.action 
              ? { onClick: isDisabled ? null : item.action }
              : { to: item.path, onClick: (e) => { if (isDisabled) e.preventDefault(); } };

            return (
              <li key={item.name} style={{ marginBottom: "6px" }}>
                <ItemComponent
                  {...itemProps}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    color: isDisabled ? "rgba(255, 255, 255, 0.4)" : themeStyles[theme].sidebarColor,
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    fontWeight: "500",
                    fontSize: "0.95rem",
                    backgroundColor: "transparent",
                    pointerEvents: isDisabled ? "none" : "auto",
                  }}
                  onMouseEnter={(e) => {
                    if (!isDisabled) {
                      e.currentTarget.style.backgroundColor = themeStyles[theme].hoverBg;
                      e.currentTarget.style.transform = "translateX(4px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDisabled) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.transform = "translateX(0)";
                    }
                  }}
                >
                  <span style={{ fontSize: "1.25rem", opacity: isDisabled ? 0.4 : 1 }}>
                    {item.icon}
                  </span>
                  <span style={{ opacity: isDisabled ? 0.4 : 1 }}>
                    {item.name}
                  </span>
                </ItemComponent>
              </li>
            );
          })}
        </ul>

        
      </nav>

      {/* Main Content */}
      <main
        style={{
          marginLeft: "260px",
          padding: "0",
          flexGrow: 1,
          backgroundColor: themeStyles[theme].mainBg,
          color: themeStyles[theme].mainColor,
          minHeight: "100vh",
          transition: "all 0.3s ease",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}