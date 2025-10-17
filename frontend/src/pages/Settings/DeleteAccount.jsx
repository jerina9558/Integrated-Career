import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./settingsStyles";

const API = "http://localhost:5000"; // Backend URL

const DeleteAccount = ({ goBack }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();

  useEffect(() => {
    const handleThemeChange = () => setTheme(localStorage.getItem("theme") || "light");
    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  const isDark = theme === "dark";
  const textColor = isDark ? "#ffffff" : "#111827";

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
    <div style={{ padding: "20px", color: textColor }}>
      <button onClick={goBack} style={{ ...styles.backBtn, color: textColor }}>← Back</button>

      <h2 style={{ color: isDark ? "#ffffff" : "#c0392b" }}>Delete Account</h2>
      <p style={{ color: isDark ? "#ffffff" : "#a94442", marginBottom: "20px" }}>
        Once you delete your account, there is no going back. Please be certain.
      </p>

      <button style={styles.deleteButton} onClick={handleDelete}>Delete Account</button>
    </div>
  );
};

export default DeleteAccount;
