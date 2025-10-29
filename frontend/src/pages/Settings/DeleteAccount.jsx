import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000"; // Backend URL

const DeleteAccount = ({ goBack }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const navigate = useNavigate();

  useEffect(() => {
    const handleThemeChange = () => setTheme(localStorage.getItem("theme") || "light");
    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  const isDark = theme === "dark";

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      alert("❌ You must be logged in to delete your account.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      return;
    }

    try {
      if (role === "student") {
        await axios.delete(`${API}/delete/student`, { headers: { Authorization: `Bearer ${token}` } });
      } else if (role === "employer") {
        await axios.delete(`${API}/delete/employer`, { headers: { Authorization: `Bearer ${token}` } });
      } else if (role === "admin") {
        alert("Admin account cannot be deleted.");
        return;
      }

      // Clear all localStorage related to user
      ["token", "email", "username", "role", "user_id"].forEach(item => localStorage.removeItem(item));

      alert("✅ Your account has been deleted.");
      navigate("/signup"); // Redirect to signup page
    } catch (err) {
      console.error("❌ Delete account error:", err.response?.data || err);
      alert("Failed to delete account. Try again later.");
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        color: isDark ? "#ffffff" : "#111827",
        transition: "all 0.3s ease",
      }}
    >
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
          ? "linear-gradient(135deg, #4a1a1a 0%, #2d0a0a 100%)"
          : "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
        padding: "48px 140px",
        borderRadius: "16px",
        marginBottom: "48px",
        border: `1px solid ${isDark ? "#742a2a" : "#fca5a5"}`,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
        }}></div>
        
        <h2 style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          marginBottom: "12px",
          color: isDark ? "#fca5a5" : "#dc2626",
        }}>
          ⚠️ Delete Account
        </h2>
        <p style={{
          fontSize: "1.1rem",
          color: isDark ? "#fca5a5" : "#991b1b",
          maxWidth: "600px",
          fontWeight: "500",
        }}>
          Once you delete your account, there is no going back. Please be certain.
        </p>
      </div>

      {/* Warning Card */}
      <div style={{
        backgroundColor: isDark ? "#2d3748" : "#ffffff",
        padding: "140px",
        borderRadius: "16px",
        boxShadow: isDark 
          ? "0 10px 30px rgba(0, 0, 0, 0.4)"
          : "0 6px 20px rgba(0, 0, 0, 0.08)",
        border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
        maxWidth: "600px",
      }}>
        {/* Warning Message */}
        <div style={{
          backgroundColor: isDark ? "#742a2a" : "#fef2f2",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "32px",
          border: `2px solid ${isDark ? "#991b1b" : "#fecaca"}`,
        }}>
          <h3 style={{
            fontSize: "1.2rem",
            fontWeight: "600",
            marginBottom: "12px",
            color: isDark ? "#fca5a5" : "#dc2626",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            🚨 Warning
          </h3>
          <ul style={{
            margin: 0,
            paddingLeft: "20px",
            color: isDark ? "#fecaca" : "#991b1b",
            lineHeight: "1.8",
          }}>
            <li>This action cannot be undone</li>
            <li>All your data will be permanently deleted</li>
            <li>You will lose access to all services immediately</li>
            <li>You will need to create a new account to use our services again</li>
          </ul>
        </div>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          style={{
            padding: "14px 24px",
            width: "100%",
            backgroundColor: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "1.05rem",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#b91c1c";
            e.target.style.transform = "scale(1.02)";
            e.target.style.boxShadow = "0 6px 16px rgba(220, 38, 38, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#dc2626";
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 12px rgba(220, 38, 38, 0.3)";
          }}
        >
          🗑️ Delete My Account Permanently
        </button>
      </div>
    </div>
  );
};

export default DeleteAccount;