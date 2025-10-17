import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Register from "./pages/Register";
import Login from "./components/Login";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import StudentJobs from "./pages/StudentJobs";
import EmployerJobs from "./pages/EmployerJobs";
import Resume from "./pages/Resume";
import Career from "./pages/Career";
import Tracking from "./pages/StudentApplicationTracker";
import EmployerApplicationTracker from "./pages/EmployerApplicationTracker"; // ✅ Added
import Settings from "./pages/Settings/Settings";
import Layout from "./components/Layout";

import EmployerSkills from "./pages/EmployerSkills";
import StudentSkills from "./pages/StudentSkills";

// ✅ Import FeedbackWrapper
import FeedbackWrapper from "./pages/Feedback"; // adjust path if needed

// 🔒 PrivateRoute ensures token exists before rendering
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// 🧠 SkillAssessmentWrapper decides which skills page to render
function SkillAssessmentWrapper() {
  const role = localStorage.getItem("role");
  if (!role) return <Navigate to="/login" replace />;
  return role === "employer" ? <EmployerSkills /> : <StudentSkills />;
}

// ⚙️ SettingsWrapper passes role prop to settings
function SettingsWrapper() {
  const role = localStorage.getItem("role");
  if (!role) return <Navigate to="/login" replace />;
  return <Settings role={role} />;
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId="889433756377-d9i34lglledr93p7jpa4pbnkc4t3cak6.apps.googleusercontent.com">
      <Router>
        <Routes>
          {/* Default route -> login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Dashboard layout for all dashboard-related routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            {/* Nested routes appear inside <Outlet /> in Layout.jsx */}
            <Route index element={<Dashboard />} />
            <Route path="StudentJobs" element={<StudentJobs />} />
            <Route path="Resume" element={<Resume />} />
            <Route path="Career" element={<Career />} />
            <Route path="Tracking" element={<Tracking />} />
            <Route path="EmployerJobs" element={<EmployerJobs />} />
            <Route path="EmployerApplicationTracker" element={<EmployerApplicationTracker />} /> {/* ✅ Added */}
            <Route path="SkillAssessment" element={<SkillAssessmentWrapper />} />
            <Route path="Settings" element={<SettingsWrapper />} />

            {/* ✅ Feedback Page */}
            <Route path="Feedback" element={<FeedbackWrapper />} />
          </Route>

          {/* Catch-all -> login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}
