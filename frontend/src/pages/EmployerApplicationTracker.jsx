import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EmployerApplicationTracker() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const token = localStorage.getItem("token");
  const isDark = theme === "dark";

  useEffect(() => {
    const updateTheme = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };
    window.addEventListener("themeChange", updateTheme);
    return () => window.removeEventListener("themeChange", updateTheme);
  }, []);

  // Fetch accepted student applications with submitted projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/tracker/employer/applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data || []);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Handle rating input change
  const handleRatingChange = (appId, field, value) => {
    setRatings((prev) => ({
      ...prev,
      [appId]: { ...prev[appId], [field]: Number(value) },
    }));
  };

  // Submit evaluation for a student
  const handleSubmit = async (appId) => {
    const ratingData = ratings[appId];
    if (
      !ratingData ||
      Object.values(ratingData).some((v) => v === undefined || v === "")
    ) {
      return alert("⚠️ Please provide ratings for all fields!");
    }

    setSubmitting(true);
    try {
      console.log("Submitting evaluation:", ratingData);

      await axios.post(
        `http://localhost:5000/tracker/employer/evaluate/${appId}`,
        ratingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ Evaluation submitted successfully!");
    } catch (err) {
      console.error("❌ Error submitting evaluation:", err);
      alert("❌ Failed to submit evaluation.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading applications...</p>;

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        marginLeft: "50px",
        padding: "40px 60px",
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
        padding: "48px 300px",
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
          Student Submissions
        </h2>
        <p style={{
          fontSize: "1.1rem",
          color: isDark ? "#a0aec0" : "#6b7280",
          maxWidth: "600px",
        }}>
          View submitted projects and rate student performance
        </p>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "80px 20px",
          backgroundColor: isDark ? "#2d3748" : "#f9fafb",
          borderRadius: "16px",
          border: `2px dashed ${isDark ? "#4a5568" : "#d1d5db"}`,
        }}>
          <div style={{
            fontSize: "4rem",
            marginBottom: "16px",
            opacity: 0.5,
          }}>
            ⚠️
          </div>
          <p style={{
            fontSize: "1.3rem",
            fontWeight: "600",
            color: isDark ? "#e2e8f0" : "#374151",
            marginBottom: "8px",
          }}>
            No submissions found
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))",
            gap: "28px",
          }}
        >
          {applications.map((app) => (
            <div
              key={app.id}
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

              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "8px",
                color: isDark ? "#90cdf4" : "#3f51b5",
                lineHeight: "1.3",
              }}>
                {app.studentName}
              </h3>

              <p style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                marginBottom: "16px",
                color: isDark ? "#e2e8f0" : "#374151",
              }}>
                {app.jobTitle}
              </p>

              <div style={{
                backgroundColor: isDark ? "#4a5568" : "#f3f4f6",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "0.95rem",
                color: isDark ? "#e2e8f0" : "#4b5563",
                fontWeight: "500",
              }}>
                ⏱️ Duration: {app.jobDuration || "N/A"}
              </div>

              {/* View uploaded project */}
              {app.project_file ? (
                <a
                  href={`http://localhost:5000${app.project_file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    padding: "12px 20px",
                    backgroundColor: "#3b82f6",
                    color: "#fff",
                    borderRadius: "8px",
                    textDecoration: "none",
                    marginBottom: "20px",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    transition: "all 0.2s ease",
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#2563eb";
                    e.target.style.transform = "scale(1.02)";
                    e.target.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#3b82f6";
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
                  }}
                >
                  📁 View Project
                </a>
              ) : (
                <p style={{ 
                  color: isDark ? "#a0aec0" : "#9ca3af",
                  marginBottom: "20px",
                  fontStyle: "italic",
                }}>
                  No project uploaded yet
                </p>
              )}

              {/* Rating fields */}
              <div style={{ marginTop: "20px" }}>
                {["Communication", "Technical", "Teamwork", "Creativity", "Punctuality"].map(
                  (field) => (
                    <div
                      key={field}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <label style={{ 
                        fontWeight: "600", 
                        width: "150px",
                        color: isDark ? "#e2e8f0" : "#1f2937",
                      }}>
                        {field}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0-100"
                        value={ratings[app.id]?.[field.toLowerCase()] || ""}
                        onChange={(e) => handleRatingChange(app.id, field.toLowerCase(), e.target.value)}
                        style={{
                          padding: "10px 14px",
                          width: "100px",
                          borderRadius: "8px",
                          border: `2px solid ${isDark ? "#4a5568" : "#d1d5db"}`,
                          backgroundColor: isDark ? "#1a202c" : "#ffffff",
                          color: isDark ? "#ffffff" : "#111827",
                          fontSize: "0.95rem",
                          fontWeight: "600",
                          outline: "none",
                          transition: "all 0.2s ease",
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
                  )
                )}
              </div>

              <div style={{ textAlign: "right", marginTop: "24px" }}>
                <button
                  onClick={() => handleSubmit(app.id)}
                  disabled={submitting}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#16a34a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: submitting ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    fontSize: "1rem",
                    transition: "all 0.2s ease",
                    boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)",
                    opacity: submitting ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) {
                      e.target.style.backgroundColor = "#15803d";
                      e.target.style.transform = "scale(1.02)";
                      e.target.style.boxShadow = "0 6px 16px rgba(22, 163, 74, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!submitting) {
                      e.target.style.backgroundColor = "#16a34a";
                      e.target.style.transform = "scale(1)";
                      e.target.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.3)";
                    }
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Evaluation"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}