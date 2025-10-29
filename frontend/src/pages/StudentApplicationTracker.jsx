import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StudentApplicationTracker() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Ongoing");
  const [now, setNow] = useState(new Date());
  const [selectedResult, setSelectedResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const token = localStorage.getItem("token");
  const isDark = theme === "dark";

  // Load manually completed internships from localStorage
  const [completedIds, setCompletedIds] = useState(
    JSON.parse(localStorage.getItem("completedIds") || "[]")
  );

  useEffect(() => {
    const updateTheme = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };
    window.addEventListener("themeChange", updateTheme);
    return () => window.removeEventListener("themeChange", updateTheme);
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/tracker/student/applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data || [];

        const formatted = data.map((app) => {
          if (
            app.communication != null &&
            app.technical != null &&
            app.teamwork != null &&
            app.creativity != null &&
            app.punctuality != null
          ) {
            app.resultData = [
              { category: "Communication", score: app.communication },
              { category: "Technical", score: app.technical },
              { category: "Teamwork", score: app.teamwork },
              { category: "Creativity", score: app.creativity },
              { category: "Punctuality", score: app.punctuality },
            ];
          }
          // Set isManuallyCompleted from localStorage
          app.isManuallyCompleted = completedIds.includes(app.id);
          return app;
        });

        setApplications(formatted);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || "❌ Failed to fetch applications.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [token, completedIds]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const computeDates = (app) => {
    const applied = new Date(app.applied_at);
    const durStr = (app.jobDuration || "").toLowerCase();
    const numMatch = durStr.match(/\d+/);
    const num = numMatch ? parseInt(numMatch[0], 10) : 1;

    let startDate = new Date(applied);
    let endDate = new Date(applied);

    if (durStr.includes("hour")) {
      endDate.setHours(endDate.getHours() + num);
    } else if (durStr.includes("day")) {
      endDate.setDate(endDate.getDate() + (num - 1));
    } else if (durStr.includes("month")) {
      endDate.setMonth(endDate.getMonth() + num);
      endDate.setDate(endDate.getDate() - 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(endDate.getDate() - 1);
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return { ...app, startDate, endDate };
  };

  const withDates = applications.map(computeDates);

  const ongoing = withDates.filter(
    (a) => now >= a.startDate && now <= a.endDate && !a.isManuallyCompleted
  );
  const completed = withDates.filter(
    (a) => a.endDate < now || a.isManuallyCompleted
  );

  let list = [];
  if (filter === "Ongoing") list = ongoing;
  if (filter === "Completed") list = completed;

  const handleUpload = async (e, appId) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".zip")) {
      alert("Only .zip files are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("projectZip", file);

    setUploading(true);
    try {
      await axios.post(`http://localhost:5000/tracker/student/upload/${appId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ File uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  const handleMarkAsCompleted = (appId) => {
    const newCompleted = [...completedIds, appId];
    setCompletedIds(newCompleted);
    localStorage.setItem("completedIds", JSON.stringify(newCompleted));

    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId ? { ...a, isManuallyCompleted: true } : a
      )
    );
    setSelectedResult(null);
    alert("✅ Internship marked as completed!");
  };

  const statCard = (label, count, color, icon) => (
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
    >
      <h4
        style={{
          fontSize: "0.875rem",
          color: isDark ? "#a0aec0" : "#6b7280",
          marginBottom: "8px",
          fontWeight: "500",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </h4>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <h2
          style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: color,
          }}
        >
          {count}
        </h2>
        <div
          style={{
            backgroundColor: `${color}20`,
            padding: "10px",
            borderRadius: "10px",
            fontSize: "1.5rem",
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );

  const getGrade = (avg) => {
    if (avg >= 85) return { text: "Excellent 🌟", color: "#16a34a" };
    if (avg >= 70) return { text: "Good 👍", color: "#3b82f6" };
    if (avg >= 50) return { text: "Needs Improvement ⚙️", color: "#f59e0b" };
    return { text: "Poor 😞", color: "#ef4444" };
  };

  if (loading) return <p>Loading applications...</p>;

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        marginLeft: "50px",
        padding: "60px 180px",
        backgroundColor: isDark ? "#1a202c" : "#ffffff",
        color: isDark ? "#ffffff" : "#111827",
        minHeight: "100vh",
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          background: isDark
            ? "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)"
            : "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
          padding: "10px 200px",
          borderRadius: "16px",
          marginBottom: "48px",
          border: `1px solid ${isDark ? "#4a5568" : "#c7d2fe"}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <h2
          style={{
            fontSize: "2.5rem",
            fontWeight: "750",
            marginBottom: "10px",
            background: isDark
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "linear-gradient(135deg, #3f51b5 0%, #5a67d8 100%)",
           
              WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
             whiteSpace: "nowrap", 
          }}
        >
          My Internships
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            color: isDark ? "#a0aec0" : "#6b7280",
            maxWidth: "600px",
          }}
        >
          Track and manage your internship applications
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "40px" }}>
        {statCard("Ongoing", ongoing.length, "#22c55e", "📈")}
        {statCard("Completed", completed.length, "#64748b", "✅")}
      </div>

      {/* Filter */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: isDark ? "#2d3748" : "#ffffff",
          padding: "20px 24px",
          borderRadius: "12px",
          border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
          marginBottom: "32px",
        }}
      >
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "12px 20px",
            border: `2px solid ${isDark ? "#4a5568" : "#d1d5db"}`,
            borderRadius: "8px",
            backgroundColor: isDark ? "#1a202c" : "#ffffff",
            color: isDark ? "#ffffff" : "#111827",
            fontWeight: "600",
          }}
        >
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Applications */}
      {list.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            backgroundColor: isDark ? "#2d3748" : "#f9fafb",
            borderRadius: "16px",
            border: `2px dashed ${isDark ? "#4a5568" : "#d1d5db"}`,
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "16px", opacity: 0.5 }}>⚠️</div>
          <p
            style={{
              fontSize: "1.3rem",
              fontWeight: "600",
              color: isDark ? "#e2e8f0" : "#374151",
            }}
          >
            No {filter.toLowerCase()} internships found
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
          {list.map((app) => (
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
              }}
            >
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  marginBottom: "16px",
                  color: isDark ? "#90cdf4" : "#3f51b5",
                }}
              >
                {app.jobTitle}
              </h3>

              <div
                style={{
                  backgroundColor: isDark ? "#4a5568" : "#f3f4f6",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  fontSize: "0.95rem",
                  color: isDark ? "#e2e8f0" : "#4b5563",
                }}
              >
                ⏱️ Duration: {app.jobDuration || "N/A"}
              </div>

              <div style={{ marginBottom: "12px", fontSize: "1rem", lineHeight: "1.8" }}>
                <p>
                  <strong>Employer:</strong> {app.employerName || "—"}
                </p>
                <p>
                  <strong>Start:</strong> {app.startDate.toLocaleDateString()}
                </p>
                <p>
                  <strong>End:</strong> {app.endDate.toLocaleDateString()}
                </p>
              </div>

              <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {filter === "Ongoing" && (
                  <label
                    style={{
                      padding: "12px 20px",
                      backgroundColor: isDark ? "#4a5568" : "#e5e7eb",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    {uploading ? "Uploading..." : "📤 Upload Project"}
                    <input
                      type="file"
                      name="projectZip"
                      accept=".zip"
                      style={{ display: "none" }}
                      onChange={(e) => handleUpload(e, app.id)}
                    />
                  </label>
                )}

                {app.resultData && (
                  <button
                    onClick={() => setSelectedResult(app)}
                    style={{
                      padding: "12px 20px",
                      backgroundColor: "#16a34a",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    📊 View Result
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Result Modal */}
      {selectedResult && selectedResult.resultData && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedResult(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "90%",
              maxWidth: "600px",
              backgroundColor: isDark ? "#2d3748" : "#ffffff",
              color: isDark ? "#ffffff" : "#111827",
              borderRadius: "16px",
              padding: "32px",
            }}
          >
            <h3
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                marginBottom: "24px",
                color: isDark ? "#90cdf4" : "#3f51b5",
              }}
            >
              {selectedResult.jobTitle} - Result Overview
            </h3>

            <div style={{ width: "100%", height: 280, marginBottom: "20px" }}>
              <ResponsiveContainer>
                <LineChart data={selectedResult.resultData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#16a34a" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {(() => {
              const avg =
                selectedResult.resultData.reduce((sum, d) => sum + d.score, 0) /
                selectedResult.resultData.length;
              const grade = getGrade(avg);
              return (
                <p
                  style={{
                    textAlign: "center",
                    fontWeight: "700",
                    color: grade.color,
                    marginTop: "10px",
                    fontSize: "1.3rem",
                    padding: "16px",
                    backgroundColor: `${grade.color}15`,
                    borderRadius: "8px",
                  }}
                >
                  {grade.text} (Avg: {avg.toFixed(1)}%)
                </p>
              );
            })()}

            <div style={{ textAlign: "right", marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={() => setSelectedResult(null)}
                style={{
                  backgroundColor: "#e11d48",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 18px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                ✖ Close
              </button>

              {/* Show "Mark as Completed" only if not completed */}
              {!selectedResult.isManuallyCompleted && filter === "Ongoing" && (
                <button
                  onClick={() => handleMarkAsCompleted(selectedResult.id)}
                  style={{
                    backgroundColor: "#16a34a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 18px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  ✅ Mark as Completed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
