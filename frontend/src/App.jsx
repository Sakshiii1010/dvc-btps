import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ApplicationFormPage from "./pages/ApplicationFormPage";
import TrackApplicationPage from "./pages/TrackApplicationPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ContactPage from "./pages/ContactPage";
import HelpPage from "./pages/HelpPage";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#f0a500", fontFamily: "Rajdhani", fontSize: "1.5rem" }}>Loading DVC BTPS...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" />;
  if (!adminOnly && user.role === "admin") return <Navigate to="/admin" />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/apply" element={<PrivateRoute><ApplicationFormPage /></PrivateRoute>} />
        <Route path="/track" element={<PrivateRoute><TrackApplicationPage /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
