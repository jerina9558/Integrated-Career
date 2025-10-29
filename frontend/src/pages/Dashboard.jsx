import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role") || "student";
  const isViewMode = localStorage.getItem("viewMode") === "true";
  
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const isDark = theme === "dark";

  // Listen for theme changes
  useEffect(() => {
    const updateTheme = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };
    window.addEventListener("themeChange", updateTheme);
    return () => window.removeEventListener("themeChange", updateTheme);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("viewMode");
    navigate("/login");
  };

  const isDashboardHome =
    location.pathname === "/dashboard" || location.pathname === "/admin-dashboard";

  const getRoleContent = () => {
    if (role === "employer") {
      return {
        title: "👩‍💼 Employer Dashboard",
        description: "This portal helps employers post jobs, review applicants, and assess skills.",
        cards: [
          {
            icon: "🔍",
            title: "Post Jobs & View Applicants",
            description: "Publish new job postings and manage applications.",
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          },
          {
            icon: "🧠",
            title: "Skill Assessment",
            description: "Review candidate skills and assessments.",
            gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          },
        ],
      };
    } else if (role === "student") {
      return {
        title: "👨‍🎓 Student Dashboard",
        description:
          "This portal helps students find internships, build resumes, track applications, assess skills, and explore careers.",
        cards: [
          {
            icon: "🔍",
            title: "Find Jobs & Internships",
            description: "Explore openings in your domain and apply directly.",
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          },
          {
            icon: "📄",
            title: "Build Your Resume",
            description: "Use our AI-powered resume builder to create a professional resume.",
            gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
          },
          {
            icon: "🎯",
            title: "Career Path",
            description: "Explore career paths based on your skills and assessments.",
            gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
          },
          {
            icon: "📌",
            title: "Track Applications",
            description: "Monitor applications, interview statuses, and more.",
            gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
          },
          {
            icon: "🧠",
            title: "Skill Assessment",
            description: "Take quizzes in your domain and get instant results.",
            gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          },
        ],
      };
    } else {
      return {
        title: "👩‍💼 Admin Dashboard",
        description: "Manage users, analytics, and system settings for the platform.",
        cards: [
          {
            icon: "🛠",
            title: "Manage Users",
            description: "View and manage all student and employer accounts.",
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          },
          {
            icon: "📊",
            title: "Analytics",
            description: "See platform statistics and user activity reports.",
            gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
          },
          {
            icon: "⚙",
            title: "System Settings",
            description: "Manage site settings, roles, and permissions.",
            gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
          },
        ],
      };
    }
  };

  const content = getRoleContent();

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        marginLeft: "50px",
        padding: "40px 60px",
        backgroundColor: isDark ? "#1a202c" : "#ffffff",
        color: isDark ? "#ffffff" : "#111827",
        minHeight: "100vh",
        cursor: isViewMode
          ? "url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 height=%2224%22 width=%2224%22><text y=%2220%22 font-size=%2220%22>🚫</text></svg>') 12 12, auto"
          : "auto",
      }}
    >
      {isDashboardHome ? (
        <>
          {/* Hero Section */}
          <div
            style={{
              background: isDark
                ? "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)"
                : "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
              padding: "48px 160px",
              borderRadius: "16px",
              marginBottom: "48px",
              border: `1px solid ${isDark ? "#4a5568" : "#c7d2fe"}`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "200px",
                height: "200px",
                background:
                  "radial-gradient(circle, rgba(63, 81, 181, 0.15) 0%, transparent 70%)",
                borderRadius: "50%",
              }}
            ></div>

            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                marginBottom: "12px",
                background: isDark
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "linear-gradient(135deg, #3f51b5 0%, #5a67d8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {isViewMode
                ? `👀 Viewing ${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`
                : content.title}
            </h1>
            <p
              style={{
                fontSize: "1.1rem",
                color: isDark ? "#a0aec0" : "#6b7280",
                maxWidth: "700px",
                lineHeight: "1.6",
              }}
            >
              {content.description}
            </p>

            {isViewMode && (
              <div
                style={{
                  marginTop: "20px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: isDark ? "#742a2a" : "#fef2f2",
                  color: isDark ? "#fc8181" : "#dc2626",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  border: `1px solid ${isDark ? "#9b2c2c" : "#fecaca"}`,
                }}
              >
                <span>🚫</span>
                <span>View Only Mode - Editing Disabled</span>
              </div>
            )}
          </div>

          {/* Feature Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "28px",
            }}
          >
            {content.cards.map((card, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: isDark ? "#2d3748" : "#ffffff",
                  padding: "32px",
                  borderRadius: "16px",
                  boxShadow: isDark
                    ? "0 10px 30px rgba(0, 0, 0, 0.4)"
                    : "0 6px 20px rgba(0, 0, 0, 0.08)",
                  border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
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
                  e.currentTarget.style.borderColor = isDark
                    ? "#4a5568"
                    : "#e5e7eb";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "120px",
                    height: "120px",
                    background: card.gradient,
                    opacity: 0.1,
                    borderRadius: "0 0 0 100%",
                  }}
                ></div>

                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "16px",
                    background: card.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    marginBottom: "20px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  {card.icon}
                </div>

                <h3
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "700",
                    marginBottom: "12px",
                    color: isDark ? "#e2e8f0" : "#1f2937",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {card.title}
                  {isViewMode && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: isDark ? "#fc8181" : "#dc2626",
                        backgroundColor: isDark ? "#742a2a" : "#fef2f2",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        border: `1px solid ${isDark ? "#9b2c2c" : "#fecaca"}`,
                      }}
                    >
                      View Only
                    </span>
                  )}
                </h3>

                <p
                  style={{
                    fontSize: "1rem",
                    lineHeight: "1.7",
                    color: isDark ? "#cbd5e0" : "#4b5563",
                    margin: 0,
                  }}
                >
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
