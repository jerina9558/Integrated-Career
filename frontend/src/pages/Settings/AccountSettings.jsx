import React, { useState, useEffect } from "react";
import { FaUser, FaCamera, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import styles from "./settingsStyles";

const API = "http://localhost:5000";

const AccountSettings = ({ goBack }) => {
  const role = localStorage.getItem("role") || "student";
  const token = localStorage.getItem("token");
  const storageKey = `${role}_profile`;

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved
      ? JSON.parse(saved)
      : { name: "", email: "", phone: "", profilePic: null, twoFactorEnabled: false };
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (role === "student" || role === "employer") {
      axios
        .get(`${API}/${role}/personal-info`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data) {
            setProfile((prev) => ({ ...prev, ...res.data }));
            localStorage.setItem(storageKey, JSON.stringify(res.data));
          }
        })
        .catch((err) => console.error("❌ Failed to fetch personal info:", err));
    }
  }, [token, role, storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(profile));
  }, [profile, storageKey]);

  useEffect(() => {
    const handleThemeChange = () => {
      const savedTheme = localStorage.getItem("theme") || "light";
      setTheme(savedTheme);
    };
    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  const isDark = theme === "dark";

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        setProfile((prev) => ({ ...prev, profilePic: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    axios
      .post(`${API}/${role}/personal-info`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        alert(res.data.message || "Profile saved successfully!");
        localStorage.setItem(storageKey, JSON.stringify(profile));
      })
      .catch((err) => {
        console.error("❌ Save error:", err);
        alert("Failed to save profile!");
      });
  };

  useEffect(() => {
    const newErrors = {};
    if (passwords.new && passwords.new.length < 8) {
      newErrors.new = "Password must be at least 8 characters long.";
    }
    if (passwords.confirm && passwords.new !== passwords.confirm) {
      newErrors.confirm = "Passwords do not match.";
    }
    setErrors(newErrors);
  }, [passwords]);

  const changePassword = async () => {
    setSuccessMessage("");
    setErrors({});

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setErrors({ current: "All fields are required." });
      return;
    }
    if (errors.new || errors.confirm) return;

    try {
      const endpoint =
        role === "student"
          ? `${API}/student/change-password`
          : `${API}/employer/change-password`;

      const res = await axios.post(
        endpoint,
        {
          oldPassword: passwords.current,
          newPassword: passwords.new,
          confirmPassword: passwords.confirm,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: () => true,
        }
      );

      if (res.status === 401 || res.data.message === "Incorrect current password") {
        setErrors({ current: "Incorrect current password." });
      } else if (res.data.success) {
        setSuccessMessage("Password changed successfully!");
        setPasswords({ current: "", new: "", confirm: "" });
        setErrors({});
      } else {
        setErrors({ current: res.data.message || "Error changing password." });
      }
    } catch (err) {
      console.error("Password change error:", err);
      setErrors({ current: "Error changing password." });
    }
  };

  // STYLED INPUT AND LABEL (matching EmployerJobs)
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
    marginBottom: "24px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    fontSize: "0.95rem",
    color: isDark ? "#e2e8f0" : "#374151",
  };

  const renderRoleSpecificFields = () => {
    switch (role) {
      case "student":
        return (
          <>
            <label style={labelStyle}>
              Name <span style={{ color: "#ef4444" }}>*</span>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                style={inputStyle}
                placeholder="Your full name"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = "#3f51b5";
                  e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                  e.target.style.boxShadow = "none";
                }}
              />
            </label>
            <label style={labelStyle}>
              Email <span style={{ color: "#ef4444" }}>*</span>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                style={inputStyle}
                placeholder="you@example.com"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = "#3f51b5";
                  e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                  e.target.style.boxShadow = "none";
                }}
              />
            </label>
            <label style={labelStyle}>
              Phone Number
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                style={inputStyle}
                placeholder="+1 234 567 890"
                onFocus={(e) => {
                  e.target.style.borderColor = "#3f51b5";
                  e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                  e.target.style.boxShadow = "none";
                }}
              />
            </label>
          </>
        );

      case "employer":
        return (
          <>
            <label style={labelStyle}>
              Employer Name <span style={{ color: "#ef4444" }}>*</span>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                style={inputStyle}
                placeholder="Employer full name"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = "#3f51b5";
                  e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                  e.target.style.boxShadow = "none";
                }}
              />
            </label>
            <label style={labelStyle}>
              Employer Phone Number
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                style={inputStyle}
                placeholder="+1 987 654 3210"
                onFocus={(e) => {
                  e.target.style.borderColor = "#3f51b5";
                  e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                  e.target.style.boxShadow = "none";
                }}
              />
            </label>
            <label style={labelStyle}>
              Employer Email <span style={{ color: "#ef4444" }}>*</span>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                style={inputStyle}
                placeholder="employer@example.com"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = "#3f51b5";
                  e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                  e.target.style.boxShadow = "none";
                }}
              />
            </label>
          </>
        );

      case "admin":
        return (
          <p style={{ color: isDark ? "#a0aec0" : "#6b7280", fontStyle: "italic", fontSize: "1rem" }}>
            Admins don't have personal profiles — only security options are available.
          </p>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif", color: isDark ? "#ffffff" : "#111827" }}>
      <button 
        onClick={goBack} 
        style={{
          marginBottom: "32px",
          background: "none",
          border: "none",
          color: "#3f51b5",
          fontSize: "1.1rem",
          cursor: "pointer",
          fontWeight: "600",
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
        onMouseLeave={(e) => e.target.style.textDecoration = "none"}
      >
        ← Back
      </button>

      {/* Hero Section */}
      <div style={{
        background: isDark 
          ? "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)"
          : "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
        padding: "48px 240px",
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
          fontSize: "1.5rem",
          fontWeight: "700",
          marginBottom: "12px",
          background: isDark 
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "linear-gradient(135deg, #3f51b5 0%, #5a67d8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          {role.charAt(0).toUpperCase() + role.slice(1)} Account Settings
        </h2>
        <p style={{
          fontSize: "1.1rem",
          color: isDark ? "#a0aec0" : "#6b7280",
          maxWidth: "600px",
        }}>
          Manage your personal information and security settings
        </p>
      </div>

      {/* Profile Picture Section */}
      {(role === "student" || role === "employer") && (
        <div style={{
          backgroundColor: isDark ? "#2d3748" : "#ffffff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: isDark 
            ? "0 10px 30px rgba(0, 0, 0, 0.4)"
            : "0 6px 20px rgba(0, 0, 0, 0.08)",
          border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
          marginBottom: "32px",
        }}>
          <h3 style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "24px",
            color: isDark ? "#e2e8f0" : "#1f2937",
          }}>
            Profile Picture
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
            <div style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid #3f51b5",
              backgroundColor: isDark ? "#4a5568" : "#e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {profile.profilePic ? (
                <img src={profile.profilePic} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ fontSize: "3rem" }}>
                  <FaUser size={50} color="#bbb" />
                </div>
              )}
            </div>
            <label htmlFor="profilePicUpload" style={{
              backgroundColor: "#3f51b5",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "10px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(63, 81, 181, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#303f9f";
              e.target.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#3f51b5";
              e.target.style.transform = "scale(1)";
            }}>
              <FaCamera style={{ marginRight: 4 }} /> Upload New Picture
            </label>
            <input
              id="profilePicUpload"
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              style={{ display: "none" }}
            />
          </div>
        </div>
      )}

      {/* Personal Information Section */}
      <div style={{
        backgroundColor: isDark ? "#2d3748" : "#ffffff",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: isDark 
          ? "0 10px 30px rgba(0, 0, 0, 0.4)"
          : "0 6px 20px rgba(0, 0, 0, 0.08)",
        border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
        marginBottom: "32px",
      }}>
        <h3 style={{
          fontSize: "1.75rem",
          fontWeight: "600",
          marginBottom: "24px",
          color: isDark ? "#e2e8f0" : "#1f2937",
        }}>
          {role === "student" && "Personal Information"}
          {role === "employer" && "Employer Information"}
          {role === "admin" && "Admin Information"}
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveProfile();
          }}
          style={{ maxWidth: "600px" }}
        >
          {renderRoleSpecificFields()}
          {role !== "admin" && (
            <button type="submit" style={{
              padding: "14px 24px",
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
              marginTop: "8px",
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
            }}>
              💾 Save {role === "student" ? "Personal" : "Employer"} Info
            </button>
          )}
        </form>
      </div>

      {/* Security Settings Section */}
      {(role === "student" || role === "employer") && (
        <div style={{
          backgroundColor: isDark ? "#2d3748" : "#ffffff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: isDark 
            ? "0 10px 30px rgba(0, 0, 0, 0.4)"
            : "0 6px 20px rgba(0, 0, 0, 0.08)",
          border: `1px solid ${isDark ? "#4a5568" : "#e5e7eb"}`,
        }}>
          <h3 style={{
            fontSize: "1.75rem",
            fontWeight: "600",
            marginBottom: "24px",
            color: isDark ? "#e2e8f0" : "#1f2937",
          }}>
            🔒 Security Settings
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              changePassword();
            }}
            style={{ maxWidth: "600px" }}
          >
            {["current", "new", "confirm"].map((field) => (
              <label
                key={field}
                style={{ ...labelStyle, position: "relative" }}
              >
                {field === "current"
                  ? "Current Password"
                  : field === "new"
                  ? "New Password"
                  : "Confirm New Password"}
                {field !== "current" && <span style={{ color: "#ef4444" }}> *</span>}
                <input
                  type={showPassword ? "text" : "password"}
                  name={field}
                  value={passwords[field]}
                  onChange={(e) =>
                    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                  }
                  style={inputStyle}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3f51b5";
                    e.target.style.boxShadow = "0 0 0 3px rgba(63, 81, 181, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = isDark ? "#4a5568" : "#d1d5db";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {errors[field] && (
                  <p style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "-16px", marginBottom: "16px" }}>
                    ⚠️ {errors[field]}
                  </p>
                )}
              </label>
            ))}

            {successMessage && (
              <div style={{
                backgroundColor: "#d1fae5",
                color: "#065f46",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "24px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
                ✅ {successMessage}
              </div>
            )}

            <button type="submit" style={{
              padding: "14px 24px",
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
              marginTop: "8px",
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
            }}>
              🔐 Change Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;