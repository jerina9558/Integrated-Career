import React, { useState, useEffect } from "react";
import axios from "axios";

export default function StudentJobs() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    resume: null,
    linkedin: "",
    github: "",
    graduationYear: "",
    skills: "",
    domain: "",
    duration: "",
  });

  const token = localStorage.getItem("token");

  // ✅ Track theme
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };
    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);
  const isDark = theme === "dark";

  // Fetch all jobs
  useEffect(() => {
    if (!token) return;

    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        alert("❌ Failed to fetch jobs. Please login as a student.");
      }
    };

    fetchJobs();
  }, [token]);

  // Fetch applied jobs
  useEffect(() => {
    if (!token) return;

    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/applied-jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppliedJobs(res.data.map((job) => job.job_id || job.id));
      } catch (err) {
        console.error("Error fetching applied jobs:", err);
      }
    };

    fetchAppliedJobs();
  }, [token]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = showForm ? "hidden" : "auto";
  }, [showForm]);

  // Open application modal
  const handleApply = (job) => {
    setSelectedJob(job);
    setFormData((prev) => ({
      ...prev,
      domain: job.domain || "",
      duration: job.duration || "",
    }));
    setShowForm(true);
  };

  // Form input change handler
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData((prev) => ({ ...prev, resume: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit job application
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) data.append(key, value);
    });

    try {
      const res = await axios.post(
        `http://localhost:5000/apply/${selectedJob.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAppliedJobs((prev) => [...prev, selectedJob.id]);
      alert(res.data.message || "✅ Application submitted!");
      setShowForm(false);
      setFormData({
        name: "",
        email: "",
        college: "",
        resume: null,
        linkedin: "",
        github: "",
        graduationYear: "",
        skills: "",
        domain: "",
        duration: "",
      });
    } catch (err) {
      console.error("Error applying:", err);
      alert(err.response?.data?.error || "❌ Failed to apply.");
    }
  };

  // Filter jobs based on domain
  const filteredJobs =
    selectedDomain === "all"
      ? jobs
      : jobs.filter((job) =>
          job.domain.toLowerCase().includes(selectedDomain.toLowerCase())
        );

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        marginLeft: "50px",
        padding: "40px 100px",
        backgroundColor: isDark ? "#1a202c" : "#ffffff",
        color: isDark ? "#ffffff" : "#111827",
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      {/* Hero Section with Stats */}
      <div style={{ marginBottom: "48px" }}>
        <div style={{
          background: isDark 
            ? "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)"
            : "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
          padding: "48px 150px",
          borderRadius: "16px",
          marginBottom: "32px",
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
            whiteSpace: "nowrap",

            backgroundClip: "text",
          }}>
            Available Internships
          </h2>
          <p style={{
            fontSize: "1.1rem",
            color: isDark ? "#a0aec0" : "#6b7280",
            marginBottom: "32px",
            maxWidth: "600px",
          }}>
            Discover exciting opportunities to kickstart your career and gain valuable industry experience
          </p>

          {/* Stats Row */}
          <div style={{
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
          }}>
            <div style={{
              backgroundColor: isDark ? "#1a202c" : "#ffffff",
              padding: "20px 28px",
              borderRadius: "12px",
              border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
              minWidth: "150px",
            }}>
              <div style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "#3f51b5",
                marginBottom: "4px",
              }}>
                {jobs.length}
              </div>
              <div style={{
                fontSize: "0.9rem",
                color: isDark ? "#a0aec0" : "#6b7280",
              }}>
                Total Opportunities
              </div>
            </div>
            <div style={{
              backgroundColor: isDark ? "#1a202c" : "#ffffff",
              padding: "20px 28px",
              borderRadius: "12px",
              border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
              minWidth: "150px",
            }}>
              <div style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "#10b981",
                marginBottom: "4px",
              }}>
                {appliedJobs.length}
              </div>
              <div style={{
                fontSize: "0.9rem",
                color: isDark ? "#a0aec0" : "#6b7280",
              }}>
                Applications Sent
              </div>
            </div>
            <div style={{
              backgroundColor: isDark ? "#1a202c" : "#ffffff",
              padding: "20px 28px",
              borderRadius: "12px",
              border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
              minWidth: "150px",
            }}>
              <div style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "#f59e0b",
                marginBottom: "4px",
              }}>
                {filteredJobs.length}
              </div>
              <div style={{
                fontSize: "0.9rem",
                color: isDark ? "#a0aec0" : "#6b7280",
              }}>
                Matching Results
              </div>
            </div>
          </div>
        </div>

        {/* Domain Filter */}
        <div style={{
          backgroundColor: isDark ? "#2d3748" : "#f9fafb",
          padding: "28px 32px",
          borderRadius: "12px",
          border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
          boxShadow: isDark 
            ? "0 4px 6px rgba(0, 0, 0, 0.3)"
            : "0 2px 4px rgba(0, 0, 0, 0.05)",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}>
            <div style={{ flex: "1", minWidth: "200px" }}>
              <label 
                htmlFor="domain-select"
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  marginBottom: "12px",
                  display: "block",
                  color: isDark ? "#e2e8f0" : "#374151",
                }}
              >
                🔍 Filter by Domain
              </label>
              <select
                id="domain-select"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                style={{
                  padding: "12px 16px",
                  width: "100%",
                  fontSize: "1rem",
                  backgroundColor: isDark ? "#1a202c" : "#ffffff",
                  color: isDark ? "#ffffff" : "#111827",
                  border: `2px solid ${isDark ? "#4a5568" : "#d1d5db"}`,
                  borderRadius: "8px",
                  cursor: "pointer",
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
              >
                <option value="all">All Domains</option>
                <option value="web">Web Development</option>
                <option value="data">Data Science</option>
                <option value="design">UI/UX Design</option>
                <option value="marketing">Digital Marketing</option>
              </select>
            </div>
            
            <div style={{
              backgroundColor: isDark ? "#1a202c" : "#ffffff",
              padding: "16px 24px",
              borderRadius: "8px",
              border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
            }}>
              <div style={{
                fontSize: "0.85rem",
                color: isDark ? "#a0aec0" : "#6b7280",
                marginBottom: "4px",
              }}>
                Showing
              </div>
              <div style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: isDark ? "#90cdf4" : "#3f51b5",
              }}>
                {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "24px",
        flexWrap: "wrap",
        gap: "16px",
      }}>
        <h3 style={{
          fontSize: "1.5rem",
          fontWeight: "600",
          color: isDark ? "#e2e8f0" : "#1f2937",
        }}>
          {selectedDomain === "all" ? "All Opportunities" : `${selectedDomain.charAt(0).toUpperCase() + selectedDomain.slice(1)} Opportunities`}
        </h3>
        <div style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}>
          <span style={{
            fontSize: "0.9rem",
            color: isDark ? "#a0aec0" : "#6b7280",
          }}>
           
          </span>
         
        </div>
      </div>

      {/* Jobs List */}
      <div id="job-list">
        {filteredJobs.length === 0 ? (
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
              🔍
            </div>
            <p style={{
              fontSize: "1.3rem",
              fontWeight: "600",
              color: isDark ? "#e2e8f0" : "#374151",
              marginBottom: "8px",
            }}>
              No jobs available
            </p>
            <p style={{
              fontSize: "1rem",
              color: isDark ? "#a0aec0" : "#6b7280",
            }}>
              Try selecting a different domain or check back later
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
            gap: "28px",
          }}>
            {filteredJobs.map((job) => (
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
                  cursor: "pointer",
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
                {/* Decorative Elements */}
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
                
                {appliedJobs.includes(job.id) && (
                  <div style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    backgroundColor: "#10b981",
                    color: "white",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                  }}>
                    <span>✓</span> Applied
                  </div>
                )}

                <h3 style={{
                  fontSize: "1.6rem",
                  fontWeight: "700",
                  marginBottom: "20px",
                  color: isDark ? "#90cdf4" : "#3f51b5",
                  lineHeight: "1.3",
                  paddingRight: appliedJobs.includes(job.id) ? "100px" : "0",
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
                    padding: "6px 14px",
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
                  marginBottom: "20px",
                  minHeight: "60px",
                }}>
                  {job.description}
                </p>

                <div style={{
                  padding: "16px",
                  backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "#f9fafb",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
                }}>
                  <div style={{
                    fontSize: "0.85rem",
                    color: isDark ? "#a0aec0" : "#6b7280",
                    marginBottom: "4px",
                  }}>
                    Posted by
                  </div>
                  <div style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: isDark ? "#e2e8f0" : "#374151",
                  }}>
                    {job.employer_name}
                  </div>
                </div>

                <button
                  disabled={appliedJobs.includes(job.id)}
                  style={{
                    padding: "14px 24px",
                    width: "100%",
                    fontSize: "1.05rem",
                    fontWeight: "600",
                    backgroundColor: appliedJobs.includes(job.id)
                      ? (isDark ? "#4a5568" : "#9ca3af")
                      : "#3f51b5",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: appliedJobs.includes(job.id)
                      ? "not-allowed"
                      : "pointer",
                    transition: "all 0.2s ease",
                    opacity: appliedJobs.includes(job.id) ? 0.7 : 1,
                    boxShadow: appliedJobs.includes(job.id) 
                      ? "none" 
                      : "0 4px 12px rgba(63, 81, 181, 0.3)",
                  }}
                  onClick={() => handleApply(job)}
                  onMouseEnter={(e) => {
                    if (!appliedJobs.includes(job.id)) {
                      e.target.style.backgroundColor = "#303f9f";
                      e.target.style.transform = "scale(1.02)";
                      e.target.style.boxShadow = "0 6px 16px rgba(63, 81, 181, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!appliedJobs.includes(job.id)) {
                      e.target.style.backgroundColor = "#3f51b5";
                      e.target.style.transform = "scale(1)";
                      e.target.style.boxShadow = "0 4px 12px rgba(63, 81, 181, 0.3)";
                    }
                  }}
                >
                  {appliedJobs.includes(job.id) ? "✓ Application Submitted" : "Apply Now →"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Modal */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 1000,
            animation: "fadeIn 0.2s ease",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              background: isDark ? "#1e1e1e" : "white",
              color: isDark ? "#ffffff" : "#111827",
              padding: "40px",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "600px",
              boxShadow: isDark
                ? "0 20px 60px rgba(0, 0, 0, 0.6)"
                : "0 20px 60px rgba(0, 0, 0, 0.15)",
              display: "flex",
              flexDirection: "column",
              maxHeight: "90vh",
              overflowY: "auto",
              animation: "slideUp 0.3s ease",
            }}
          >
            <h2
              style={{
                marginBottom: "8px",
                fontSize: "2rem",
                fontWeight: "700",
                color: isDark ? "#90cdf4" : "#3f51b5",
                textAlign: "center",
              }}
            >
              Apply for {selectedJob?.title}
            </h2>
            <p style={{
              textAlign: "center",
              color: isDark ? "#a0aec0" : "#6b7280",
              marginBottom: "30px",
              fontSize: "0.95rem",
            }}>
              Fill in your details to submit your application
            </p>

            {[
              { label: "Full Name", name: "name", type: "text", required: true },
              { label: "Email", name: "email", type: "email", required: true },
              { label: "College", name: "college", type: "text", required: true },
            ].map((field) => (
              <div key={field.name} style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                  color: isDark ? "#e2e8f0" : "#374151",
                }}>
                  {field.label} {field.required && <span style={{ color: "#ef4444" }}>*</span>}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  onChange={handleChange}
                  required={field.required}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "1rem",
                    background: isDark ? "#4a5568" : "#ffffff",
                    color: isDark ? "#ffffff" : "#111827",
                    border: `2px solid ${isDark ? "#4a5568" : "#d1d5db"}`,
                    borderRadius: "8px",
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
            ))}

            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                fontSize: "0.95rem",
                color: isDark ? "#e2e8f0" : "#374151",
              }}>
                Upload Resume (PDF) <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="file"
                name="resume"
                accept="application/pdf"
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "0.95rem",
                  background: isDark ? "#4a5568" : "#f9fafb",
                  color: isDark ? "#ffffff" : "#111827",
                  border: `2px solid ${isDark ? "#4a5568" : "#d1d5db"}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              />
            </div>

            {[
              { label: "LinkedIn Profile", name: "linkedin", type: "text" },
              { label: "GitHub Profile", name: "github", type: "text" },
              { label: "Year of Graduation", name: "graduationYear", type: "text", required: true },
            ].map((field) => (
              <div key={field.name} style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                  color: isDark ? "#e2e8f0" : "#374151",
                }}>
                  {field.label} {field.required && <span style={{ color: "#ef4444" }}>*</span>}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  onChange={handleChange}
                  required={field.required}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "1rem",
                    background: isDark ? "#4a5568" : "#ffffff",
                    color: isDark ? "#ffffff" : "#111827",
                    border: `2px solid ${isDark ? "#4a5568" : "#d1d5db"}`,
                    borderRadius: "8px",
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
            ))}

            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                fontSize: "0.95rem",
                color: isDark ? "#e2e8f0" : "#374151",
              }}>
                Known Skills <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                name="skills"
                onChange={handleChange}
                required
                placeholder="e.g., React, Node.js, Python, Data Analysis..."
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "1rem",
                  minHeight: "100px",
                  background: isDark ? "#4a5568" : "#ffffff",
                  color: isDark ? "#ffffff" : "#111827",
                  border: `2px solid ${isDark ? "#4a5568" : "#d1d5db"}`,
                  borderRadius: "8px",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
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

            {[
              { label: "Domain", name: "domain", value: formData.domain },
              { label: "Duration", name: "duration", value: formData.duration },
            ].map((field) => (
              <div key={field.name} style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                  color: isDark ? "#e2e8f0" : "#374151",
                }}>
                  {field.label}
                </label>
                <input
                  value={field.value}
                  readOnly
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "1rem",
                    background: isDark ? "#2d3748" : "#f5f5f5",
                    color: isDark ? "#a0aec0" : "#6b7280",
                    border: `2px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
                    borderRadius: "8px",
                    cursor: "not-allowed",
                  }}
                />
              </div>
            ))}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                marginTop: "10px",
              }}
            >
              <button
                type="submit"
                style={{
                  padding: "14px 32px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  background: "#3f51b5",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#303f9f";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#3f51b5";
                  e.target.style.transform = "scale(1)";
                }}
              >
                Submit Application
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: "14px 32px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  background: isDark ? "#4a5568" : "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = isDark ? "#2d3748" : "#4b5563";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = isDark ? "#4a5568" : "#6b7280";
                  e.target.style.transform = "scale(1)";
                }}
              >
                Cancel
              </button>
            </div>
          </form>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from { 
                opacity: 0;
                transform: translateY(20px);
              }
              to { 
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}