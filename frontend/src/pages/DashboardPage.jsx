import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function DashboardPage() {
  const { user, API } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/application/my`)
      .then(r => setApplications(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [API]);

  const activeApp = applications.find(a => ["pending", "approved"].includes(a.status));
  const latestApp = applications[0];

  const statusColor = (s) => ({
    pending: "#f39c12", approved: "#2ecc71", rejected: "#e74c3c", draft: "#8a9bb0"
  }[s] || "#8a9bb0");

  const statusBg = (s) => ({
    pending: "rgba(243,156,18,0.15)", approved: "rgba(46,204,113,0.15)",
    rejected: "rgba(231,76,60,0.15)", draft: "rgba(138,155,176,0.15)"
  }[s] || "transparent");

  return (
    <div style={{ minHeight: "100vh", background: "#0d1b2a" }}>
      <Navbar />
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "100px 2rem 3rem" }}>

        {/* Welcome Banner */}
        <div style={{
          background: "linear-gradient(135deg, rgba(42,82,152,0.4), rgba(30,58,95,0.4))",
          border: "1px solid rgba(240,165,0,0.2)", borderRadius: "16px",
          padding: "2rem 2.5rem", marginBottom: "2rem",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem"
        }}>
          <div>
            <p style={{ color: "#f0a500", fontFamily: "Rajdhani", fontWeight: 600, letterSpacing: "2px", fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "4px" }}>Welcome Back</p>
            <h1 style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: "2.5rem", letterSpacing: "2px", color: "#f8f9fa", margin: 0 }}>{user?.name}</h1>
            <p style={{ color: "#8a9bb0", marginTop: "4px", fontSize: "0.95rem" }}>{user?.designation} · {user?.department}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.8rem", color: "#8a9bb0", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>Employee ID</div>
            <div style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: "1.3rem", color: "#f0a500" }}>{user?.employee_id}</div>
          </div>
        </div>

        {/* Employee Details Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Pay Scale", value: user?.pay_scale },
            { label: "Grade Pay", value: `₹${user?.grade_pay}` },
            { label: "Joined DVC", value: user?.dvc_joining_date },
            { label: "Marital Status", value: user?.marital_status },
          ].map(item => (
            <div key={item.label} style={{
              padding: "1.2rem 1.5rem",
              background: "rgba(30,58,95,0.25)", border: "1px solid rgba(240,165,0,0.1)", borderRadius: "10px"
            }}>
              <div style={{ fontSize: "0.75rem", color: "#f0a500", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, marginBottom: "6px" }}>{item.label}</div>
              <div style={{ color: "#f8f9fa", fontWeight: 500 }}>{item.value || "—"}</div>
            </div>
          ))}
        </div>

        {/* Application Status Card */}
        {latestApp && (
          <div style={{
            background: "rgba(30,58,95,0.3)", border: `1px solid ${statusColor(latestApp.status)}40`,
            borderRadius: "12px", padding: "1.5rem 2rem", marginBottom: "2rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <p style={{ color: "#8a9bb0", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Latest Application</p>
                <h3 style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: "1.2rem", color: "#f8f9fa" }}>
                  Quarter Allotment Application
                </h3>
                <p style={{ color: "#8a9bb0", fontSize: "0.85rem", marginTop: "4px" }}>
                  Submitted: {latestApp.submitted_at ? new Date(latestApp.submitted_at).toLocaleDateString("en-IN") : "Draft"}
                </p>
                {latestApp.allotted_quarter && (
                  <p style={{ color: "#2ecc71", fontWeight: 600, marginTop: "4px" }}>
                    🏠 Allotted Quarter: {latestApp.allotted_quarter}
                  </p>
                )}
                {latestApp.admin_remarks && (
                  <p style={{ color: "#8a9bb0", fontSize: "0.85rem", marginTop: "4px" }}>
                    Remarks: {latestApp.admin_remarks}
                  </p>
                )}
              </div>
              <span style={{
                padding: "8px 20px", borderRadius: "30px", fontFamily: "Rajdhani", fontWeight: 700,
                fontSize: "1rem", letterSpacing: "1px", textTransform: "uppercase",
                background: statusBg(latestApp.status), color: statusColor(latestApp.status),
                border: `1px solid ${statusColor(latestApp.status)}50`
              }}>{latestApp.status}</span>
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{
          background: "rgba(13,27,42,0.6)", border: "1px solid rgba(240,165,0,0.2)", borderRadius: "16px",
          padding: "2.5rem", textAlign: "center"
        }}>
          <h2 style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: "2rem", letterSpacing: "2px", color: "#f8f9fa", marginBottom: "0.75rem" }}>
            QUARTER ALLOTMENT
          </h2>
          <p style={{ color: "#8a9bb0", marginBottom: "2rem", maxWidth: "500px", margin: "0 auto 2rem" }}>
            {activeApp
              ? "You have an active application. Track its status or view details."
              : "Apply for family or bachelor accommodation at DVC BTPS colony. All applications processed digitally."}
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            {!activeApp && (
              <button className="btn-primary" onClick={() => navigate("/apply")}>
                Apply for Quarter →
              </button>
            )}
            <button className="btn-secondary" onClick={() => navigate("/track")}>
              Track Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
