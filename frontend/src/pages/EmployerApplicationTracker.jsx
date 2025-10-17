import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EmployerApplicationTracker() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const theme = localStorage.getItem("theme") || "light";
  const darkMode = theme === "dark";

  // Fetch accepted student applications with submitted projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/tracker/employer/applications", {
          headers: { Authorization: `Bearer ${token}` },
        })
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

  // ✅ Submit evaluation for a student (fixed)
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


  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: darkMode ? "#121212" : "#f5f6fa",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "5px" }}>
        Student Submissions
      </h2>
      <p style={{ color: "#777", marginBottom: "20px" }}>
        View submitted projects and rate student performance
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "#888",
            fontSize: "1rem",
          }}
        >
          <div style={{ fontSize: "2rem" }}>⚠️</div>
          No submissions found
        </div>
      ) : (
        applications.map((app) => (
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
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
              {app.studentName} — {app.jobTitle}
            </h3>
            <p style={{ color: "#666", marginBottom: "10px" }}>
              Duration: {app.jobDuration || "N/A"}
            </p>

            {/* View uploaded project */}
          {app.project_file ? (
  <a
    href={`http://localhost:5000${app.project_file}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "inline-block",
      padding: "8px 16px",
      backgroundColor: "#3b82f6",
      color: "#fff",
      borderRadius: "6px",
      textDecoration: "none",
      marginBottom: "10px",
    }}
  >
    📁 View Project
  </a>
) : (
  <p style={{ color: "#999" }}>No project uploaded yet</p>
)}


            {/* Rating fields */}
            <div style={{ marginTop: "10px" }}>
              {["Communication", "Technical", "Teamwork", "Creativity", "Punctuality"].map(
                (field) => (
                  <div
                    key={field}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <label style={{ fontWeight: "500", width: "150px" }}>{field}</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={ratings[app.id]?.[field.toLowerCase()] || ""}
                      onChange={(e) => handleRatingChange(app.id, field.toLowerCase(), e.target.value)}
                      style={{
                        padding: "6px 10px",
                        width: "100px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>
                )
              )}
            </div>

            <div style={{ textAlign: "right", marginTop: "15px" }}>
              <button
                onClick={() => handleSubmit(app.id)}
                disabled={submitting}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#16a34a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                {submitting ? "Submitting..." : "Submit Evaluation"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
