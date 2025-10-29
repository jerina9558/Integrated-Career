import React, { useState, useEffect } from "react";

export default function EmployerSkills() {
  const [testTitle, setTestTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], answer: "" },
  ]);
  const [savedTests, setSavedTests] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentMedals, setStudentMedals] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
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

  useEffect(() => {
    loadAllData();

    const interval = setInterval(() => {
      loadAttempts();
      loadMedals();
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    await Promise.all([loadTests(), loadAttempts(), loadStudents(), loadMedals()]);
  };

  const loadTests = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/employer/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSavedTests(data || []);
    } catch (err) {
      console.error("Failed to fetch tests:", err.message);
    }
  };

  const loadAttempts = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/employer/attempts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAttempts(data || []);
    } catch (err) {
      console.error("Failed to fetch attempts:", err.message);
    }
  };

  const loadStudents = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStudents(data || []);
    } catch (err) {
      console.error("Failed to load students:", err.message);
    }
  };

  const loadMedals = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/employer/medals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStudentMedals(data || []);
    } catch (err) {
      console.error("Failed to load medals:", err.message);
    }
  };

  const getStudentName = (userRef) => {
    const student = students.find((s) => s.email === userRef || s.id === userRef);
    return student ? student.username : userRef;
  };

  const getStudentMedals = (userRef) => {
    const record = studentMedals.find(
      (m) => m.student_email === userRef || m.student_id === userRef
    );
    return record ? record.medals : 0;
  };

  const handleSaveTest = async () => {
    if (!testTitle.trim()) return alert("Please enter a test title.");

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (
        !q.question.trim() ||
        !q.answer.trim() ||
        q.options.some((o) => !o.trim())
      ) {
        return alert(`Please complete all fields for question ${i + 1}`);
      }
    }

    const newTest = {
      title: testTitle.trim(),
      description: "Employer provided test",
      questions: questions.map((q) => ({
        question: q.question.trim(),
        options: q.options.map((o) => o.trim()),
        answer: q.answer.trim(),
      })),
    };

    try {
      const res = await fetch(`${API_URL}/employer/skills`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTest)
      });
      const data = await res.json();

      setSavedTests([{ ...newTest, id: data.testId }, ...savedTests]);
      setTestTitle("");
      setQuestions([{ question: "", options: ["", "", "", ""], answer: "" }]);

      await loadTests();
      alert("Test saved successfully!");
    } catch (err) {
      console.error("Failed to save test:", err.message);
      alert("Failed to save test. Check console for details.");
    }
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;
    try {
      await fetch(`${API_URL}/employer/skills/${testId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedTests(savedTests.filter((t) => t.id !== testId));

      await loadTests();
      alert("Test deleted successfully.");
    } catch (err) {
      console.error("Failed to delete test:", err.message);
      alert("Failed to delete test. Check console for details.");
    }
  };

  const handleAddQuestion = () => {
    const lastQ = questions[questions.length - 1];
    if (
      !lastQ.question.trim() ||
      !lastQ.answer.trim() ||
      lastQ.options.some((o) => !o.trim())
    ) {
      return alert("Please complete the current question before adding a new one.");
    }
    setQuestions([...questions, { question: "", options: ["", "", "", ""], answer: "" }]);
  };

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
          🧑‍💼 Skill Test Manager
        </h2>
        <p style={{
          fontSize: "1.1rem",
          color: isDark ? "#a0aec0" : "#6b7280",
          maxWidth: "600px",
        }}>
          Create and manage skill assessments for evaluating student capabilities
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
            maxWidth: "800px",
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
              Test Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., JavaScript Fundamentals Test"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
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

          {questions.map((q, qIndex) => (
            <div 
              key={qIndex} 
              style={{
                padding: "24px",
                backgroundColor: isDark ? "#1a202c" : "#f9fafb",
                borderRadius: "12px",
                marginBottom: "20px",
                border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
              }}
            >
              <h4 style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                marginBottom: "16px",
                color: isDark ? "#90cdf4" : "#3f51b5",
              }}>
                Question {qIndex + 1}
              </h4>
              
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Question Text</label>
                <input
                  type="text"
                  placeholder={`Enter question ${qIndex + 1}`}
                  value={q.question}
                  onChange={(e) => {
                    const updated = [...questions];
                    updated[qIndex].question = e.target.value;
                    setQuestions(updated);
                  }}
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

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Options</label>
                {q.options.map((opt, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    placeholder={`Option ${optIndex + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[qIndex].options[optIndex] = e.target.value;
                      setQuestions(updated);
                    }}
                    style={{...inputStyle, marginBottom: "10px"}}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3f51b5";
                      e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                ))}
              </div>

              <div>
                <label style={labelStyle}>Correct Answer</label>
                <input
                  type="text"
                  placeholder="Enter the correct answer exactly as one of the options"
                  value={q.answer}
                  onChange={(e) => {
                    const updated = [...questions];
                    updated[qIndex].answer = e.target.value;
                    setQuestions(updated);
                  }}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#10b981";
                    e.target.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>
          ))}

          <button
            onClick={handleAddQuestion}
            style={{
              padding: "12px 24px",
              width: "100%",
              backgroundColor: isDark ? "#4a5568" : "#f3f4f6",
              color: isDark ? "#e2e8f0" : "#374151",
              border: `2px dashed ${isDark ? "#718096" : "#d1d5db"}`,
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "1rem",
              transition: "all 0.2s ease",
              marginBottom: "16px",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = isDark ? "#718096" : "#e5e7eb";
              e.target.style.borderColor = "#3f51b5";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = isDark ? "#4a5568" : "#f3f4f6";
              e.target.style.borderColor = isDark ? "#718096" : "#d1d5db";
            }}
          >
            ➕ Add Question
          </button>

          <button
            onClick={handleSaveTest}
            disabled={!testTitle.trim() || questions.length === 0}
            style={{
              padding: "14px 24px",
              width: "100%",
              backgroundColor: !testTitle.trim() || questions.length === 0 ? "#9ca3af" : "#3f51b5",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: !testTitle.trim() || questions.length === 0 ? "not-allowed" : "pointer",
              fontWeight: "600",
              fontSize: "1.05rem",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(63, 81, 181, 0.3)",
              opacity: !testTitle.trim() || questions.length === 0 ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (testTitle.trim() && questions.length > 0) {
                e.target.style.backgroundColor = "#303f9f";
                e.target.style.transform = "scale(1.02)";
                e.target.style.boxShadow = "0 6px 16px rgba(63, 81, 181, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (testTitle.trim() && questions.length > 0) {
                e.target.style.backgroundColor = "#3f51b5";
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 4px 12px rgba(63, 81, 181, 0.3)";
              }
            }}
          >
            💾 Save Test
          </button>
        </div>
      </div>

      {/* Saved Tests Section */}
      <div style={{ marginBottom: "60px" }}>
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
            🗂 Saved Tests
          </h3>
          <div style={{
            backgroundColor: isDark ? "#2d3748" : "#f9fafb",
            padding: "12px 24px",
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
              {savedTests.length} {savedTests.length === 1 ? 'Test' : 'Tests'}
            </span>
          </div>
        </div>

        {savedTests.length === 0 ? (
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
              📝
            </div>
            <p style={{
              fontSize: "1.3rem",
              fontWeight: "600",
              color: isDark ? "#e2e8f0" : "#374151",
              marginBottom: "8px",
            }}>
              No tests created yet
            </p>
            <p style={{
              fontSize: "1rem",
              color: isDark ? "#a0aec0" : "#6b7280",
            }}>
              Create your first skill test using the form above
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
            {savedTests.map((test) => (
              <div
                key={test.id}
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
                  {test.title}
                </h3>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "24px",
                }}>
                  <span style={{
                    backgroundColor: isDark ? "#4a5568" : "#ede9fe",
                    color: isDark ? "#c3dafe" : "#5b21b6",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}>
                    📋 {test.questions?.length || 0} Questions
                  </span>
                </div>

                <p style={{
                  fontSize: "1rem",
                  lineHeight: "1.7",
                  color: isDark ? "#cbd5e0" : "#4b5563",
                  marginBottom: "24px",
                  minHeight: "40px",
                }}>
                  {test.description}
                </p>

                <button
                  onClick={() => handleDeleteTest(test.id)}
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
                  🗑️ Delete Test
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

     
      {/* Gradient Background Overlay (for full-page glow) */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: isDark
            ? "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.15), transparent 70%), radial-gradient(circle at 80% 80%, rgba(139,92,246,0.1), transparent 70%)"
            : "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.08), transparent 70%), radial-gradient(circle at 80% 80%, rgba(139,92,246,0.06), transparent 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
