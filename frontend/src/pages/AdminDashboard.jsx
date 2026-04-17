import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";

const TAB = ({ label, active, onClick, count, color }) => (
  <button onClick={onClick} style={{
    padding: "10px 20px", border: "none", cursor: "pointer", fontFamily: "Rajdhani,sans-serif",
    fontWeight: 600, fontSize: "0.9rem", letterSpacing: "1px", textTransform: "uppercase",
    borderRadius: "8px", transition: "all 0.2s",
    background: active ? "rgba(240,165,0,0.15)" : "transparent",
    color: active ? "#f0a500" : "#8a9bb0",
    borderBottom: active ? "2px solid #f0a500" : "2px solid transparent"
  }}>
    {label}
    {count !== undefined && (
      <span style={{
        marginLeft: "8px", background: color || "rgba(240,165,0,0.2)", color: "#f0a500",
        borderRadius: "20px", padding: "2px 8px", fontSize: "0.75rem"
      }}>{count}</span>
    )}
  </button>
);

function ApplicationCard({ app, onAction }) {
  const [remarks, setRemarks] = useState("");
  const [quarter, setQuarter] = useState("");
  const [open, setOpen] = useState(false);
  const [acting, setActing] = useState(false);

  const act = async (action) => {
    setActing(true);
    try {
      await onAction(app.employee_id, action, quarter, remarks);
      setOpen(false);
    } finally { setActing(false); }
  };

  const sc = { pending: "#f39c12", approved: "#2ecc71", rejected: "#e74c3c" };

  return (
    <div style={{
      background: "rgba(13,27,42,0.6)", border: "1px solid rgba(30,58,95,0.5)",
      borderRadius: "12px", padding: "1.5rem", marginBottom: "1rem"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: "Rajdhani", fontWeight: 700, color: "#f8f9fa", fontSize: "1.1rem" }}>{app.name}</h3>
          <p style={{ color: "#8a9bb0", fontSize: "0.85rem" }}>{app.designation} · {app.department}</p>
          <p style={{ color: "#8a9bb0", fontSize: "0.8rem", marginTop: "4px" }}>ID: {app.employee_id}</p>
          {app.submitted_at && <p style={{ color: "#8a9bb0", fontSize: "0.78rem" }}>Submitted: {new Date(app.submitted_at).toLocaleDateString("en-IN")}</p>}
          {app.allotted_quarter && <p style={{ color: "#2ecc71", fontWeight: 600, fontSize: "0.85rem" }}>Allotted: {app.allotted_quarter}</p>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
          <span style={{
            padding: "4px 14px", borderRadius: "20px", fontFamily: "Rajdhani", fontWeight: 700,
            fontSize: "0.8rem", textTransform: "uppercase",
            background: `${sc[app.status] || "#8a9bb0"}20`, color: sc[app.status] || "#8a9bb0",
            border: `1px solid ${sc[app.status] || "#8a9bb0"}40`
          }}>{app.status}</span>
          <button onClick={() => setOpen(!open)} style={{
            background: "rgba(240,165,0,0.1)", color: "#f0a500", border: "1px solid rgba(240,165,0,0.3)",
            padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontFamily: "Rajdhani", fontSize: "0.8rem"
          }}>{open ? "Hide" : "Details"}</button>
        </div>
      </div>

      {open && (
        <div style={{ marginTop: "1.5rem", borderTop: "1px solid rgba(30,58,95,0.5)", paddingTop: "1.5rem" }}>
          {/* Details */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "0.8rem", marginBottom: "1.5rem" }}>
            {[
              ["Pay Scale", app.pay_scale], ["Grade Pay", app.grade_pay],
              ["Marital Status", app.marital_status], ["DVC Joining", app.dvc_joining_date],
              ["Basic Pay", app.basic_pay], ["Category", app.sc_st_category],
            ].map(([l, v]) => v ? (
              <div key={l} style={{ background: "rgba(30,58,95,0.3)", borderRadius: "6px", padding: "0.7rem 1rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#f0a500", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "3px" }}>{l}</div>
                <div style={{ color: "#f8f9fa", fontSize: "0.85rem" }}>{v}</div>
              </div>
            ) : null)}
          </div>

          {app.status === "pending" && (
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ flex: 1, minWidth: "150px" }}>
                <label>Quarter No. to Allot</label>
                <input className="input-field" value={quarter} onChange={e => setQuarter(e.target.value)} placeholder="e.g. B-012" style={{ fontSize: "0.9rem" }} />
              </div>
              <div style={{ flex: 2, minWidth: "200px" }}>
                <label>Admin Remarks</label>
                <input className="input-field" value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Optional remarks" style={{ fontSize: "0.9rem" }} />
              </div>
              <button onClick={() => act("approved")} disabled={acting || !quarter} style={{
                padding: "12px 20px", background: "rgba(46,204,113,0.15)", color: "#2ecc71",
                border: "1px solid rgba(46,204,113,0.4)", borderRadius: "8px", cursor: "pointer",
                fontFamily: "Rajdhani", fontWeight: 700, opacity: !quarter ? 0.5 : 1, whiteSpace: "nowrap"
              }}>✅ Approve</button>
              <button onClick={() => act("rejected")} disabled={acting} style={{
                padding: "12px 20px", background: "rgba(231,76,60,0.15)", color: "#e74c3c",
                border: "1px solid rgba(231,76,60,0.4)", borderRadius: "8px", cursor: "pointer",
                fontFamily: "Rajdhani", fontWeight: 700
              }}>❌ Reject</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Quarter Layout Map
function QuarterMap({ quarters, onQuarterClick }) {
  const blocks = [...new Set(quarters.map(q => q.block))].sort();
  return (
    <div>
      <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {[["🟢", "Vacant"], ["🔴", "Occupied"]].map(([icon, label]) => (
          <span key={label} style={{ color: "#b0c4de", fontSize: "0.85rem" }}>{icon} {label}</span>
        ))}
      </div>
      {blocks.map(block => {
        const bq = quarters.filter(q => q.block === block);
        const sample = bq[0];
        return (
          <div key={block} style={{ marginBottom: "2rem" }}>
            <h3 style={{
              fontFamily: "Rajdhani", fontWeight: 700, color: "#f0a500", fontSize: "1rem",
              textTransform: "uppercase", letterSpacing: "2px", marginBottom: "1rem"
            }}>
              Block {block} — {sample?.type} ({sample?.category})
              <span style={{ color: "#8a9bb0", fontWeight: 400, marginLeft: "12px" }}>
                {bq.filter(q => q.status?.toLowerCase() === "vacant").length} vacant / {bq.length} total
              </span>
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {bq.map(q => (
                <button key={q.quarter_number} onClick={() => onQuarterClick(q)} title={`${q.quarter_number}\n${q.status}\n${q.occupied_by ? "By: " + q.occupied_by : ""}`}
                  style={{
                    width: 56, height: 56, borderRadius: "8px", cursor: "pointer",
                    border: `2px solid ${q.status?.toLowerCase() === "vacant" ? "rgba(46,204,113,0.5)" : "rgba(231,76,60,0.5)"}`,
                    background: q.status?.toLowerCase() === "vacant" ? "rgba(46,204,113,0.12)" : "rgba(231,76,60,0.12)",
                    color: q.status?.toLowerCase() === "vacant" ? "#2ecc71" : "#e74c3c",
                    fontFamily: "Rajdhani", fontWeight: 700, fontSize: "0.7rem",
                    transition: "all 0.15s", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: "2px"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.zIndex = "10"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.zIndex = "1"; }}
                >
                  <span style={{ fontSize: "0.65rem" }}>{q.quarter_number}</span>
                  <span style={{ fontSize: "0.9rem" }}>{q.status?.toLowerCase() === "vacant" ? "🟢" : "🔴"}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminDashboard() {
  const { API, user } = useAuth();
  const [tab, setTab] = useState("overview");
  const [appFilter, setAppFilter] = useState("pending");
  const [apps, setApps] = useState([]);
  const [quarters, setQuarters] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, appsRes, quartersRes] = await Promise.all([
        axios.get(`${API}/admin/stats`),
        axios.get(`${API}/admin/applications?status=all`),
        axios.get(`${API}/quarters/`)
      ]);
      setStats(statsRes.data);
      setApps(appsRes.data);
      setQuarters(quartersRes.data);
    } catch (e) { toast.error("Failed to load data"); }
    finally { setLoading(false); }
  }, [API]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAction = async (employee_id, action, quarter_number, remarks) => {
    try {
      await axios.post(`${API}/admin/application/${employee_id}/action`, { action, quarter_number, remarks });
      toast.success(`Application ${action} successfully`);
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Action failed");
    }
  };

  const filteredApps = apps.filter(a => appFilter === "all" ? a.status !== "draft" : a.status === appFilter);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0d1b2a", display: "flex", alignItems: "center", justifyContent: "center", color: "#f0a500", fontFamily: "Rajdhani", fontSize: "1.3rem" }}>
      <Navbar />Loading Admin Dashboard...
    </div>
  );

  const STAT_CARDS = stats ? [
    { label: "Total Applications", value: stats.applications.total, color: "#f0a500" },
    { label: "Pending", value: stats.applications.pending, color: "#f39c12" },
    { label: "Approved", value: stats.applications.approved, color: "#2ecc71" },
    { label: "Rejected", value: stats.applications.rejected, color: "#e74c3c" },
    { label: "Total Quarters", value: stats.quarters.total, color: "#f0a500" },
    { label: "Vacant", value: stats.quarters.vacant, color: "#2ecc71" },
    { label: "Occupied", value: stats.quarters.occupied, color: "#e74c3c" },
  ] : [];

  return (
    <div style={{ minHeight: "100vh", background: "#0d1b2a" }}>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "90px 2rem 3rem" }}>

        {/* Admin Header */}
        <div style={{
          background: "linear-gradient(135deg,rgba(192,57,43,0.2),rgba(30,58,95,0.4))",
          border: "1px solid rgba(192,57,43,0.3)", borderRadius: "12px",
          padding: "1.5rem 2rem", marginBottom: "2rem",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem"
        }}>
          <div>
            <p style={{ color: "#e74c3c", fontFamily: "Rajdhani", fontWeight: 600, letterSpacing: "2px", fontSize: "0.8rem", textTransform: "uppercase" }}>Admin Access</p>
            <h1 style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: "2rem", letterSpacing: "2px", color: "#f8f9fa", margin: "4px 0 0" }}>
              DVC BTPS · ADMIN DASHBOARD
            </h1>
          </div>
          <div style={{ fontSize: "0.85rem", color: "#8a9bb0" }}>
            🔐 Logged in as <span style={{ color: "#f0a500", fontWeight: 600 }}>{user?.name}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {STAT_CARDS.map(s => (
            <div key={s.label} style={{
              padding: "1.2rem", background: "rgba(30,58,95,0.25)",
              border: `1px solid ${s.color}20`, borderRadius: "10px", textAlign: "center"
            }}>
              <div style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: "2.2rem", color: s.color, letterSpacing: "2px" }}>{s.value}</div>
              <div style={{ fontSize: "0.72rem", color: "#8a9bb0", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid rgba(240,165,0,0.1)", paddingBottom: "0.5rem", flexWrap: "wrap" }}>
          <TAB label="Overview" active={tab === "overview"} onClick={() => setTab("overview")} />
          <TAB label="Applications" active={tab === "apps"} onClick={() => setTab("apps")} count={apps.filter(a => a.status === "pending").length} />
          <TAB label="Quarter Map" active={tab === "map"} onClick={() => setTab("map")} />
        </div>

        {/* Overview Tab */}
        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div className="card" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontFamily: "Rajdhani", fontWeight: 700, color: "#f0a500", marginBottom: "1rem" }}>Application Summary</h3>
              {stats && Object.entries(stats.applications).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: "1px solid rgba(30,58,95,0.4)" }}>
                  <span style={{ color: "#b0c4de", textTransform: "capitalize" }}>{k}</span>
                  <span style={{ fontFamily: "Rajdhani", fontWeight: 700, color: "#f0a500", fontSize: "1.1rem" }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontFamily: "Rajdhani", fontWeight: 700, color: "#f0a500", marginBottom: "1rem" }}>Quarter Summary</h3>
              {stats && Object.entries(stats.quarters).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: "1px solid rgba(30,58,95,0.4)" }}>
                  <span style={{ color: "#b0c4de", textTransform: "capitalize" }}>{k}</span>
                  <span style={{ fontFamily: "Rajdhani", fontWeight: 700, color: "#f0a500", fontSize: "1.1rem" }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: "1.5rem" }}>
                <div style={{ display: "flex", gap: "1rem" }}>
                  {[{ l: "Vacant", v: stats?.quarters.vacant, t: stats?.quarters.total, c: "#2ecc71" },
                    { l: "Occupied", v: stats?.quarters.occupied, t: stats?.quarters.total, c: "#e74c3c" }].map(b => (
                    <div key={b.l} style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.75rem", color: "#8a9bb0", marginBottom: "4px" }}>{b.l}</div>
                      <div style={{ height: "8px", background: "rgba(30,58,95,0.5)", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${b.t ? (b.v / b.t) * 100 : 0}%`, background: b.c, borderRadius: "4px", transition: "width 0.5s" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {tab === "apps" && (
          <div>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              {["pending", "approved", "rejected", "all"].map(f => (
                <button key={f} onClick={() => setAppFilter(f)} style={{
                  padding: "7px 16px", borderRadius: "6px", cursor: "pointer", fontFamily: "Rajdhani",
                  fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px",
                  border: "1px solid rgba(240,165,0,0.3)",
                  background: appFilter === f ? "rgba(240,165,0,0.15)" : "transparent",
                  color: appFilter === f ? "#f0a500" : "#8a9bb0"
                }}>{f} ({apps.filter(a => f === "all" ? a.status !== "draft" : a.status === f).length})</button>
              ))}
            </div>
            {filteredApps.length === 0
              ? <p style={{ color: "#8a9bb0", textAlign: "center", padding: "3rem" }}>No {appFilter} applications</p>
              : filteredApps.map((app, i) => <ApplicationCard key={i} app={app} onAction={handleAction} />)
            }
          </div>
        )}

        {/* Quarter Map Tab */}
        {tab === "map" && (
          <div>
            {selectedQuarter && (
              <div style={{
                position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                background: "#1e3a5f", border: "1px solid rgba(240,165,0,0.4)", borderRadius: "12px",
                padding: "2rem", zIndex: 1000, minWidth: "300px", boxShadow: "0 20px 60px rgba(0,0,0,0.6)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <h3 style={{ fontFamily: "Rajdhani", fontWeight: 700, color: "#f0a500", fontSize: "1.3rem" }}>
                    Quarter {selectedQuarter.quarter_number}
                  </h3>
                  <button onClick={() => setSelectedQuarter(null)} style={{ background: "none", border: "none", color: "#8a9bb0", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
                </div>
                {[
                  ["Type", selectedQuarter.type],
                  ["Category", selectedQuarter.category],
                  ["Block", selectedQuarter.block],
                  ["Floor", selectedQuarter.floor],
                  ["Status", selectedQuarter.status],
                  ["Eligibility", selectedQuarter.eligibility],
                  ["Occupied By", selectedQuarter.occupied_by || "—"],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid rgba(30,58,95,0.5)" }}>
                    <span style={{ color: "#8a9bb0", fontSize: "0.85rem" }}>{l}</span>
                    <span style={{ color: l === "Status" ? (v === "vacant" ? "#2ecc71" : "#e74c3c") : "#f8f9fa", fontWeight: 600, fontSize: "0.9rem" }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
            {selectedQuarter && <div onClick={() => setSelectedQuarter(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999 }} />}
            <div className="card" style={{ padding: "2rem" }}>
              <QuarterMap quarters={quarters} onQuarterClick={setSelectedQuarter} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
