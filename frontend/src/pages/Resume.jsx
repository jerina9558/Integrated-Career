import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";

export default function Resume() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    summary: "",
    skills: "",
    education: "",
    experience: "",
    certifications: "",
    hobbies: "",
    languages: "",
    photo: null,
  });

  const [showResume, setShowResume] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const isDark = theme === "dark";
  const fontStyle = localStorage.getItem("fontStyle") || "Arial";

  useEffect(() => {
    const updateTheme = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };
    window.addEventListener("themeChange", updateTheme);
    return () => window.removeEventListener("themeChange", updateTheme);
  }, []);

  function handleChange(e) {
    const { id, value, files } = e.target;
    if (id === "photo" && files && files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        setFormData((prev) => ({ ...prev, photo: base64Data }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setShowResume(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Resume saved to database!");
      } else {
        alert("Error saving resume: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Server error! Check backend logs.");
    }
  }

  function addBullets(text) {
    return text.split(",").map((item) => `• ${item.trim()}`);
  }

  function handleDownload() {
    const pdf = new jsPDF("p", "mm", "a4");
    const margin = 10;
    const pageWidth = 210;

    pdf.setFillColor(63, 81, 181);
    pdf.rect(0, 0, pageWidth, 30, "F");
    pdf.setFontSize(22);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.text(formData.name || "Your Name", margin + 50, 18);

    if (formData.photo) {
      pdf.addImage(
        "data:image/jpeg;base64," + formData.photo,
        "JPEG",
        margin,
        5,
        35,
        35,
        undefined,
        "FAST"
      );
    }

    let leftX = margin;
    let leftY = 45;
    const leftSections = ["Contact Info", "Certifications", "Hobbies", "Languages"];
    leftSections.forEach((section) => {
      let content = null;
      if (section === "Contact Info") {
        content = [
          formData.email && `Email: ${formData.email}`,
          formData.phone && `Phone: ${formData.phone}`,
          formData.address && `Address: ${formData.address}`,
          formData.linkedin && `LinkedIn: ${formData.linkedin}`,
          formData.github && `GitHub: ${formData.github}`,
        ].filter(Boolean);
      } else {
        content = formData[section.toLowerCase()]
          ? addBullets(formData[section.toLowerCase()])
          : null;
      }

      if (content && content.length > 0) {
        pdf.setFillColor(220, 220, 220);
        pdf.rect(leftX - 2, leftY - 5, 55, 7, "F");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        pdf.text(section, leftX, leftY);
        leftY += 7;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        content.forEach((line) => {
          const splitLines = pdf.splitTextToSize(line, 55);
          splitLines.forEach((l) => {
            pdf.text(l, leftX, leftY);
            leftY += 5;
          });
        });
        leftY += 5;
      }
    });

    let rightX = 70;
    let rightY = 45;
    const rightSections = [
      { title: "Professional Summary", key: "summary" },
      { title: "Skills", key: "skills" },
      { title: "Education", key: "education" },
      { title: "Experience", key: "experience" },
    ];

    rightSections.forEach(({ title, key }) => {
      if (formData[key]) {
        pdf.setFillColor(200, 200, 200);
        pdf.rect(rightX - 2, rightY - 5, 130, 7, "F");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text(title, rightX, rightY);
        rightY += 7;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);

        if (key === "skills") {
          const skills = addBullets(formData.skills);
          skills.forEach((skill) => {
            const splitSkill = pdf.splitTextToSize(skill, 120);
            splitSkill.forEach((s) => {
              pdf.text(s, rightX, rightY);
              rightY += 5;
            });
          });
          rightY += 5;
        } else {
          const lines = pdf.splitTextToSize(formData[key], 120);
          lines.forEach((line) => {
            pdf.text(line, rightX, rightY);
            rightY += 5;
          });
          rightY += 5;
        }
      }
    });

    pdf.save(`${formData.name || "Resume"}_Resume.pdf`);
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: `2px solid ${isDark ? "#4a5568" : "#d1d5db"}`,
    backgroundColor: isDark ? "#1a202c" : "#ffffff",
    color: isDark ? "#ffffff" : "#111827",
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
    fontFamily: fontStyle,
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    fontSize: "0.95rem",
    color: isDark ? "#e2e8f0" : "#374151",
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        marginLeft: "50px",
        padding: "40px 150px",
        backgroundColor: isDark ? "#1a202c" : "#ffffff",
        color: isDark ? "#ffffff" : "#111827",
        minHeight: "100vh",
      }}
    >
      {/* Hero Section */}
      <div style={{
        background: isDark 
          ? "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)"
          : "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
        padding: "48px 130px",
        borderRadius: "16px",
        marginBottom: "48px",
        border: `1px solid ${isDark ? "#4a5568" : "#001d90ff"}`,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "700px",
          height: "700px",
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
          Build Your Resume
        </h2>
        <p style={{
          fontSize: "1.1rem",
          color: isDark ? "#a0aec0" : "#6b7280",
          maxWidth: "600px",
        }}>
          Create a professional resume that stands out and showcases your skills
        </p>
      </div>

      {/* Centered Form Container */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "60px",
      }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: "700px",
            backgroundColor: isDark ? "#2d3748" : "#ffffff",
            color: isDark ? "#ffffff" : "#111827",
            padding: "40px",
            borderRadius: "16px",
            boxShadow: isDark 
              ? "0 10px 30px rgba(0, 0, 0, 0.4)"
              : "0 6px 20px rgba(0, 0, 0, 0.08)",
            border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>
              Profile Photo
            </label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handleChange}
              style={{
                ...inputStyle,
                cursor: "pointer",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>
              Full Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              id="name"
              
              required
              value={formData.name}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#3f51b5";
                e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>
              Email <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="email"
              id="email"
              
              required
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#3f51b5";
                e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>
              Phone Number <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              id="phone"
              
              required
              value={formData.phone}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#3f51b5";
                e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Address</label>
            <input
              type="text"
              id="address"
             
              value={formData.address}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#3f51b5";
                e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>LinkedIn URL</label>
            <input
              type="text"
              id="linkedin"
             
              value={formData.linkedin}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#3f51b5";
                e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>GitHub URL</label>
            <input
              type="text"
              id="github"
              
              value={formData.github}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#3f51b5";
                e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Professional Summary</label>
            <textarea
              id="summary"
              
              rows={4}
              value={formData.summary}
              onChange={handleChange}
              style={{
                ...inputStyle,
                resize: "vertical",
                fontFamily: "inherit",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3f51b5";
                e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Skills</label>
            <input
              type="text"
              id="skills"
              value={formData.skills}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#3f51b5";
                e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Education Details</label>
            <textarea
              id="education"
              rows={3}
              value={formData.education}
              onChange={handleChange}
              style={{
                ...inputStyle,
                resize: "vertical",
                fontFamily: "inherit",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3f51b5";
                e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Experience Details</label>
            <textarea
              id="experience"
              rows={3}
              value={formData.experience}
              onChange={handleChange}
              style={{
                ...inputStyle,
                resize: "vertical",
                fontFamily: "inherit",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3f51b5";
                e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Certifications</label>
            <textarea
              id="certifications"
              rows={2}
              value={formData.certifications}
              onChange={handleChange}
              style={{
                ...inputStyle,
                resize: "vertical",
                fontFamily: "inherit",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3f51b5";
                e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Hobbies</label>
            <textarea
              id="hobbies"
              rows={2}
              value={formData.hobbies}
              onChange={handleChange}
              style={{
                ...inputStyle,
                resize: "vertical",
                fontFamily: "inherit",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3f51b5";
                e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>Languages Known</label>
            <textarea
              id="languages"
              rows={2}
              value={formData.languages}
              onChange={handleChange}
              style={{
                ...inputStyle,
                resize: "vertical",
                fontFamily: "inherit",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3f51b5";
                e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                padding: "14px 24px",
                flex: "1",
                minWidth: "150px",
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
              📝 Generate Resume
            </button>
            {showResume && (
              <button
                type="button"
                onClick={handleDownload}
                style={{
                  padding: "14px 24px",
                  flex: "1",
                  minWidth: "150px",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "1.05rem",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#059669";
                  e.target.style.transform = "scale(1.02)";
                  e.target.style.boxShadow = "0 6px 16px rgba(16, 185, 129, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#10b981";
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.3)";
                }}
              >
                📥 Download PDF
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}