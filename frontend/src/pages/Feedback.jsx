import React, { createContext, useContext, useState, useEffect } from "react";

// ---------- Feedback Context ----------
const FeedbackContext = createContext();

const FeedbackProvider = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState(() => {
    // Initialize from localStorage
    return JSON.parse(localStorage.getItem("feedbacks")) || [];
  });

  // Fetch feedbacks from backend
  const fetchFeedbacks = async (role) => {
    try {
      const res = await fetch(`http://localhost:5000/feedbacks/${role}`);
      const data = await res.json();
      setFeedbacks(data);

      // Sync with localStorage
      localStorage.setItem("feedbacks", JSON.stringify(data));
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };

  // Add feedback locally and update localStorage
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

  // Appearance Preferences
  const getPreferences = () => ({
    theme: localStorage.getItem("theme") || "light",
    fontSize: localStorage.getItem("fontSize") || "medium",
    fontStyle: localStorage.getItem("fontStyle") || "Arial",
  });

  const themeStyles = {
    light: {
      backgroundColor: "#ffffff",
      textColor: "#111827",
      cardBackground: "#f9f9f9",
      borderColor: "#ddd",
      inputBackground: "#ffffff",
    },
    dark: {
      backgroundColor: "#1f2937",
      textColor: "#ffffff",
      cardBackground: "#2c3e50",
      borderColor: "#444",
      inputBackground: "#374151",
    },
  };

  const [preferences, setPreferences] = useState(getPreferences());

  useEffect(() => {
    const updatePreferences = () => setPreferences(getPreferences());
    window.addEventListener("themeChange", updatePreferences);
    window.addEventListener("fontStyleChange", updatePreferences);
    window.addEventListener("fontSizeChange", updatePreferences);
    return () => {
      window.removeEventListener("themeChange", updatePreferences);
      window.removeEventListener("fontStyleChange", updatePreferences);
      window.removeEventListener("fontSizeChange", updatePreferences);
    };
  }, []);

  const { theme } = preferences;
  const ts = themeStyles[theme];

  // ---------- Handle Form Input ----------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // ---------- Submit Feedback ----------
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
      id: Date.now(), // unique id for localStorage
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
        addFeedback(newFeedback); // Save locally

        setForm({
          name: "",
          type: "Portal Experience",
          rating: 0,
          message: "",
          anonymous: false,
        });

        fetchFeedbacks(role); // reload feedbacks from backend
      } else {
        alert("Failed to submit feedback.");
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Server error while submitting feedback.");
      addFeedback(newFeedback); // Save locally even if backend fails
    }
  };

  // ---------- Fetch feedbacks on load ----------
  useEffect(() => {
    fetchFeedbacks(role);
  }, [role]);

  // ---------- Display Logic ----------
  const displayFeedbacks =
    role === "admin" ? feedbacks : feedbacks.filter((f) => f.userId === userId);

  const averageRating =
    displayFeedbacks.length > 0
      ? (
          displayFeedbacks.reduce((sum, f) => sum + parseInt(f.rating), 0) /
          displayFeedbacks.length
        ).toFixed(1)
      : 0;

  // ---------- Styles ----------
  const styles = {
    main: { padding: "1rem", paddingLeft: "45px", fontFamily: preferences.fontStyle },
    heading: { textAlign: "center", marginBottom: "25px", color: ts.textColor },
    label: { display: "block", fontWeight: "bold", marginTop: "15px", color: ts.textColor },
    input: {
      width: "100%",
      padding: "10px",
      marginTop: "5px",
      borderRadius: "8px",
      border: `1px solid ${ts.borderColor}`,
      backgroundColor: ts.inputBackground,
      color: ts.textColor,
      fontSize: "14px",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      marginTop: "5px",
      borderRadius: "8px",
      border: `1px solid ${ts.borderColor}`,
      backgroundColor: ts.inputBackground,
      color: ts.textColor,
      fontSize: "14px",
      resize: "vertical",
      height: "80px",
    },
    stars: {
      display: "flex",
      flexDirection: "row-reverse",
      justifyContent: "flex-end",
      marginTop: "5px",
    },
    starLabel: {
      fontSize: "25px",
      color: "#ccc",
      cursor: "pointer",
      transition: "color 0.2s",
    },
    anon: { marginTop: "10px", display: "flex", alignItems: "center", gap: "5px", color: ts.textColor },
    button: {
      marginTop: "20px",
      width: "100%",
      padding: "12px",
      background: "#3f51b5",
      color: "white",
      fontSize: "15px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "0.3s",
    },
    hr: { margin: "25px 0", border: 0, height: "1px", background: ts.borderColor },
    stats: { display: "flex", justifyContent: "space-between", marginBottom: "15px", fontWeight: "bold", color: ts.textColor },
    feedbackList: { overflow: "visible" },
    feedbackItem: {
      border: `1px solid ${ts.borderColor}`,
      borderRadius: "10px",
      padding: "12px",
      marginBottom: "12px",
      background: ts.cardBackground,
      color: ts.textColor,
    },
    ratingDisplay: { color: "#fbc02d" },
    noFeedback: { textAlign: "center", color: "#888", fontStyle: "italic" },
  };

  return (
    <div style={styles.main}>
      <h2 style={styles.heading}>Feedback & Suggestions</h2>

      {role !== "admin" && (
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Your Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            style={styles.input}
          />

          <label style={styles.label}>Feedback Type:</label>
          <select name="type" value={form.type} onChange={handleChange} style={styles.input}>
            <option>Portal Experience</option>
            <option>Company Feedback</option>
            <option>Suggestion</option>
            <option>Complaint</option>
          </select>

          <label style={styles.label}>Rating:</label>
          <div style={styles.stars}>
            {[5, 4, 3, 2, 1].map((num) => (
              <label
                key={num}
                style={{
                  ...styles.starLabel,
                  color: form.rating >= num ? "#fbc02d" : "#ccc",
                }}
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

          <label style={styles.label}>Your Message:</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Write your feedback here..."
            style={styles.textarea}
          />

          <div style={styles.anon}>
            <input
              type="checkbox"
              name="anonymous"
              checked={form.anonymous}
              onChange={handleChange}
            />
            <label>Submit anonymously</label>
          </div>

          <button type="submit" style={styles.button}>
            Submit Feedback
          </button>
        </form>
      )}

      <hr style={styles.hr} />

      <div style={styles.stats}>
        <p>Total Feedback: {displayFeedbacks.length}</p>
        <p>Average Rating: {averageRating}</p>
      </div>

      {displayFeedbacks.length === 0 ? (
        <p style={styles.noFeedback}>No feedback yet.</p>
      ) : (
        <div style={styles.feedbackList}>
          {displayFeedbacks.map((f) => (
            <div key={f.id} style={styles.feedbackItem}>
              <p>
                <strong>{f.name}</strong> ({f.role}) -{" "}
                <span style={styles.ratingDisplay}>
                  {"★".repeat(f.rating) + "☆".repeat(5 - f.rating)}
                </span>
              </p>
              <p><em>{f.type}</em></p>
              <p>{f.message}</p>
            </div>
          ))}
        </div>
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
