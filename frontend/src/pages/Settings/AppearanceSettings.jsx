import React, { useState, useEffect } from "react";

const AppearanceSettings = ({ goBack }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [fontSize, setFontSize] = useState(() => localStorage.getItem("fontSize") || "medium");
  const [fontStyle, setFontStyle] = useState(() => localStorage.getItem("fontStyle") || "Arial");

  const fontSizes = ["small", "medium", "large"];
  const fontStyles = ["Arial", "Verdana", "Georgia", "Tahoma", "Times New Roman"];

  const fontSizeMap = { small: "14px", medium: "16px", large: "18px" };

  const themeStyles = {
    light: { backgroundColor: "#ffffff", color: "#111827" },
    dark: { backgroundColor: "#1f2937", color: "#ffffff" },
  };

  const isDark = theme === "dark";

  const inputStyle = {
    width: "100%",
    padding: "12px 20px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: `2px solid ${isDark ? "#4a5568" : "#d1d5db"}`,
    backgroundColor: isDark ? "#1a202c" : "#ffffff",
    color: isDark ? "#ffffff" : "#111827",
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
    cursor: "pointer",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    fontSize: "0.95rem",
    color: isDark ? "#e2e8f0" : "#374151",
  };

  useEffect(() => {
    const ts = themeStyles[theme] || themeStyles.light;

    document.documentElement.style.backgroundColor = ts.backgroundColor;
    document.documentElement.style.color = ts.color;

    document.body.style.backgroundColor = ts.backgroundColor;
    document.body.style.color = ts.color;
    document.body.style.fontFamily = fontStyle;
    document.body.style.fontSize = fontSizeMap[fontSize];
    document.body.style.transition = "all 0.3s ease";

    localStorage.setItem("theme", theme);
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("fontStyle", fontStyle);

    // 🔥 Dispatch events so Layout can listen
    window.dispatchEvent(new Event("themeChange"));
    window.dispatchEvent(new Event("fontStyleChange"));
    window.dispatchEvent(new Event("fontSizeChange"));
  }, [theme, fontSize, fontStyle]);

  const savePreferences = () => {
    alert("Appearance preferences saved!");
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
          ? "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)"
          : "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
        padding: "48px 140px",
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
          color: isDark ? "#90cdf4" : "#3f51b5",
        }}>
          🎨 Appearance Settings
        </h2>
        <p style={{
          fontSize: "1.1rem",
          color: isDark ? "#a0aec0" : "#6b7280",
          maxWidth: "600px",
        }}>
          Customize the look and feel of your application
        </p>
      </div>

      {/* Settings Card */}
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
        {/* Theme */}
        <div style={{ marginBottom: "28px" }}>
          <label style={labelStyle}>
            Theme <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <select 
            value={theme} 
            onChange={(e) => setTheme(e.target.value)} 
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "#3f51b5";
              e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
              e.target.style.boxShadow = "none";
            }}
          >
            <option value="light">🌞 Light Mode</option>
            <option value="dark">🌙 Dark Mode</option>
          </select>
        </div>

        {/* Font Size */}
        <div style={{ marginBottom: "28px" }}>
          <label style={labelStyle}>
            Font Size <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <select 
            value={fontSize} 
            onChange={(e) => setFontSize(e.target.value)} 
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "#3f51b5";
              e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
              e.target.style.boxShadow = "none";
            }}
          >
            {fontSizes.map((size) => (
              <option key={size} value={size}>
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Font Style */}
        <div style={{ marginBottom: "32px" }}>
          <label style={labelStyle}>
            Font Style <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <select 
            value={fontStyle} 
            onChange={(e) => setFontStyle(e.target.value)} 
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "#3f51b5";
              e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
              e.target.style.boxShadow = "none";
            }}
          >
            {fontStyles.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={savePreferences}
          style={{
            padding: "14px 24px",
            width: "100%",
            backgroundColor: "#3f51b5",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "1.05rem",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(63, 81, 181, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#303f9f";
            e.target.style.transform = "scale(1.02)";
            e.target.style.boxShadow = "0 6px 16px rgba(63, 81, 181, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#3f51b5";
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 12px rgba(63, 81, 181, 0.3)";
          }}
        >
          💾 Save Preferences
        </button>
      </div>

      
    </div>
  );
};

export default AppearanceSettings;