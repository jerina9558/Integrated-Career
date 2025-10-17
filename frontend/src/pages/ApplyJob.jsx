// src/pages/ApplyJob.jsx
import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function ApplyJob({ jobId, token, onNewApplication }) {
  const theme = localStorage.getItem("theme") || "light";
  const darkMode = theme === "dark";

  const [formData, setFormData] = useState({
    name: "",
    college: "",
    email: "",
    linkedin: "",
    github: "",
    graduation_year: "",
    skills: "",
    domain: "",
    duration: "",
    resume: null,
  });

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        setMessage("❌ Resume must be less than 5MB");
        return;
      }
      setFormData({ ...formData, [name]: file });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.resume) {
      setMessage("❌ Please upload your resume");
      return;
    }

    const data = new FormData();
    for (let key in formData) data.append(key, formData[key]);
    data.append("job_id", jobId);

    setSubmitting(true);
    setMessage("");

    try {
      const res = await axios.post(`${API}/apply`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(res.data.message || "✅ Application submitted successfully!");

      // Create new application object for tracker
      const newApplication = {
        id: Date.now(), // temporary ID for local usage
        jobId,
        jobTitle: `Internship - ${formData.domain || "N/A"}`,
        employerName: formData.name,
        jobDuration: formData.duration || "1 month",
        applied_at: new Date().toISOString(),
      };

      // Save in localStorage
      const existing = JSON.parse(localStorage.getItem("studentApplications") || "[]");
      localStorage.setItem("studentApplications", JSON.stringify([...existing, newApplication]));

      // Notify parent component to update tracker immediately
      if (onNewApplication) onNewApplication(newApplication);

      // Reset form
      setFormData({
        name: "",
        college: "",
        email: "",
        linkedin: "",
        github: "",
        graduation_year: "",
        skills: "",
        domain: "",
        duration: "",
        resume: null,
      });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "❌ Failed to apply");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "20px",
        backgroundColor: darkMode ? "#1E1E1E" : "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        color: darkMode ? "#fff" : "#111",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Apply for Job</h2>

      {message && (
        <div
          style={{
            padding: "10px 15px",
            marginBottom: "15px",
            borderRadius: "6px",
            backgroundColor: message.startsWith("✅") ? "#d1fae5" : "#fee2e2",
            color: message.startsWith("✅") ? "#065f46" : "#b91c1c",
          }}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="college"
          placeholder="College"
          value={formData.college}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="linkedin"
          placeholder="LinkedIn URL (optional)"
          value={formData.linkedin}
          onChange={handleChange}
        />
        <input
          type="text"
          name="github"
          placeholder="GitHub URL (optional)"
          value={formData.github}
          onChange={handleChange}
        />
        <input
          type="text"
          name="graduation_year"
          placeholder="Graduation Year"
          value={formData.graduation_year}
          onChange={handleChange}
          required
        />
        <textarea
          name="skills"
          placeholder="Skills (comma separated)"
          value={formData.skills}
          onChange={handleChange}
          required
        ></textarea>
        <input
          type="text"
          name="domain"
          placeholder="Domain (optional)"
          value={formData.domain}
          onChange={handleChange}
        />
        <input
          type="text"
          name="duration"
          placeholder="Duration (e.g., 1 month)"
          value={formData.duration}
          onChange={handleChange}
        />
        <input
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "10px",
            backgroundColor: "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: submitting ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
