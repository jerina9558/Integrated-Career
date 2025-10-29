import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    title: "",
    domain: "",
    location: "",
    duration: "",
    description: "",
  });

  const token = localStorage.getItem("token");

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const isDark = theme === "dark";

  useEffect(() => {
    const updateTheme = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };
    window.addEventListener("themeChange", updateTheme);
    return () => window.removeEventListener("themeChange", updateTheme);
  }, []);

  const fetchJobs = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/employer/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err.response?.data || err.message);
      alert(
        err.response?.data?.error ||
          "❌ Failed to fetch jobs. Please login as Employer."
      );
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prev) => ({ ...prev, [name]: value }));
  };

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/employer/jobs",
        newJob,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(res.data.message || "✅ Job posted successfully!");
      fetchJobs();
      setNewJob({
        title: "",
        domain: "",
        location: "",
        duration: "",
        description: "",
      });
    } catch (err) {
      console.error("Error posting job:", err.response?.data || err.message);
      alert(
        err.response?.data?.error ||
          "❌ Failed to post job. Please login as Employer."
      );
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await axios.delete(`http://localhost:5000/employer/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      alert("🗑️ Job deleted successfully!");
    } catch (err) {
      console.error("Error deleting job:", err.response?.data || err.message);
      alert(err.response?.data?.error || "❌ Failed to delete job.");
    }
  };

  // Common input style
  const inputStyle = {
    width: "100%",
    padding: "12px 260px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: `2px solid ${isDark ? "#4a5568" : "#d1d5db"}`,
    backgroundColor: isDark ? "#1a202c" : "#ffffff",
    color: isDark ? "#ffffff" : "#111827",
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
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
        padding: "40px 40px",
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
        padding: "48px 40px",
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
          Post a Job/Internship
        </h2>
        <p style={{
          fontSize: "1.1rem",
          color: isDark ? "#a0aec0" : "#6b7280",
          maxWidth: "600px",
        }}>
          Share exciting opportunities with talented students and build your team
        </p>
      </div>

      {/* Centered Form Container */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "60px",
      }}>
        <form
          onSubmit={handlePost}
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
              Job Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              name="title"

              value={newJob.title}
              onChange={handleChange}
              required
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
              Domain <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              name="domain"
              value={newJob.domain}
              onChange={handleChange}
              required
              style={{
                ...inputStyle,
                cursor: "pointer",
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
              <option value="">Select Domain</option>
              <option value="web">Web Development</option>
              <option value="data">Data Science</option>
              <option value="design">UI/UX Design</option>
              <option value="marketing">Digital Marketing</option>
            </select>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>
              Location <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              name="location"
              value={newJob.location}
              onChange={handleChange}
              required
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
              Duration <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              name="duration"
              value={newJob.duration}
              onChange={handleChange}
              required
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

          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>
              Description <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              name="description"
              value={newJob.description}
              onChange={handleChange}
              required
              rows={5}
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

          <button
            type="submit"
            style={{
              padding: "14px 140px",
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
            ➕ Post Job
          </button>
        </form>
      </div>

      {/* Posted Jobs Section */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}>
          <h3 style={{
            fontSize: "1.75rem",
            fontWeight: "600",
            color: isDark ? "#e2e8f0" : "#1f2937",
          }}>
            Your Posted Jobs
          </h3>
          <div style={{
            backgroundColor: isDark ? "#2d3748" : "#f9fafb",
            padding: "12px 140px",
            borderRadius: "8px",
            border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
          }}>
            <span style={{
              fontSize: "0.85rem",
              color: isDark ? "#a0aec0" : "#6b7280",
              marginRight: "8px",
            }}>
              Total:
            </span>
            <span style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: isDark ? "#90cdf4" : "#3f51b5",
            }}>
              {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'}
            </span>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "80px 140px",
            backgroundColor: isDark ? "#2d3748" : "#f9fafb",
            borderRadius: "16px",
            border: `2px dashed ${isDark ? "#4a5568" : "#d1d5db"}`,
          }}>
            <div style={{
              fontSize: "4rem",
              marginBottom: "16px",
              opacity: 0.5,
            }}>
              📋
            </div>
            <p style={{
              fontSize: "1.3rem",
              fontWeight: "600",
              color: isDark ? "#e2e8f0" : "#374151",
              marginBottom: "8px",
            }}>
              No jobs posted yet
            </p>
            <p style={{
              fontSize: "1rem",
              color: isDark ? "#a0aec0" : "#6b7280",
            }}>
              Create your first job posting using the form above
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "28px",
            }}
          >
            {jobs.map((job) => (
              <div
                key={job.id}
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
                  marginBottom: "20px",
                  color: isDark ? "#90cdf4" : "#3f51b5",
                  lineHeight: "1.3",
                }}>
                  {job.title}
                </h3>

                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "20px",
                }}>
                  <span style={{
                    backgroundColor: isDark ? "#4a5568" : "#ede9fe",
                    color: isDark ? "#c3dafe" : "#5b21b6",
                    padding: "6px 140px",
                    borderRadius: "20px",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}>
                    💼 {job.domain}
                  </span>
                  <span style={{
                    backgroundColor: isDark ? "#4a5568" : "#fef3c7",
                    color: isDark ? "#fbd38d" : "#92400e",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}>
                    📍 {job.location}
                  </span>
                  <span style={{
                    backgroundColor: isDark ? "#4a5568" : "#dbeafe",
                    color: isDark ? "#90cdf4" : "#1e40af",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}>
                    ⏱️ {job.duration}
                  </span>
                </div>

                <p style={{
                  fontSize: "1rem",
                  lineHeight: "1.7",
                  color: isDark ? "#cbd5e0" : "#4b5563",
                  marginBottom: "24px",
                  minHeight: "60px",
                }}>
                  {job.description}
                </p>

                <button
                  onClick={() => handleDelete(job.id)}
                  style={{
                    padding: "12px 24px",
                    width: "100%",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "1rem",
                    transition: "all 0.2s ease",
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#dc2626";
                    e.target.style.transform = "scale(1.02)";
                    e.target.style.boxShadow = "0 6px 16px rgba(239, 68, 68, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#ef4444";
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)";
                  }}
                >
                  🗑️ Delete Job
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}