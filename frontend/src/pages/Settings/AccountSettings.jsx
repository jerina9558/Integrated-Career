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

  const themeStyles = {
    light: { color: "#111827" },
    dark: { color: "#ffffff" },
  };

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

  const renderRoleSpecificFields = () => {
    switch (role) {
      case "student":
        return (
          <>
            <label style={{ ...styles.label, ...themeStyles[theme] }}>
              Name
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                style={styles.input}
                placeholder="Your full name"
                required
              />
            </label>
            <label style={{ ...styles.label, ...themeStyles[theme] }}>
              Email
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                style={styles.input}
                placeholder="you@example.com"
                required
              />
            </label>
            <label style={{ ...styles.label, ...themeStyles[theme] }}>
              Phone Number
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                style={styles.input}
                placeholder="+1 234 567 890"
              />
            </label>
          </>
        );

      case "employer":
        return (
          <>
            <label style={{ ...styles.label, ...themeStyles[theme] }}>
              Employer Name
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                style={styles.input}
                placeholder="Employer full name"
                required
              />
            </label>
            <label style={{ ...styles.label, ...themeStyles[theme] }}>
              Employer Phone Number
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                style={styles.input}
                placeholder="+1 987 654 3210"
              />
            </label>
            <label style={{ ...styles.label, ...themeStyles[theme] }}>
              Employer Email
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                style={styles.input}
                placeholder="employer@example.com"
                required
              />
            </label>
          </>
        );

      case "admin":
        return (
          <p style={{ ...themeStyles[theme], fontStyle: "italic" }}>
            Admins don’t have personal profiles — only security options are available.
          </p>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ ...themeStyles[theme] }}>
      <button onClick={goBack} style={{ ...styles.backBtn, ...themeStyles[theme] }}>
        ← Back
      </button>

      <h2 style={{ ...styles.sectionTitle, ...themeStyles[theme], marginBottom: "1rem" }}>
        {role.charAt(0).toUpperCase() + role.slice(1)} Account Settings
      </h2>

      {(role === "student" || role === "employer") && (
        <div style={styles.section}>
          <h3 style={{ ...styles.sectionTitle, ...themeStyles[theme] }}>Profile Picture</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={styles.profilePicContainer}>
              {profile.profilePic ? (
                <img src={profile.profilePic} alt="Profile" style={styles.profilePic} />
              ) : (
                <div style={styles.profilePicPlaceholder}>
                  <FaUser size={50} color="#bbb" />
                </div>
              )}
            </div>
            <label htmlFor="profilePicUpload" style={styles.uploadLabel}>
              <FaCamera style={{ marginRight: 8 }} /> Upload New Picture
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

      <div style={styles.section}>
        <h3 style={{ ...styles.sectionTitle, ...themeStyles[theme] }}>
          {role === "student" && "Personal Information"}
          {role === "employer" && "Employer Information"}
          {role === "admin" && "Admin Information"}
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveProfile();
          }}
          style={{ maxWidth: 500 }}
        >
          {renderRoleSpecificFields()}
          {role !== "admin" && (
            <button type="submit" style={styles.saveButton}>
              Save {role === "student" ? "Personal" : "Employer"} Info
            </button>
          )}
        </form>
      </div>

      {(role === "student" || role === "employer") && (
        <div style={styles.section}>
          <h3 style={{ ...styles.sectionTitle, ...themeStyles[theme] }}>Security Settings</h3>

          {/* Password Section */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              changePassword();
            }}
            style={{ maxWidth: 500 }}
          >
            {["current", "new", "confirm"].map((field) => (
              <label
                key={field}
                style={{ ...styles.label, ...themeStyles[theme], position: "relative" }}
              >
                {field === "current"
                  ? "Current Password"
                  : field === "new"
                  ? "New Password"
                  : "Confirm New Password"}
                <input
                  type={showPassword ? "text" : "password"}
                  name={field}
                  value={passwords[field]}
                  onChange={(e) =>
                    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                  }
                  style={{
                    ...styles.input,
                    paddingRight: field === "confirm" ? "35px" : "10px",
                  }}
                  required
                />
                {errors[field] && (
                  <p style={{ color: "red", fontSize: "0.85rem" }}>{errors[field]}</p>
                )}
              </label>
            ))}

            {successMessage && (
              <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>
            )}

            <button type="submit" style={styles.saveButton}>
              Change Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
