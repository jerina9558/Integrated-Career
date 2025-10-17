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

  const token = localStorage.getItem("token");
  const theme = localStorage.getItem("theme") || "light";
  const darkMode = theme === "dark";

  // 🔹 Fetch applications (with evaluations)
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/tracker/student/applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data || [];

        // Format evaluations for chart display
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
  }, [token]);

  // 🔹 Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Compute start and end dates based on duration
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
      startDate.setDate(startDate.getDate() + 1);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (num - 1));
    } else if (durStr.includes("month")) {
      startDate.setDate(startDate.getDate() + 1);
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + num);
      endDate.setDate(endDate.getDate() - 1);
    } else {
      startDate.setDate(startDate.getDate() + 1);
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(endDate.getDate() - 1);
    }

    return { ...app, startDate, endDate };
  };

  // 🔹 Categorize internships based on current date
  const withDates = applications.map(computeDates);
  const ongoing = withDates.filter((a) => now >= a.startDate && now <= a.endDate);
  const upcoming = withDates.filter((a) => a.startDate > now);
  const completed = withDates.filter((a) => a.endDate < now);

  let list = [];
  if (filter === "Ongoing") list = ongoing;
  if (filter === "Upcoming") list = upcoming;
  if (filter === "Completed") list = completed;

  // 🔹 Handle project upload
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

  // 🔹 Statistic card
  const statCard = (label, count, color, icon) => (
    <div
      style={{
        flex: 1,
        backgroundColor: darkMode ? "#1E1E1E" : "#fff",
        borderRadius: "10px",
        padding: "1.2rem",
        boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
        borderLeft: `4px solid ${color}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        minWidth: "180px",
      }}
    >
      <h4 style={{ fontSize: "0.95rem", color: "#555", marginBottom: "0.4rem" }}>{label}</h4>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", color: color }}>{count}</h2>
        <div style={{ backgroundColor: `${color}20`, padding: "6px", borderRadius: "8px" }}>{icon}</div>
      </div>
    </div>
  );

  // 🔹 Compute grade text based on average score
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
        padding: "40px",
        backgroundColor: darkMode ? "#121212" : "#f5f6fa",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "5px" }}>My Internships</h2>
      <p style={{ color: "#777", marginBottom: "20px" }}>Track and manage your internship applications</p>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "30px" }}>
        {statCard("Ongoing", ongoing.length, "#22c55e", "📈")}
        {statCard("Upcoming", upcoming.length, "#3b82f6", "⏰")}
        {statCard("Completed", completed.length, "#64748b", "✅")}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: darkMode ? "#1E1E1E" : "#fff",
          padding: "10px 20px",
          borderRadius: "10px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
          marginBottom: "20px",
        }}
      >
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            border: "1px solid #ccc",
            borderRadius: "6px",
            background: darkMode ? "#222" : "#fff",
            color: darkMode ? "#fff" : "#000",
            fontWeight: "500",
          }}
        >
          <option value="Ongoing">Ongoing</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#888", fontSize: "1rem" }}>
          <div style={{ fontSize: "2rem" }}>⚠️</div>
          No {filter.toLowerCase()} internships found
        </div>
      ) : (
        list.map((app) => (
          <div
            key={app.id}
            style={{
              backgroundColor: darkMode ? "#1E1E1E" : "#fff",
              borderRadius: "12px",
              padding: "1.5rem",
              marginBottom: "20px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "10px" }}>{app.jobTitle}</h3>
            <p style={{ color: "#666", marginBottom: "10px" }}>Duration: {app.jobDuration || "N/A"}</p>
            <p><strong>Employer:</strong> {app.employerName || "—"}</p>
            <p><strong>Start:</strong> {app.startDate.toLocaleDateString()}</p>
            <p><strong>End:</strong> {app.endDate.toLocaleDateString()}</p>

            <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
              {/* Upload Project (only ongoing) */}
              {filter === "Ongoing" && (
                <label
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#e5e7eb",
                    color: "#111",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  {uploading ? "Uploading..." : "Upload Project"}
                  <input
                    type="file"
                    name="projectZip"
                    accept=".zip"
                    style={{ display: "none" }}
                    onChange={(e) => handleUpload(e, app.id)}
                  />
                </label>
              )}

              {/* View Result (only if evaluation exists) */}
              {app.resultData && app.resultData.length > 0 && (
                <button
                  onClick={() => setSelectedResult(app)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#16a34a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  View Result
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {/* Result Modal with Line Chart */}
      {selectedResult && selectedResult.resultData && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
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
              width: "550px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "25px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
            }}
          >
            <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px" }}>
              {selectedResult.jobTitle} - Result Overview
            </h3>

            <div style={{ width: "100%", height: 250 }}>
              <ResponsiveContainer>
                <LineChart
                  data={selectedResult.resultData}
                  margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#16a34a" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Compute average and grade */}
            {(() => {
              const avg =
                selectedResult.resultData.reduce((sum, d) => sum + d.score, 0) /
                selectedResult.resultData.length;
              const grade = getGrade(avg);
              return (
                <p
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: grade.color,
                    marginTop: "10px",
                    fontSize: "1.1rem",
                  }}
                >
                  {grade.text} (Avg: {avg.toFixed(1)}%)
                </p>
              );
            })()}

            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button
                onClick={() => setSelectedResult(null)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
