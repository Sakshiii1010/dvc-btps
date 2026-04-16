import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import axios from "axios";

const STEPS = ["Submitted", "Under Review", "Decision Made", "Allotment Done"];
const stepIndex = (status) => ({
  pending: 1, approved: 3, rejected: 2, draft: 0
}[status] ?? 0);

export default function TrackApplicationPage() {
  const { API } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/application/my`)
      .then(r => setApps(r.data.filter(a => a.status !== "draft")))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [API]);

  const statusColor = (s) => ({ pending: "#f39c12", approved: "#2ecc71", rejected: "#e74c3c" }[s] || "#8a9bb0");

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0d1b2a", display: "flex", alignItems: "center", justifyContent: "center", color: "#f0a500", fontFamily: "Rajdhani", fontSize: "1.3rem" }}>
      <Navbar />Loading...
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0d1b2a" }}>
      <Navbar />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "100px 2rem 3rem" }}>
        <h1 style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: "2.5rem", letterSpacing: "3px", color: "#f8f9fa", marginBottom: "0.5rem" }}>
          TRACK <span style={{ color: "#f0a500" }}>APPLICATION</span>
        </h1>
        <p style={{ color: "#8a9bb0", marginBottom: "2.5rem" }}>Real-time status of your quarter allotment request</p>

        {apps.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "4rem 2rem",
            background: "rgba(30,58,95,0.2)", border: "1px solid rgba(240,165,0,0.1)", borderRadius: "12px"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
            <h3 style={{ fontFamily: "Rajdhani", fontWeight: 700, color: "#f8f9fa", marginBottom: "0.5rem" }}>No Applications Found</h3>
            <p style={{ color: "#8a9bb0" }}>You haven't submitted any quarter allotment applications yet.</p>
          </div>
        ) : (
          apps.map((app, idx) => {
            const step = stepIndex(app.status);
            return (
              <div key={idx} className="card" style={{ padding: "2rem", marginBottom: "2rem" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <h3 style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: "1.3rem", color: "#f8f9fa" }}>
                      Quarter Allotment Application
                    </h3>
                    <p style={{ color: "#8a9bb0", fontSize: "0.85rem", marginTop: "4px" }}>
                      Submitted: {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                    </p>
                  </div>
                  <span style={{
                    padding: "6px 18px", borderRadius: "30px", fontFamily: "Rajdhani", fontWeight: 700,
                    fontSize: "0.9rem", letterSpacing: "1px", textTransform: "uppercase",
                    background: `${statusColor(app.status)}20`, color: statusColor(app.status),
                    border: `1px solid ${statusColor(app.status)}50`
                  }}>{app.status}</span>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                    {/* Line */}
                    <div style={{
                      position: "absolute", top: "16px", left: "16px", right: "16px", height: "2px",
                      background: "rgba(30,58,95,0.8)", zIndex: 0
                    }} />
                    <div style={{
                      position: "absolute", top: "16px", left: "16px", height: "2px", zIndex: 1,
                      background: app.status === "rejected" ? "#e74c3c" : "#f0a500",
                      width: `${(step / (STEPS.length - 1)) * (100 - 8)}%`,
                      transition: "width 0.5s ease"
                    }} />
                    {STEPS.map((s, i) => {
                      const done = i <= step;
                      const isRejected = app.status === "rejected" && i === step;
                      return (
                        <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, flex: 1 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: "50%",
                            background: done ? (isRejected ? "#e74c3c" : "#f0a500") : "rgba(30,58,95,0.8)",
                            border: `2px solid ${done ? (isRejected ? "#e74c3c" : "#f0a500") : "rgba(240,165,0,0.2)"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.8rem", color: done ? "#0d1b2a" : "#8a9bb0", fontWeight: 700
                          }}>
                            {isRejected ? "✗" : done ? "✓" : i + 1}
                          </div>
                          <span style={{
                            fontSize: "0.7rem", color: done ? (isRejected ? "#e74c3c" : "#f0a500") : "#8a9bb0",
                            marginTop: "6px", textAlign: "center", fontWeight: done ? 600 : 400
                          }}>{s}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  {[
                    { label: "Applicant", value: app.name },
                    { label: "Designation", value: app.designation },
                    { label: "Department", value: app.department },
                    { label: "Pay Scale", value: app.pay_scale },
                  ].map(item => (
                    <div key={item.label} style={{
                      padding: "0.8rem 1rem",
                      background: "rgba(13,27,42,0.5)", borderRadius: "8px", border: "1px solid rgba(30,58,95,0.5)"
                    }}>
                      <div style={{ fontSize: "0.7rem", color: "#8a9bb0", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "3px" }}>{item.label}</div>
                      <div style={{ color: "#f8f9fa", fontSize: "0.9rem", fontWeight: 500 }}>{item.value || "—"}</div>
                    </div>
                  ))}
                </div>

                {/* Allotment Info */}
                {app.allotted_quarter && (
                  <div style={{
                    marginTop: "1.5rem", padding: "1.2rem 1.5rem",
                    background: "rgba(46,204,113,0.1)", border: "1px solid rgba(46,204,113,0.3)", borderRadius: "8px"
                  }}>
                    <p style={{ color: "#2ecc71", fontFamily: "Rajdhani", fontWeight: 700, fontSize: "1.1rem" }}>
                      🏠 Quarter Allotted: {app.allotted_quarter}
                    </p>
                    {app.action_date && (
                      <p style={{ color: "#8a9bb0", fontSize: "0.8rem", marginTop: "4px" }}>
                        Allotted on: {new Date(app.action_date).toLocaleDateString("en-IN")}
                      </p>
                    )}
                  </div>
                )}

                {/* Remarks */}
                {app.admin_remarks && (
                  <div style={{
                    marginTop: "1.5rem", padding: "1rem 1.5rem",
                    background: "rgba(240,165,0,0.05)", border: "1px solid rgba(240,165,0,0.15)", borderRadius: "8px"
                  }}>
                    <p style={{ color: "#8a9bb0", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Admin Remarks</p>
                    <p style={{ color: "#b0c4de", fontSize: "0.9rem" }}>{app.admin_remarks}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
