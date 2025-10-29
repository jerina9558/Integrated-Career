import React, { useState, useEffect } from "react";
import quizData from "./QuizData";
import confetti from "canvas-confetti";
import axios from "axios";

const StudentSkills = ({ userEmail }) => {
  const [testType, setTestType] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [scheduledTests, setScheduledTests] = useState([]);
  const [currentEmployerTest, setCurrentEmployerTest] = useState(null);
  const [medals, setMedals] = useState(0);
  const [completedDomainTests, setCompletedDomainTests] = useState({});

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const isDark = theme === "dark";

  useEffect(() => {
    const updateTheme = () => setTheme(localStorage.getItem("theme") || "light");
    window.addEventListener("themeChange", updateTheme);
    return () => window.removeEventListener("themeChange", updateTheme);
  }, []);

  useEffect(() => {
    fetchEmployerTests();
    fetchMedals();
    loadCompletedDomainTests();
    resetTest();
  }, [userEmail]);

  const fetchEmployerTests = async () => {
    try {
      const res = await axios.get(`${API_URL}/employer/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setScheduledTests(res.data || []);
      localStorage.setItem("employeeTests", JSON.stringify(res.data || []));
    } catch (err) {
      console.error("❌ Failed to fetch employer tests:", err.response?.data || err.message);
      const storedTests = JSON.parse(localStorage.getItem("employeeTests")) || [];
      setScheduledTests(storedTests);
    }
  };

  const fetchMedals = async () => {
    try {
      const res = await axios.get(`${API_URL}/student/medals/${userEmail}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedals(res.data.medals || 0);
      const storedMedals = JSON.parse(localStorage.getItem("userMedals")) || {};
      storedMedals[userEmail] = res.data.medals || 0;
      localStorage.setItem("userMedals", JSON.stringify(storedMedals));
    } catch (err) {
      console.error("❌ Failed to fetch medals:", err.response?.data || err.message);
      const storedMedals = JSON.parse(localStorage.getItem("userMedals")) || {};
      setMedals(storedMedals[userEmail] || 0);
    }
  };

  const loadCompletedDomainTests = () => {
    const saved = JSON.parse(localStorage.getItem("completedDomainTests") || "{}");
    setCompletedDomainTests(saved);
  };

  const saveCompletedDomainTest = (domain, level) => {
    const key = `${domain}|${level}`;
    const updated = { ...completedDomainTests, [key]: true };
    setCompletedDomainTests(updated);
    localStorage.setItem("completedDomainTests", JSON.stringify(updated));
  };

  const resetTest = () => {
    setSelectedDomain(null);
    setSelectedLevel(null);
    setTestType(null);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
    setCurrentEmployerTest(null);
  };

  const calculateMedals = async (correct, total, testId = null, testTitle = null) => {
    let earned = 0;
    if (correct === total) earned = 3;
    else if (correct >= total / 2) earned = 2;
    else if (correct > 0) earned = 1;

    const updatedMedals = medals + earned;
    setMedals(updatedMedals);

    const storedMedals = JSON.parse(localStorage.getItem("userMedals")) || {};
    storedMedals[userEmail] = updatedMedals;
    localStorage.setItem("userMedals", JSON.stringify(storedMedals));

    if (correct === total && total > 0) {
      const duration = 2 * 1000;
      const end = Date.now() + duration;
      (function frame() {
        confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }

    try {
      await axios.post(`${API_URL}/student/medals`, { studentEmail: userEmail, medals: updatedMedals }, { headers: { Authorization: `Bearer ${token}` } });
      if (testId) {
        await axios.post(`${API_URL}/student/attempts`, { student_email: userEmail, test_id: testId, score: correct, testTitle }, { headers: { Authorization: `Bearer ${token}` } });
      }
    } catch (err) {
      console.error("DB save error:", err.response?.data || err.message);
    }
    return earned;
  };

  const submitDomainTest = async () => {
    const questions = quizData[selectedDomain][selectedLevel] || [];
    let correctCount = 0;
    questions.forEach((q, idx) => { if (userAnswers[idx] === q.answer) correctCount++; });
    setScore(correctCount);
    setShowResults(true);
    const earned = await calculateMedals(correctCount, questions.length);
    if (correctCount === questions.length && questions.length > 0) saveCompletedDomainTest(selectedDomain, selectedLevel);
    alert(`🎯 You completed the quiz and earned ${earned} medal(s)!`);
  };

  const submitEmployerTest = async () => {
    if (!currentEmployerTest) return;
    const questions = currentEmployerTest.questions || [];
    let correctCount = 0;
    questions.forEach((q, idx) => { if (userAnswers[idx] === q.answer) correctCount++; });
    setScore(correctCount);
    setShowResults(true);
    const earned = await calculateMedals(correctCount, questions.length, currentEmployerTest.id, currentEmployerTest.title);
    if (correctCount === questions.length) {
      const completedTests = JSON.parse(localStorage.getItem("completedEmployerTests") || "{}");
      completedTests[currentEmployerTest.id] = true;
      localStorage.setItem("completedEmployerTests", JSON.stringify(completedTests));
    }
    alert(`🎯 You completed "${currentEmployerTest.title}" and earned ${earned} medal(s)!`);
  };

  const FloatingShapes = () => (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: `${100 + i * 50}px`,
          height: `${100 + i * 50}px`,
          borderRadius: "50%",
          background: isDark 
            ? `radial-gradient(circle, rgba(99, 102, 241, ${0.03 + i * 0.01}) 0%, transparent 70%)`
            : `radial-gradient(circle, rgba(139, 92, 246, ${0.04 + i * 0.01}) 0%, transparent 70%)`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `float ${15 + i * 2}s ease-in-out infinite`,
          animationDelay: `${i * 0.5}s`,
        }} />
      ))}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
      `}</style>
    </div>
  );

  return (
    <div style={{
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      marginLeft: "50px",
      padding: "40px 60px",
      backgroundColor: isDark ? "#0f172a" : "#f8fafc",
      color: isDark ? "#ffffff" : "#111827",
      minHeight: "100vh",
      position: "relative",
    }}>
      <FloatingShapes />
      
      <div style={{
        position: "fixed", top: 20, right: 20, zIndex: 1000,
        background: isDark 
          ? "linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)"
          : "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
        padding: "16px 28px", borderRadius: "16px",
        boxShadow: isDark ? "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(251, 191, 36, 0.1)" : "0 10px 40px rgba(251, 191, 36, 0.3)",
        border: `2px solid ${isDark ? "#fbbf24" : "#f59e0b"}`,
      }}>
        <span style={{ fontSize: "2rem", fontWeight: "bold", color: isDark ? "#fbbf24" : "#92400e" }}>
          🏅 {medals}
        </span>
      </div>

      {!testType && (
        <>
          <div style={{
            background: isDark 
             
          ? "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)"
          : "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
            padding: "10px 10px",
            borderRadius: "20px",
            marginBottom: "40px",
        border: `1px solid ${isDark ? "#4a5568" : "#001d90ff"}`,
            position: "relative",
            overflow: "hidden",
            boxShadow: isDark ? "0 25px 60px rgba(0, 0, 0, 0.4)" : "0 20px 50px rgba(99, 102, 241, 0.15)",
          }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                position: "absolute",
                width: `${150 + i * 100}px`,
                height: `${150 + i * 100}px`,
                borderRadius: "50%",
                background: isDark 
                  ? `radial-gradient(circle, rgba(99, 102, 241, ${0.08 - i * 0.01}) 0%, transparent 70%)`
                  : `radial-gradient(circle, rgba(139, 92, 246, ${0.1 - i * 0.015}) 0%, transparent 70%)`,
                top: `${-50 + i * 10}%`,
                right: `${-50 + i * 15}%`,
              }} />
            ))}
            
            <div style={{ position: "relative", zIndex: 1 }}>
             
              <h2 style={{
                fontSize: "2.5rem", fontWeight: "700", marginBottom: "20px", lineHeight: "1.1",
                background: isDark 
                  ? "linear-gradient(135deg, #818cf8 0%, #c084fc 100%)"
                  : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
              Choose Your Path
              </h2>
              <p style={{
                fontSize: "1.25rem", color: isDark ? "#cbd5e0" : "#64748b",
                maxWidth: "600px", lineHeight: "1.5",
              }}>
                Embark on your learning journey. Test your skills, earn medals, and showcase your expertise through comprehensive assessments.
              </p>
              <div style={{
                display: "flex", gap: "24px", marginTop: "40px", flexWrap: "wrap",
              }}>
                <div style={{
                  padding: "16px 32px", borderRadius: "12px",
                  background: isDark ? "rgba(99, 102, 241, 0.1)" : "rgba(99, 102, 241, 0.08)",
                  border: `1px solid ${isDark ? "#4f46e5" : "#818cf8"}`,
                  color: isDark ? "#a5b4fc" : "#4f46e5",
                  fontWeight: "600",
                }}>
                  📚 Multiple Domains
                </div>
                <div style={{
                  padding: "16px 32px", borderRadius: "12px",
                  background: isDark ? "rgba(168, 85, 247, 0.1)" : "rgba(168, 85, 247, 0.08)",
                  border: `1px solid ${isDark ? "#7c3aed" : "#a78bfa"}`,
                  color: isDark ? "#c4b5fd" : "#7c3aed",
                  fontWeight: "600",
                }}>
                  🏆 Earn Rewards
                </div>
                <div style={{
                  padding: "16px 32px", borderRadius: "12px",
                  background: isDark ? "rgba(236, 72, 153, 0.1)" : "rgba(236, 72, 153, 0.08)",
                  border: `1px solid ${isDark ? "#db2777" : "#f472b6"}`,
                  color: isDark ? "#f9a8d4" : "#db2777",
                  fontWeight: "600",
                }}>
                  ⚡ Instant Results
                </div>
              </div>
            </div>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "40px", maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1,
          }}>
            {[
              { icon: "💻", title: "Domain Based Test", desc: "Challenge yourself across Web Development, Data Science, UI/UX Design, and Digital Marketing", color: isDark ? "#6366f1" : "#4f46e5", gradient: "135deg, #6366f1 0%, #8b5cf6 100%" },
              { icon: "📝", title: "Employer Provided Tests", desc: "Complete assessments assigned by your employer and demonstrate your capabilities", color: isDark ? "#ec4899" : "#db2777", gradient: "135deg, #ec4899 0%, #f43f5e 100%" }
            ].map((item, idx) => (
              <button key={idx} onClick={() => setTestType(item.title)} style={{
                padding: "60px 48px", backgroundColor: isDark ? "#1e293b" : "white",
                border: `2px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                borderRadius: "24px", cursor: "pointer", textAlign: "left",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: isDark ? "0 20px 50px rgba(0, 0, 0, 0.3)" : "0 10px 40px rgba(0, 0, 0, 0.06)",
                position: "relative", overflow: "hidden",
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-12px)";
                e.currentTarget.style.boxShadow = isDark ? "0 30px 70px rgba(0, 0, 0, 0.5)" : "0 20px 60px rgba(0, 0, 0, 0.12)";
                e.currentTarget.style.borderColor = item.color;
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = isDark ? "0 20px 50px rgba(0, 0, 0, 0.3)" : "0 10px 40px rgba(0, 0, 0, 0.06)";
                e.currentTarget.style.borderColor = isDark ? "#334155" : "#e2e8f0";
              }}>
                <div style={{
                  position: "absolute", top: "-50%", right: "-20%",
                  width: "300px", height: "300px", borderRadius: "50%",
                  background: `linear-gradient(${item.gradient})`,
                  opacity: 0.08, transition: "all 0.4s ease",
                }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontSize: "5rem", marginBottom: "24px", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))" }}>
                    {item.icon}
                  </div>
                  <h3 style={{
                    fontSize: "1.75rem", fontWeight: "700", marginBottom: "16px",
                    background: `linear-gradient(${item.gradient})`,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: "1.05rem", lineHeight: "1.7",
                    color: isDark ? "#94a3b8" : "#64748b",
                  }}>
                    {item.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {testType === "Domain Based Test" && !selectedDomain && <DomainSelection quizData={quizData} setSelectedDomain={setSelectedDomain} resetTest={resetTest} completedDomainTests={completedDomainTests} isDark={isDark} />}
      {selectedDomain && !selectedLevel && <LevelSelection selectedDomain={selectedDomain} levels={Object.keys(quizData[selectedDomain])} setSelectedLevel={setSelectedLevel} goBack={() => setSelectedDomain(null)} completedDomainTests={completedDomainTests} isDark={isDark} />}
      {selectedDomain && selectedLevel && !showResults && <Quiz quizQuestions={quizData[selectedDomain][selectedLevel]} userAnswers={userAnswers} setUserAnswers={setUserAnswers} submitTest={submitDomainTest} goBack={() => setSelectedLevel(null)} title={`${selectedDomain} - ${selectedLevel}`} isDark={isDark} />}
      {selectedDomain && selectedLevel && showResults && <QuizResults quizQuestions={quizData[selectedDomain][selectedLevel]} userAnswers={userAnswers} score={score} goBack={() => { setSelectedLevel(null); setUserAnswers({}); setShowResults(false); setScore(0); }} title={`${selectedDomain} - ${selectedLevel}`} isDark={isDark} />}
      {testType === "Employer Provided Tests" && !currentEmployerTest && <EmployerTests scheduledTests={scheduledTests} setCurrentEmployerTest={setCurrentEmployerTest} resetTest={resetTest} isDark={isDark} />}
      {currentEmployerTest && !showResults && <Quiz quizQuestions={currentEmployerTest.questions} userAnswers={userAnswers} setUserAnswers={setUserAnswers} submitTest={submitEmployerTest} goBack={() => setCurrentEmployerTest(null)} title={currentEmployerTest.title} isDark={isDark} />}
      {currentEmployerTest && showResults && <QuizResults quizQuestions={currentEmployerTest.questions} userAnswers={userAnswers} score={score} goBack={() => { setCurrentEmployerTest(null); setUserAnswers({}); setShowResults(false); setScore(0); }} title={currentEmployerTest.title} isDark={isDark} />}
    </div>
  );
};

const DomainSelection = ({ quizData, setSelectedDomain, resetTest, completedDomainTests, isDark }) => {
  const domainIcons = { "Web Development": "🌐", "Data Science": "📊", "UI/UX Design": "🎨", "Digital Marketing": "📱" };
  return (
    <div style={{ marginTop: 40, position: "relative", zIndex: 1 }}>
      <div style={{
        background: isDark ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" : "linear-gradient(135deg,  #6366f1 0%, #4f46e5 100%)",
        padding: "48px", borderRadius: "20px", marginBottom: "48px",
        border: `2px solid ${isDark ? "#334155" : " #6366f1"}`,
        boxShadow: isDark ? "0 20px 50px rgba(0, 0, 0, 0.4)" : "0 15px 40px #6366f1",
      }}>
        <h3 style={{
          fontSize: "2.5rem", fontWeight: "800", marginBottom: "12px",
          background: isDark ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)" : "linear-gradient(135deg, #ffffffff 0%, #fcfcfcff 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>Select Your Domain</h3>
        <p style={{ fontSize: "1.1rem", color: isDark ? "#cbd5e0" : "#ffffffff" }}>
          Choose a domain to begin your assessment journey
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 36 }}>
        {Object.keys(quizData).map((domain) => {
          const domainCompleted = Object.keys(quizData[domain]).every(level => completedDomainTests[`${domain}|${level}`]);
          return (
            <div key={domain} onClick={() => !domainCompleted && setSelectedDomain(domain)} style={{
              background: domainCompleted 
                ? (isDark ? "#1e293b" : "#f1f5f9")
                : (isDark ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)"),
              padding: 48, borderRadius: 20, cursor: domainCompleted ? "not-allowed" : "pointer",
              border: `2px solid ${isDark ? "#334155" : "#e2e8f0"}`,
              position: "relative", overflow: "hidden",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: isDark ? "0 20px 50px rgba(0, 0, 0, 0.3)" : "0 10px 40px rgba(0, 0, 0, 0.06)",
              opacity: domainCompleted ? 0.6 : 1,
            }} onMouseEnter={(e) => {
              if (!domainCompleted) {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow = isDark ? "0 30px 70px rgba(0, 0, 0, 0.5)" : "0 20px 60px rgba(0, 0, 0, 0.12)";
                e.currentTarget.style.borderColor = "#6366f1";
              }
            }} onMouseLeave={(e) => {
              if (!domainCompleted) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = isDark ? "0 20px 50px rgba(0, 0, 0, 0.3)" : "0 10px 40px rgba(0, 0, 0, 0.06)";
                e.currentTarget.style.borderColor = isDark ? "#334155" : "#e2e8f0";
              }
            }}>
              <div style={{ fontSize: "4rem", marginBottom: "20px", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))" }}>
                {domainIcons[domain] || "📚"}
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: isDark ? "#e2e8f0" : "#1e293b" }}>
                {domain}
              </div>
              {domainCompleted && (
                <span style={{
                  position: "absolute", top: 20, right: 20,
                  background: isDark ? "#059669" : "#d1fae5", color: isDark ? "#d1fae5" : "#065f46",
                  padding: "8px 16px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "700",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}>✅ Completed</span>
              )}
            </div>
          );
        })}
      </div>
      <button style={{
        marginTop: 48, padding: "16px 32px", backgroundColor: "#ef4444",
        color: "white", border: "none", borderRadius: "14px", cursor: "pointer",
        fontWeight: "700", fontSize: "1.1rem", transition: "all 0.3s ease",
        boxShadow: "0 10px 30px rgba(239, 68, 68, 0.3)",
      }} onClick={resetTest} onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#dc2626";
        e.target.style.transform = "scale(1.05)";
      }} onMouseLeave={(e) => {
        e.target.style.backgroundColor = "#ef4444";
        e.target.style.transform = "scale(1)";
      }}>⬅ Back</button>
    </div>
  );
};

const LevelSelection = ({ selectedDomain, levels, setSelectedLevel, goBack, completedDomainTests, isDark }) => (
  <div style={{ marginTop: 40, maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>
    <div style={{
      background: isDark ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" : "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
      padding: "48px", borderRadius: "20px", marginBottom: "48px",
      border: `2px solid ${isDark ? "#334155" : "#a5b4fc"}`,
      boxShadow: isDark ? "0 20px 50px rgba(0, 0, 0, 0.4)" : "0 15px 40px rgba(99, 102, 241, 0.2)",
    }}>
      <h3 style={{
        fontSize: "2.5rem", fontWeight: "800", marginBottom: "12px",
        background: isDark ? "linear-gradient(135deg, #818cf8 0%, #c084fc 100%)" : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>{selectedDomain}</h3>
      <p style={{ fontSize: "1.1rem", color: isDark ? "#cbd5e0" : "#4f46e5" }}>
        Select your difficulty level
      </p>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {levels.map((level, idx) => {
        const isCompleted = completedDomainTests[`${selectedDomain}|${level}`];
        const colors = ["#10b981", "#3b82f6", "#8b5cf6"];
        return (
          <button key={level} disabled={isCompleted} onClick={() => !isCompleted && setSelectedLevel(level)} style={{
            padding: "32px 40px", borderRadius: "16px", border: "none", cursor: isCompleted ? "not-allowed" : "pointer",
            background: isCompleted 
              ? (isDark ? "#1e293b" : "#f1f5f9")
              : `linear-gradient(135deg, ${colors[idx]} 0%, ${colors[idx]}dd 100%)`,
            color: isCompleted ? (isDark ? "#64748b" : "#94a3b8") : "white",
            fontWeight: "700", fontSize: "1.3rem", textAlign: "left",
            transition: "all 0.3s ease",
            boxShadow: isCompleted ? "none" : `0 10px 30px ${colors[idx]}50`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }} onMouseEnter={(e) => {
            if (!isCompleted) {
              e.target.style.transform = "translateX(8px) scale(1.02)";
              e.target.style.boxShadow = `0 15px 40px ${colors[idx]}70`;
            }
          }} onMouseLeave={(e) => {
            if (!isCompleted) {
              e.target.style.transform = "translateX(0) scale(1)";
              e.target.style.boxShadow = `0 10px 30px ${colors[idx]}50`;
            }
          }}>
            <span>{level}</span>
            <span style={{ fontSize: "1.5rem" }}>{isCompleted ? "✅" : "→"}</span>
          </button>
        );
      })}
    </div>
    <button style={{
      marginTop: 48, padding: "16px 32px", backgroundColor: "#ef4444",
      color: "white", border: "none", borderRadius: "14px", cursor: "pointer",
      fontWeight: "700", fontSize: "1.1rem", transition: "all 0.3s ease",
      boxShadow: "0 10px 30px rgba(239, 68, 68, 0.3)", width: "100%",
    }} onClick={goBack} onMouseEnter={(e) => {
      e.target.style.backgroundColor = "#dc2626";
      e.target.style.transform = "scale(1.03)";
    }} onMouseLeave={(e) => {
      e.target.style.backgroundColor = "#ef4444";
      e.target.style.transform = "scale(1)";
    }}>⬅ Back to Domains</button>
  </div>
);

const Quiz = ({ quizQuestions, userAnswers, setUserAnswers, submitTest, goBack, title, isDark }) => (
  <div style={{ marginTop: 40, maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
    <div style={{
      background: isDark ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" : "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
      padding: "48px", borderRadius: "20px", marginBottom: "48px",
      border: `2px solid ${isDark ? "#334155" : "#60a5fa"}`,
      boxShadow: isDark ? "0 20px 50px rgba(0, 0, 0, 0.4)" : "0 15px 40px rgba(59, 130, 246, 0.2)",
    }}>
      <h3 style={{
        fontSize: "2.5rem", fontWeight: "800", marginBottom: "12px",
        background: isDark ? "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)" : "linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>{title}</h3>
      <p style={{ fontSize: "1.1rem", color: isDark ? "#cbd5e0" : "#1e40af" }}>
        Answer all questions carefully • {quizQuestions.length} Questions
      </p>
    </div>
    <div style={{
      backgroundColor: isDark ? "#1e293b" : "#ffffff",
      padding: "48px", borderRadius: "20px",
      boxShadow: isDark ? "0 25px 60px rgba(0, 0, 0, 0.4)" : "0 15px 50px rgba(0, 0, 0, 0.08)",
      border: `2px solid ${isDark ? "#334155" : "#e2e8f0"}`,
    }}>
      {quizQuestions.map((q, idx) => (
        <div key={idx} style={{
          marginBottom: 48, paddingBottom: 48,
          borderBottom: idx < quizQuestions.length - 1 ? `2px solid ${isDark ? "#334155" : "#e2e8f0"}` : "none",
        }}>
          <div style={{
            display: "inline-block", padding: "8px 20px", borderRadius: "12px",
            background: isDark ? "#312e81" : "#eef2ff",
            color: isDark ? "#a5b4fc" : "#4f46e5",
            fontWeight: "700", fontSize: "0.95rem", marginBottom: "20px",
          }}>Question {idx + 1} of {quizQuestions.length}</div>
          <p style={{
            fontSize: "1.3rem", fontWeight: "600", marginBottom: "28px",
            color: isDark ? "#f1f5f9" : "#1e293b", lineHeight: "1.6",
          }}>{q.question}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {q.options.map((option, optIdx) => (
              <label key={optIdx} style={{
                cursor: "pointer", padding: "20px 24px", borderRadius: "14px",
                backgroundColor: userAnswers[idx] === option 
                  ? (isDark ? "#312e81" : "#eef2ff")
                  : (isDark ? "#0f172a" : "#f8fafc"),
                border: `2px solid ${userAnswers[idx] === option ? "#6366f1" : (isDark ? "#334155" : "#e2e8f0")}`,
                transition: "all 0.3s ease",
                display: "flex", alignItems: "center", gap: 16,
              }} onMouseEnter={(e) => {
                if (userAnswers[idx] !== option) {
                  e.currentTarget.style.backgroundColor = isDark ? "#1e293b" : "#f1f5f9";
                  e.currentTarget.style.borderColor = "#818cf8";
                }
              }} onMouseLeave={(e) => {
                if (userAnswers[idx] !== option) {
                  e.currentTarget.style.backgroundColor = isDark ? "#0f172a" : "#f8fafc";
                  e.currentTarget.style.borderColor = isDark ? "#334155" : "#e2e8f0";
                }
              }}>
                <input type="radio" name={`q-${idx}`} checked={userAnswers[idx] === option}
                  onChange={() => setUserAnswers(prev => ({ ...prev, [idx]: option }))}
                  style={{ cursor: "pointer", width: "20px", height: "20px" }} />
                <span style={{ fontSize: "1.1rem", color: isDark ? "#e2e8f0" : "#334155" }}>{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <div style={{ display: "flex", gap: 20, marginTop: 48 }}>
        <button style={{
          padding: "18px 36px", flex: 1, borderRadius: "14px", border: "none",
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "white", cursor: "pointer", fontWeight: "700", fontSize: "1.15rem",
          transition: "all 0.3s ease", boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
        }} onClick={submitTest} onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.03)";
          e.target.style.boxShadow = "0 15px 40px rgba(16, 185, 129, 0.5)";
        }} onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 10px 30px rgba(16, 185, 129, 0.4)";
        }}>✅ Submit Quiz</button>
        {goBack && (
          <button style={{
            padding: "18px 36px", borderRadius: "14px", border: "none",
            backgroundColor: "#ef4444", color: "white", cursor: "pointer",
            fontWeight: "700", fontSize: "1.15rem", transition: "all 0.3s ease",
            boxShadow: "0 10px 30px rgba(239, 68, 68, 0.4)",
          }} onClick={goBack} onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#dc2626";
            e.target.style.transform = "scale(1.03)";
          }} onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#ef4444";
            e.target.style.transform = "scale(1)";
          }}>⬅ Back</button>
        )}
      </div>
    </div>
  </div>
);

const QuizResults = ({ quizQuestions, userAnswers, score, goBack, title, isDark }) => {
  const percentage = (score / quizQuestions.length) * 100;
  const getMessage = () => {
    if (percentage === 100) return { text: "Perfect Score! 🌟", color: "#10b981" };
    if (percentage >= 80) return { text: "Excellent Work! 🎉", color: "#3b82f6" };
    if (percentage >= 60) return { text: "Good Job! 👏", color: "#8b5cf6" };
    return { text: "Keep Practicing! 💪", color: "#f59e0b" };
  };
  const message = getMessage();

  return (
    <div style={{ marginTop: 40, maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
      <div style={{
        background: isDark 
          ? `linear-gradient(135deg, ${message.color}20 0%, #0f172a 100%)`
          : `linear-gradient(135deg, ${message.color}15 0%, #ffffff 100%)`,
        padding: "60px 48px", borderRadius: "24px", marginBottom: "48px",
        border: `3px solid ${message.color}`,
        boxShadow: `0 25px 60px ${message.color}40`,
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-50%", left: "-25%",
          width: "500px", height: "500px", borderRadius: "50%",
          background: `radial-gradient(circle, ${message.color}10 0%, transparent 70%)`,
        }} />
        <div style={{ fontSize: "5rem", marginBottom: "24px", position: "relative", zIndex: 1 }}>
          {percentage === 100 ? "🏆" : percentage >= 80 ? "🎉" : percentage >= 60 ? "👏" : "💪"}
        </div>
        <h3 style={{
          fontSize: "2.5rem", fontWeight: "800", marginBottom: "16px",
          color: message.color, position: "relative", zIndex: 1,
        }}>{message.text}</h3>
        <div style={{
          fontSize: "4rem", fontWeight: "900", marginBottom: "16px",
          background: `linear-gradient(135deg, ${message.color} 0%, ${message.color}cc 100%)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          position: "relative", zIndex: 1,
        }}>{score} / {quizQuestions.length}</div>
        <p style={{
          fontSize: "1.3rem", color: isDark ? "#cbd5e0" : "#64748b",
          position: "relative", zIndex: 1,
        }}>You scored {percentage.toFixed(0)}% on {title}</p>
      </div>

      {quizQuestions.map((q, idx) => {
        const isCorrect = userAnswers[idx] === q.answer;
        return (
          <div key={idx} style={{
            padding: "32px", marginBottom: "28px", borderRadius: "16px",
            border: `3px solid ${isCorrect ? "#10b981" : "#ef4444"}`,
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            boxShadow: isDark ? "0 15px 40px rgba(0, 0, 0, 0.3)" : "0 10px 30px rgba(0, 0, 0, 0.06)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, right: 0,
              width: "120px", height: "120px", borderRadius: "0 0 0 100%",
              background: isCorrect 
                ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              opacity: 0.1,
            }} />
            <div style={{
              display: "inline-block", padding: "6px 16px", borderRadius: "10px",
              background: isCorrect ? (isDark ? "#065f46" : "#d1fae5") : (isDark ? "#7f1d1d" : "#fee2e2"),
              color: isCorrect ? (isDark ? "#d1fae5" : "#065f46") : (isDark ? "#fca5a5" : "#991b1b"),
              fontWeight: "700", fontSize: "0.9rem", marginBottom: "16px",
            }}>{isCorrect ? "✅ Correct" : "❌ Incorrect"}</div>
            <p style={{
              fontSize: "1.25rem", fontWeight: "600", marginBottom: "24px",
              color: isDark ? "#f1f5f9" : "#1e293b", lineHeight: "1.6",
            }}><b>Q{idx + 1}:</b> {q.question}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {q.options.map((opt, optIdx) => {
                const isAnswer = opt === q.answer;
                const isUserAnswer = userAnswers[idx] === opt;
                let bg = isDark ? "#0f172a" : "#f8fafc";
                let textColor = isDark ? "#cbd5e0" : "#64748b";
                let border = isDark ? "#334155" : "#e2e8f0";
                
                if (isAnswer) {
                  bg = isDark ? "#065f46" : "#d1fae5";
                  textColor = isDark ? "#d1fae5" : "#065f46";
                  border = "#10b981";
                } else if (isUserAnswer && !isAnswer) {
                  bg = isDark ? "#7f1d1d" : "#fee2e2";
                  textColor = isDark ? "#fca5a5" : "#991b1b";
                  border = "#ef4444";
                }

                return (
                  <div key={optIdx} style={{
                    padding: "16px 20px", backgroundColor: bg, color: textColor,
                    borderRadius: "12px", border: `2px solid ${border}`,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    fontWeight: (isAnswer || isUserAnswer) ? "700" : "500",
                    fontSize: "1.05rem",
                  }}>
                    <span>{opt}</span>
                    <span style={{ fontSize: "1.4rem" }}>
                      {isAnswer && "✅"}
                      {isUserAnswer && !isAnswer && "❌"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <button style={{
        padding: "18px 36px", width: "100%", maxWidth: "400px",
        background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
        color: "white", border: "none", borderRadius: "14px", cursor: "pointer",
        fontWeight: "700", fontSize: "1.15rem", transition: "all 0.3s ease",
        boxShadow: "0 10px 30px rgba(99, 102, 241, 0.4)", margin: "0 auto", display: "block",
      }} onClick={goBack} onMouseEnter={(e) => {
        e.target.style.transform = "scale(1.03)";
        e.target.style.boxShadow = "0 15px 40px rgba(99, 102, 241, 0.5)";
      }} onMouseLeave={(e) => {
        e.target.style.transform = "scale(1)";
        e.target.style.boxShadow = "0 10px 30px rgba(99, 102, 241, 0.4)";
      }}>🔁 Back to Tests</button>
    </div>
  );
};

const EmployerTests = ({ scheduledTests, setCurrentEmployerTest, resetTest, isDark }) => {
  const completedTests = JSON.parse(localStorage.getItem("completedEmployerTests") || "{}");

  return (
    <div style={{ marginTop: 40, position: "relative", zIndex: 1 }}>
      <div style={{
        background: isDark ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" : "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
        padding: "48px", borderRadius: "20px", marginBottom: "48px",
        border: `2px solid ${isDark ? "#334155" : "#f9a8d4"}`,
        boxShadow: isDark ? "0 20px 50px rgba(0, 0, 0, 0.4)" : "0 15px 40px rgba(236, 72, 153, 0.2)",
      }}>
        <h3 style={{
          fontSize: "2.5rem", fontWeight: "800", marginBottom: "12px",
          background: isDark ? "linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%)" : "linear-gradient(135deg, #be123c 0%, #9f1239 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>Employer Provided Tests</h3>
        <p style={{ fontSize: "1.1rem", color: isDark ? "#cbd5e0" : "#be123c" }}>
          Complete assessments assigned by your employer
        </p>
      </div>
      
      {scheduledTests.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "100px 40px",
          background: isDark ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          borderRadius: "24px", border: `3px dashed ${isDark ? "#475569" : "#cbd5e1"}`,
          boxShadow: isDark ? "0 20px 50px rgba(0, 0, 0, 0.3)" : "0 15px 40px rgba(0, 0, 0, 0.04)",
        }}>
          <div style={{ fontSize: "6rem", marginBottom: "24px", opacity: 0.4 }}>📝</div>
          <p style={{
            fontSize: "1.8rem", fontWeight: "700",
            color: isDark ? "#e2e8f0" : "#475569", marginBottom: "12px",
          }}>No Tests Available</p>
          <p style={{ fontSize: "1.15rem", color: isDark ? "#94a3b8" : "#64748b" }}>
            Check back later for employer-provided assessments
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 36,
        }}>
          {scheduledTests.map((test, idx) => {
            const isCompleted = completedTests[test.id];
            return (
              <div key={idx} style={{
                background: isDark 
                  ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                padding: "40px", borderRadius: "20px",
                boxShadow: isDark ? "0 20px 50px rgba(0, 0, 0, 0.4)" : "0 15px 40px rgba(0, 0, 0, 0.08)",
                border: `2px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative", overflow: "hidden",
                opacity: isCompleted ? 0.7 : 1,
              }} onMouseEnter={(e) => {
                if (!isCompleted) {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = isDark ? "0 30px 70px rgba(0, 0, 0, 0.5)" : "0 25px 60px rgba(0, 0, 0, 0.12)";
                  e.currentTarget.style.borderColor = "#ec4899";
                }
              }} onMouseLeave={(e) => {
                if (!isCompleted) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = isDark ? "0 20px 50px rgba(0, 0, 0, 0.4)" : "0 15px 40px rgba(0, 0, 0, 0.08)";
                  e.currentTarget.style.borderColor = isDark ? "#334155" : "#e2e8f0";
                }
              }}>
                <div style={{
                  position: "absolute", top: 0, right: 0,
                  width: "150px", height: "150px",
                  background: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
                  opacity: 0.08, borderRadius: "0 0 0 100%",
                }} />
                <h4 style={{
                  fontSize: "1.8rem", fontWeight: "800", marginBottom: "20px",
                  background: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  lineHeight: "1.3", position: "relative", zIndex: 1,
                }}>{test.title}</h4>
                <p style={{
                  fontSize: "1.05rem", lineHeight: "1.8",
                  color: isDark ? "#cbd5e0" : "#64748b",
                  marginBottom: "32px", minHeight: "70px", position: "relative", zIndex: 1,
                }}>{test.description}</p>
                <button disabled={isCompleted} style={{
                  padding: "16px 28px", width: "100%",
                  background: isCompleted 
                    ? (isDark ? "#334155" : "#e2e8f0")
                    : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: isCompleted ? (isDark ? "#64748b" : "#94a3b8") : "white",
                  border: "none", borderRadius: "12px",
                  cursor: isCompleted ? "not-allowed" : "pointer",
                  fontWeight: "700", fontSize: "1.05rem",
                  transition: "all 0.3s ease",
                  boxShadow: isCompleted ? "none" : "0 8px 20px rgba(16, 185, 129, 0.4)",
                  position: "relative", zIndex: 1,
                }} onClick={() => !isCompleted && setCurrentEmployerTest(test)}
                onMouseEnter={(e) => {
                  if (!isCompleted) {
                    e.target.style.transform = "scale(1.03)";
                    e.target.style.boxShadow = "0 12px 30px rgba(16, 185, 129, 0.5)";
                  }
                }} onMouseLeave={(e) => {
                  if (!isCompleted) {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "0 8px 20px rgba(16, 185, 129, 0.4)";
                  }
                }}>
                  {isCompleted ? "✅ Completed" : "Start Test →"}
                </button>
              </div>
            );
          })}
        </div>
      )}
      
      <button style={{
        marginTop: 48, padding: "16px 32px", backgroundColor: "#ef4444",
        color: "white", border: "none", borderRadius: "14px", cursor: "pointer",
        fontWeight: "700", fontSize: "1.1rem", transition: "all 0.3s ease",
        boxShadow: "0 10px 30px rgba(239, 68, 68, 0.3)",
      }} onClick={resetTest} onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#dc2626";
        e.target.style.transform = "scale(1.05)";
      }} onMouseLeave={(e) => {
        e.target.style.backgroundColor = "#ef4444";
        e.target.style.transform = "scale(1)";
      }}>⬅ Back</button>
    </div>
  );
};

export default StudentSkills;