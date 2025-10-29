import React, { createContext, useContext, useState, useEffect } from "react";

// ---------- Feedback Context ----------
const FeedbackContext = createContext();

const FeedbackProvider = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState(() => {
    return JSON.parse(localStorage.getItem("feedbacks")) || [];
  });

  const fetchFeedbacks = async (role) => {
    try {
      const res = await fetch(`http://localhost:5000/feedbacks/${role}`);
      const data = await res.json();
      setFeedbacks(data);
      localStorage.setItem("feedbacks", JSON.stringify(data));
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };

  const addFeedback = (newFeedback) => {
    setFeedbacks((prev) => {
      const updated = [...prev, newFeedback];
      localStorage.setItem("feedbacks", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <FeedbackContext.Provider value={{ feedbacks, setFeedbacks, fetchFeedbacks, addFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
};

// ---------- Main Feedback Component ----------
const Feedback = () => {
  const role = localStorage.getItem("role") || "student";
  const userId = localStorage.getItem("userId") || `${role}_anonymous`;
  const { feedbacks, fetchFeedbacks, addFeedback } = useContext(FeedbackContext);

  const [form, setForm] = useState({
    name: "",
    type: "Portal Experience",
    rating: 0,
    message: "",
    anonymous: false,
  });

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const isDark = theme === "dark";

  useEffect(() => {
    const updateTheme = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };
    window.addEventListener("themeChange", updateTheme);
    return () => window.removeEventListener("themeChange", updateTheme);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message.trim() || form.rating === 0) {
      alert("Please provide both rating and message.");
      return;
    }

    const newFeedback = {
      ...form,
      role,
      userId,
      id: Date.now(),
      name: form.anonymous ? "Anonymous User" : form.name || "Anonymous User",
    };

    try {
      const res = await fetch("http://localhost:5000/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFeedback),
      });
      const data = await res.json();

      if (data.success) {
        alert("Feedback submitted successfully!");
        addFeedback(newFeedback);

        setForm({
          name: "",
          type: "Portal Experience",
          rating: 0,
          message: "",
          anonymous: false,
        });

        fetchFeedbacks(role);
      } else {
        alert("Failed to submit feedback.");
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Server error while submitting feedback.");
      addFeedback(newFeedback);
    }
  };

  useEffect(() => {
    fetchFeedbacks(role);
  }, [role]);

  const displayFeedbacks =
    role === "admin" ? feedbacks : feedbacks.filter((f) => f.userId === userId);

  const averageRating =
    displayFeedbacks.length > 0
      ? (
          displayFeedbacks.reduce((sum, f) => sum + parseInt(f.rating), 0) /
          displayFeedbacks.length
        ).toFixed(1)
      : 0;

  const employerFeedbacks = feedbacks.filter(f => f.role === 'employer');
  const studentFeedbacks = feedbacks.filter(f => f.role === 'student');
  
  const employerAvgRating = employerFeedbacks.length > 0
    ? (employerFeedbacks.reduce((sum, f) => sum + parseInt(f.rating), 0) / employerFeedbacks.length).toFixed(1)
    : 0;
    
  const studentAvgRating = studentFeedbacks.length > 0
    ? (studentFeedbacks.reduce((sum, f) => sum + parseInt(f.rating), 0) / studentFeedbacks.length).toFixed(1)
    : 0;

  const statCard = (label, value, icon) => (
    <div
      style={{
        flex: 1,
        backgroundColor: isDark ? "#2d3748" : "#ffffff",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: isDark 
          ? "0 10px 30px rgba(0, 0, 0, 0.4)"
          : "0 6px 20px rgba(0, 0, 0, 0.08)",
        border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        minWidth: "180px",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = isDark
          ? "0 16px 40px rgba(0, 0, 0, 0.5)"
          : "0 12px 30px rgba(0, 0, 0, 0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = isDark
          ? "0 10px 30px rgba(0, 0, 0, 0.4)"
          : "0 6px 20px rgba(0, 0, 0, 0.08)";
      }}
    >
      <h4 style={{ 
        fontSize: "0.875rem", 
        color: isDark ? "#a0aec0" : "#6b7280",
        marginBottom: "8px",
        fontWeight: "500",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}>
        {label}
      </h4>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <h2 style={{ 
          fontSize: "2.5rem", 
          fontWeight: "700", 
          color: isDark ? "#90cdf4" : "#3f51b5",
        }}>
          {value}
        </h2>
        <div style={{ 
          backgroundColor: isDark ? "rgba(144, 205, 244, 0.2)" : "rgba(63, 81, 181, 0.2)", 
          padding: "10px", 
          borderRadius: "10px",
          fontSize: "1.5rem",
        }}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        marginLeft: "50px",
        padding: "40px 160px",
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
        padding: "48px 180px",
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
          Feedback & Suggestions
        </h2>
        <p style={{
          fontSize: "1.1rem",
          color: isDark ? "#a0aec0" : "#6b7280",
          maxWidth: "600px",
        }}>
          Share your thoughts and help us improve
        </p>
      </div>

      {/* Statistics Cards - Only for Admin */}
      {role === "admin" && (
        <div style={{ marginBottom: "40px" }}>
          {/* Top Row - Overall Stats */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "20px", justifyContent: "center" }}>
            {statCard("Total Feedback", displayFeedbacks.length, "💬")}
            {statCard("Overall Avg Rating", averageRating, "⭐")}
          </div>

          {/* Bottom Row - Employer and Student Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* Left Side - Employer */}
            <div>
              <h3 style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                marginBottom: "16px",
                color: isDark ? "#90cdf4" : "#3f51b5",
              }}>
                Employer Statistics
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {statCard("Employer Feedback", employerFeedbacks.length, "👔")}
                {statCard("Employer Avg", employerAvgRating, "⭐")}
              </div>
            </div>

            {/* Right Side - Student */}
            <div>
              <h3 style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                marginBottom: "16px",
                color: isDark ? "#90cdf4" : "#3f51b5",
              }}>
                Student Statistics
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {statCard("Student Feedback", studentFeedbacks.length, "🎓")}
                {statCard("Student Avg", studentAvgRating, "⭐")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Form */}
      {role !== "admin" && (
        <div
          style={{
            backgroundColor: isDark ? "#2d3748" : "#ffffff",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: isDark 
              ? "0 10px 30px rgba(0, 0, 0, 0.4)"
              : "0 6px 20px rgba(0, 0, 0, 0.08)",
            border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
            marginBottom: "40px",
          }}
        >
          <h3 style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            marginBottom: "24px",
            color: isDark ? "#90cdf4" : "#3f51b5",
          }}>
            Submit Your Feedback
          </h3>

          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <label style={{ 
              display: "block", 
              fontWeight: "600", 
              marginBottom: "8px",
              color: isDark ? "#e2e8f0" : "#1f2937",
            }}>
              Your Name:
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              style={{
                width: "100%",
                padding: "12px 16px",
                marginBottom: "20px",
                borderRadius: "8px",
                border: `2px solid ${isDark ? "#4a5568" : "#d1d5db"}`,
                backgroundColor: isDark ? "#1a202c" : "#ffffff",
                color: isDark ? "#ffffff" : "#111827",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.2s ease",
                boxSizing: "border-box",
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

            <label style={{ 
              display: "block", 
              fontWeight: "600", 
              marginBottom: "8px",
              color: isDark ? "#e2e8f0" : "#1f2937",
            }}>
              Feedback Type:
            </label>
            <select 
              name="type" 
              value={form.type} 
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                marginBottom: "20px",
                borderRadius: "8px",
                border: `2px solid ${isDark ? "#4a5568" : "#d1d5db"}`,
                backgroundColor: isDark ? "#1a202c" : "#ffffff",
                color: isDark ? "#ffffff" : "#111827",
                fontSize: "1rem",
                cursor: "pointer",
                outline: "none",
                transition: "all 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3f51b5";
                e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            >
              <option>Portal Experience</option>
              <option>Company Feedback</option>
              <option>Suggestion</option>
              <option>Complaint</option>
            </select>

            <label style={{ 
              display: "block", 
              fontWeight: "600", 
              marginBottom: "8px",
              color: isDark ? "#e2e8f0" : "#1f2937",
            }}>
              Rating:
            </label>
            <div style={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "flex-end",
              marginBottom: "20px",
              gap: "4px",
            }}>
              {[5, 4, 3, 2, 1].map((num) => (
                <label
                  key={num}
                  style={{
                    fontSize: "2rem",
                    color: form.rating >= num ? "#fbc02d" : "#ccc",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "scale(1.2)"}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                >
                  <input
                    type="radio"
                    name="rating"
                    value={num}
                    checked={parseInt(form.rating) === num}
                    onChange={handleChange}
                    style={{ display: "none" }}
                  />
                  ★
                </label>
              ))}
            </div>

            <label style={{ 
              display: "block", 
              fontWeight: "600", 
              marginBottom: "8px",
              color: isDark ? "#e2e8f0" : "#1f2937",
            }}>
              Your Message:
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your feedback here..."
              style={{
                width: "100%",
                padding: "12px 16px",
                marginBottom: "20px",
                borderRadius: "8px",
                border: `2px solid ${isDark ? "#4a5568" : "#d1d5db"}`,
                backgroundColor: isDark ? "#1a202c" : "#ffffff",
                color: isDark ? "#ffffff" : "#111827",
                fontSize: "1rem",
                resize: "vertical",
                minHeight: "120px",
                outline: "none",
                transition: "all 0.2s ease",
                boxSizing: "border-box",
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

            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              marginBottom: "24px",
              color: isDark ? "#e2e8f0" : "#1f2937",
            }}>
              <input
                type="checkbox"
                name="anonymous"
                checked={form.anonymous}
                onChange={handleChange}
                style={{ cursor: "pointer" }}
              />
              <label style={{ fontWeight: "500", cursor: "pointer" }}>Submit anonymously</label>
            </div>

            <button 
              onClick={handleSubmit}
              style={{
                width: "100%",
                padding: "14px 24px",
                backgroundColor: "#3f51b5",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "1rem",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(63, 81, 181, 0.3)",
                boxSizing: "border-box",
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
              Submit Feedback
            </button>
          </div>
        </div>
      )}

      {/* Feedbacks List */}
      {role === "admin" ? (
        // Admin view - Show employer and student feedback separately
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          {/* Left Side - Employer Feedbacks */}
          <div>
            <h3 style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "24px",
              color: isDark ? "#90cdf4" : "#3f51b5",
            }}>
              Employer Feedbacks
            </h3>
            {employerFeedbacks.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "60px 20px",
                backgroundColor: isDark ? "#2d3748" : "#f9fafb",
                borderRadius: "16px",
                border: `2px dashed ${isDark ? "#4a5568" : "#d1d5db"}`,
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "12px", opacity: 0.5 }}>👔</div>
                <p style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: isDark ? "#e2e8f0" : "#374151",
                }}>
                  No employer feedback yet
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {employerFeedbacks.map((f) => (
                  <div
                    key={f.id}
                    style={{
                      backgroundColor: isDark ? "#2d3748" : "white",
                      color: isDark ? "#ffffff" : "#111827",
                      padding: "24px",
                      borderRadius: "12px",
                      boxShadow: isDark 
                        ? "0 8px 24px rgba(0, 0, 0, 0.4)"
                        : "0 4px 16px rgba(0, 0, 0, 0.08)",
                      border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = isDark
                        ? "0 12px 32px rgba(0, 0, 0, 0.5)"
                        : "0 8px 24px rgba(0, 0, 0, 0.12)";
                      e.currentTarget.style.borderColor = "#3f51b5";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = isDark
                        ? "0 8px 24px rgba(0, 0, 0, 0.4)"
                        : "0 4px 16px rgba(0, 0, 0, 0.08)";
                      e.currentTarget.style.borderColor = isDark ? "#4a5568" : "#e5e7eb";
                    }}
                  >
                    <div style={{ marginBottom: "12px" }}>
                      <h4 style={{
                        fontSize: "1.1rem",
                        fontWeight: "700",
                        color: isDark ? "#90cdf4" : "#3f51b5",
                        marginBottom: "4px",
                      }}>
                        {f.name}
                      </h4>
                      <span style={{ fontSize: "1rem", color: "#fbc02d" }}>
                        {"★".repeat(f.rating) + "☆".repeat(5 - f.rating)}
                      </span>
                    </div>
                    <div style={{
                      backgroundColor: isDark ? "#4a5568" : "#f3f4f6",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      marginBottom: "12px",
                      fontSize: "0.85rem",
                      color: isDark ? "#e2e8f0" : "#4b5563",
                      fontWeight: "500",
                      fontStyle: "italic",
                    }}>
                      {f.type}
                    </div>
                    <p style={{
                      fontSize: "0.95rem",
                      lineHeight: "1.6",
                      color: isDark ? "#cbd5e0" : "#4b5563",
                    }}>
                      {f.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Student Feedbacks */}
          <div>
            <h3 style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "24px",
              color: isDark ? "#90cdf4" : "#3f51b5",
            }}>
              Student Feedbacks
            </h3>
            {studentFeedbacks.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "60px 20px",
                backgroundColor: isDark ? "#2d3748" : "#f9fafb",
                borderRadius: "16px",
                border: `2px dashed ${isDark ? "#4a5568" : "#d1d5db"}`,
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "12px", opacity: 0.5 }}>🎓</div>
                <p style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: isDark ? "#e2e8f0" : "#374151",
                }}>
                  No student feedback yet
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {studentFeedbacks.map((f) => (
                  <div
                    key={f.id}
                    style={{
                      backgroundColor: isDark ? "#2d3748" : "white",
                      color: isDark ? "#ffffff" : "#111827",
                      padding: "24px",
                      borderRadius: "12px",
                      boxShadow: isDark 
                        ? "0 8px 24px rgba(0, 0, 0, 0.4)"
                        : "0 4px 16px rgba(0, 0, 0, 0.08)",
                      border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = isDark
                        ? "0 12px 32px rgba(0, 0, 0, 0.5)"
                        : "0 8px 24px rgba(0, 0, 0, 0.12)";
                      e.currentTarget.style.borderColor = "#3f51b5";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = isDark
                        ? "0 8px 24px rgba(0, 0, 0, 0.4)"
                        : "0 4px 16px rgba(0, 0, 0, 0.08)";
                      e.currentTarget.style.borderColor = isDark ? "#4a5568" : "#e5e7eb";
                    }}
                  >
                    <div style={{ marginBottom: "12px" }}>
                      <h4 style={{
                        fontSize: "1.1rem",
                        fontWeight: "700",
                        color: isDark ? "#90cdf4" : "#3f51b5",
                        marginBottom: "4px",
                      }}>
                        {f.name}
                      </h4>
                      <span style={{ fontSize: "1rem", color: "#fbc02d" }}>
                        {"★".repeat(f.rating) + "☆".repeat(5 - f.rating)}
                      </span>
                    </div>
                    <div style={{
                      backgroundColor: isDark ? "#4a5568" : "#f3f4f6",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      marginBottom: "12px",
                      fontSize: "0.85rem",
                      color: isDark ? "#e2e8f0" : "#4b5563",
                      fontWeight: "500",
                      fontStyle: "italic",
                    }}>
                      {f.type}
                    </div>
                    <p style={{
                      fontSize: "0.95rem",
                      lineHeight: "1.6",
                      color: isDark ? "#cbd5e0" : "#4b5563",
                    }}>
                      {f.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Non-admin view - Show user's own feedback
        displayFeedbacks.length === 0 ? (
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
              💬
            </div>
            <p style={{
              fontSize: "1.3rem",
              fontWeight: "600",
              color: isDark ? "#e2e8f0" : "#374151",
              marginBottom: "8px",
            }}>
              No feedback yet
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: "28px",
            }}
          >
            {displayFeedbacks.map((f) => (
              <div
                key={f.id}
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

                <div style={{ marginBottom: "16px" }}>
                  <h3 style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    color: isDark ? "#90cdf4" : "#3f51b5",
                    marginBottom: "4px",
                  }}>
                    {f.name}
                  </h3>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}>
                    <span style={{
                      fontSize: "0.875rem",
                      color: isDark ? "#a0aec0" : "#6b7280",
                      textTransform: "uppercase",
                      fontWeight: "600",
                    }}>
                      {f.role}
                    </span>
                    <span style={{
                      fontSize: "1.2rem",
                      color: "#fbc02d",
                    }}>
                      {"★".repeat(f.rating) + "☆".repeat(5 - f.rating)}
                    </span>
                  </div>
                </div>

                <div style={{
                  backgroundColor: isDark ? "#4a5568" : "#f3f4f6",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  fontSize: "0.9rem",
                  color: isDark ? "#e2e8f0" : "#4b5563",
                  fontWeight: "500",
                  fontStyle: "italic",
                }}>
                  {f.type}
                </div>

                <p style={{
                  fontSize: "1rem",
                  lineHeight: "1.6",
                  color: isDark ? "#cbd5e0" : "#4b5563",
                }}>
                  {f.message}
                </p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

// ---------- Export ----------
export default function FeedbackApp() {
  return (
    <FeedbackProvider>
      <Feedback />
    </FeedbackProvider>
  );
}