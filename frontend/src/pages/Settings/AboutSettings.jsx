// src/pages/Settings/AboutSettings.jsx
import React, { useEffect, useState } from "react";
import {
  MdWork,
  MdAssessment,
  MdArticle,
  MdExplore,
  MdTrackChanges,
  MdDashboard,
} from "react-icons/md";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import styles from "./settingsStyles";

const AboutSettings = ({ goBack }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Watch for theme change
  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };
    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  // Define theme colors
  const isDark = theme === "dark";

  return (
    <div style={{ 
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif", 
      color: isDark ? "#ffffff" : "#111827" 
    }}>
      <button 
        onClick={goBack} 
        style={{
          marginBottom: "32px",
          background: "none",
          border: "none",
          color: "#3f51b5",
          fontSize: "1.1rem",
          cursor: "pointer",
          fontWeight: "600",
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
        onMouseLeave={(e) => e.target.style.textDecoration = "none"}
      >
        ← Back
      </button>

      {/* Hero Section */}
      <div style={{
        background: isDark 
          ? "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)"
          : "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
        padding: "48px 210px",
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
          fontSize: "1.5rem",
          fontWeight: "700",
          marginBottom: "12px",
          background: isDark 
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "linear-gradient(135deg, #3f51b5 0%, #5a67d8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          About Student Job Board
        </h2>
        <p style={{
          fontSize: "1.1rem",
          color: isDark ? "#a0aec0" : "#6b7280",
          maxWidth: "600px",
        }}>
          Connecting students with career opportunities through a seamless, modern platform
        </p>
      </div>

      {/* Our Mission Section */}
      <div style={{
        backgroundColor: isDark ? "#2d3748" : "#ffffff",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: isDark 
          ? "0 10px 30px rgba(0, 0, 0, 0.4)"
          : "0 6px 20px rgba(0, 0, 0, 0.08)",
        border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
        marginBottom: "32px",
      }}>
        <h3 style={{
          fontSize: "1.75rem",
          fontWeight: "600",
          marginBottom: "24px",
          color: isDark ? "#e2e8f0" : "#1f2937",
        }}>
          🎯 Our Mission
        </h3>
        <p style={{
          fontSize: "1rem",
          lineHeight: "1.7",
          color: isDark ? "#cbd5e0" : "#4b5563",
          maxWidth: "720px",
        }}>
          The <strong>Student Job Board and Internship Portal</strong> bridges the gap between
          students and employers.
        </p>
      </div>

      {/* Platform Features Section */}
      <div style={{
        backgroundColor: isDark ? "#2d3748" : "#ffffff",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: isDark 
          ? "0 10px 30px rgba(0, 0, 0, 0.4)"
          : "0 6px 20px rgba(0, 0, 0, 0.08)",
        border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
        marginBottom: "32px",
      }}>
        <h3 style={{
          fontSize: "1.75rem",
          fontWeight: "600",
          marginBottom: "24px",
          color: isDark ? "#e2e8f0" : "#1f2937",
        }}>
          🚀 Platform Features
        </h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}>
          {[
            { icon: <MdWork />, title: "Seamless Applications", desc: "Apply for internships easily." },
            { icon: <MdAssessment />, title: "Skill Assessments", desc: "Custom tests for candidate evaluation." },
            { icon: <MdArticle />, title: "Resume Builder", desc: "Build and manage professional resumes." },
            { icon: <MdExplore />, title: "Career Exploration", desc: "Discover opportunities aligned with interests." },
            { icon: <MdTrackChanges />, title: "Application Tracking", desc: "Track application status in real-time." },
            { icon: <MdDashboard />, title: "Employer Dashboard", desc: "Manage postings and review applications." },
          ].map((feature, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                backgroundColor: isDark ? "#1a202c" : "#f9fafb",
                borderRadius: "12px",
                padding: "24px",
                border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = isDark
                  ? "0 8px 20px rgba(0, 0, 0, 0.5)"
                  : "0 8px 16px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ 
                fontSize: "1.75rem", 
                color: "#3f51b5",
                marginTop: 4,
                flexShrink: 0,
              }}>
                {feature.icon}
              </div>
              <div>
                <div style={{ 
                  fontWeight: "700", 
                  fontSize: "1.1rem", 
                  marginBottom: "8px", 
                  color: isDark ? "#e2e8f0" : "#111827" 
                }}>
                  {feature.title}
                </div>
                <div style={{ 
                  fontSize: "1rem", 
                  lineHeight: "1.6",
                  color: isDark ? "#cbd5e0" : "#4b5563" 
                }}>
                  {feature.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Development Team Section */}
      <div style={{
        backgroundColor: isDark ? "#2d3748" : "#ffffff",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: isDark 
          ? "0 10px 30px rgba(0, 0, 0, 0.4)"
          : "0 6px 20px rgba(0, 0, 0, 0.08)",
        border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
        marginBottom: "32px",
      }}>
        <h3 style={{
          fontSize: "1.75rem",
          fontWeight: "600",
          marginBottom: "24px",
          color: isDark ? "#e2e8f0" : "#1f2937",
        }}>
          👨‍💻 Development Team
        </h3>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          {[
            { initials: "RJ", name: "R. Jerina Gnana Pushpa" }, 
            { initials: "PM", name: "P.M. Mathujaa" }
          ].map((dev, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                backgroundColor: isDark ? "#1a202c" : "#f9fafb",
                padding: "20px 24px",
                borderRadius: "12px",
                border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
                transition: "all 0.3s ease",
                minWidth: "250px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = isDark
                  ? "0 8px 20px rgba(0, 0, 0, 0.5)"
                  : "0 8px 16px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: "#3f51b5",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "1.1rem",
                flexShrink: 0,
              }}>
                {dev.initials}
              </div>
              <div>
                <div style={{ 
                  fontSize: "1.1rem", 
                  fontWeight: "600",
                  color: isDark ? "#e2e8f0" : "#1f2937" 
                }}>
                  {dev.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div style={{
        backgroundColor: isDark ? "#2d3748" : "#ffffff",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: isDark 
          ? "0 10px 30px rgba(0, 0, 0, 0.4)"
          : "0 6px 20px rgba(0, 0, 0, 0.08)",
        border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
      }}>
        <h3 style={{
          fontSize: "1.75rem",
          fontWeight: "600",
          marginBottom: "24px",
          color: isDark ? "#e2e8f0" : "#1f2937",
        }}>
          📞 Get in Touch
        </h3>
        <div style={{
          backgroundColor: isDark ? "#1a202c" : "#f9fafb",
          padding: "24px",
          borderRadius: "12px",
          border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
          maxWidth: "500px",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "1rem",
            color: isDark ? "#cbd5e0" : "#374151",
            marginBottom: "16px",
          }}>
            <FaPhoneAlt style={{ color: "#3f51b5", fontSize: "1.1rem" }} /> 9677683342
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "1rem",
            color: isDark ? "#cbd5e0" : "#374151",
          }}>
            <FaEnvelope style={{ color: "#3f51b5", fontSize: "1.1rem" }} />
            <a 
              href="mailto:jerinaraja69@gmail.com" 
              style={{ 
                color: "#3f51b5", 
                textDecoration: "underline",
                fontWeight: "500",
              }}
            >
              jerinaraja69@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSettings;