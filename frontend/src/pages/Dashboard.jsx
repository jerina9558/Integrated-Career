import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role") || "student";
  const isViewMode = localStorage.getItem("viewMode") === "true";
  const theme = localStorage.getItem("theme") || "light"; // "light" or "dark"

  const isDarkMode = theme === "dark";

  const cardStyle = {
    backgroundColor: isDarkMode ? "#1e1e1e" : "#fffff",
    color: isDarkMode ? "#fffff" : "#000",
    padding: "1rem",
    marginBottom: "1rem",
    borderRadius: "8px",
    boxShadow: isDarkMode
      ? "0 2px 5px rgba(255,255,255,0.1)"
      : "0 2px 5px rgba(0,0,0,0.1)",
    borderLeft: isDarkMode ? "5px solid #90caf9" : "5px solid #3f51b5",
    transition: "background-color 0.3s, color 0.3s",
  };

  const dashboardStyle = {
    fontFamily: "Arial, sans-serif",
    padding: "2rem",
    backgroundColor: isDarkMode ? "#121212" : "#fffff",
    color: isDarkMode ? "#fffff" : "#000",
    minHeight: "100vh",
    cursor: isViewMode
      ? "url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 height=%2224%22 width=%2224%22><text y=%2220%22 font-size=%2220%22>🚫</text></svg>') 12 12, auto"
      : "auto",
    transition: "background-color 0.3s, color 0.3s",
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("viewMode");
    navigate("/login");
  };

  const isDashboardHome =
    location.pathname === "/dashboard" || location.pathname === "/admin-dashboard";

  const viewOnlyBadge = isViewMode ? " (View Only)" : "";

  return (
    <div style={dashboardStyle}>
      {isDashboardHome ? (
        <>
          {/* Header */}
          <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
            {role === "admin" && !isViewMode
              ? "👩‍💼 Admin Dashboard"
              : isViewMode
              ? `👀 Viewing ${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`
              : "Welcome to Your Dashboard"}
          </h1>

          <p style={{ marginBottom: "2rem", color: isDarkMode ? "#ccc" : "#333" }}>
            {role === "employer"
              ? "This portal helps employers post jobs, review applicants, and assess skills."
              : role === "student"
              ? "This portal helps students find internships, build resumes, track applications, assess skills, and explore careers."
              : "Manage users, analytics, and system settings for the platform."}
          </p>

          {/* Cards */}
          {role === "employer" ? (
            <>
              <div style={cardStyle}>
                <h3 style={{ margin: 0 }}>
                  🔍 <strong>Post Jobs & View Applicants</strong>{viewOnlyBadge}
                </h3>
                <p style={{ marginTop: "0.5rem" }}>
                  Publish new job postings and manage applications.
                </p>
              </div>
              <div style={cardStyle}>
                <h3 style={{ margin: 0 }}>
                  🧠 <strong>Skill Assessment</strong>{viewOnlyBadge}
                </h3>
                <p style={{ marginTop: "0.5rem" }}>
                  Review candidate skills and assessments.
                </p>
              </div>
            </>
          ) : role === "student" ? (
            <>
              <div style={cardStyle}>
                <h3 style={{ margin: 0 }}>
                  🔍 <strong>Find Jobs & Internships</strong>{viewOnlyBadge}
                </h3>
                <p style={{ marginTop: "0.5rem" }}>
                  Explore openings in your domain and apply directly.
                </p>
              </div>
              <div style={cardStyle}>
                <h3 style={{ margin: 0 }}>
                  📄 <strong>Build Your Resume</strong>{viewOnlyBadge}
                </h3>
                <p style={{ marginTop: "0.5rem" }}>
                  Use our AI-powered resume builder to create a professional resume.
                </p>
              </div>
              <div style={cardStyle}>
                <h3 style={{ margin: 0 }}>
                  🎯 <strong>Career Path</strong>{viewOnlyBadge}
                </h3>
                <p style={{ marginTop: "0.5rem" }}>
                  Explore career paths based on your skills and assessments.
                </p>
              </div>
              <div style={cardStyle}>
                <h3 style={{ margin: 0 }}>
                  📌 <strong>Track Applications</strong>{viewOnlyBadge}
                </h3>
                <p style={{ marginTop: "0.5rem" }}>
                  Monitor applications, interview statuses, and more.
                </p>
              </div>
              <div style={cardStyle}>
                <h3 style={{ margin: 0 }}>
                  🧠 <strong>Skill Assessment</strong>{viewOnlyBadge}
                </h3>
                <p style={{ marginTop: "0.5rem" }}>
                  Take quizzes in your domain and get instant results.
                </p>
              </div>
            </>
          ) : (
            <>
              <div style={cardStyle}>
                <h3 style={{ margin: 0 }}>
                  🛠 <strong>Manage Users</strong>{viewOnlyBadge}
                </h3>
                <p style={{ marginTop: "0.5rem" }}>
                  View and manage all student and employer accounts.
                </p>
              </div>
              <div style={cardStyle}>
                <h3 style={{ margin: 0 }}>
                  📊 <strong>Analytics</strong>{viewOnlyBadge}
                </h3>
                <p style={{ marginTop: "0.5rem" }}>
                  See platform statistics and user activity reports.
                </p>
              </div>
              <div style={cardStyle}>
                <h3 style={{ margin: 0 }}>
                  ⚙ <strong>System Settings</strong>{viewOnlyBadge}
                </h3>
                <p style={{ marginTop: "0.5rem" }}>
                  Manage site settings, roles, and permissions.
                </p>
              </div>
            </>
          )}
        </>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
