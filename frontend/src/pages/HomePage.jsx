import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const STATS = [
  { value: "630 MW", label: "Installed Capacity" },
  { value: "1986",   label: "Commissioned" },
  { value: "3",      label: "Generating Units" },
  { value: "500 MW", label: "New BTPS-A Unit" },
];

const FEATURES = [
  {
    icon: "🏠", title: "Apply for Quarter",
    desc: "Submit your family or bachelor accommodation request online — no paperwork needed.",
    link: "/apply", cta: "Apply Now"
  },
  {
    icon: "📊", title: "Track Application",
    desc: "Real-time status updates for your allotment request — Pending, Approved, or Rejected.",
    link: "/track", cta: "Track Now"
  },
  {
    icon: "📞", title: "Contact Us",
    desc: "Reach the Housing Committee or DVC BTPS administration directly.",
    link: "/contact", cta: "Contact"
  },
  {
    icon: "❓", title: "Help & FAQ",
    desc: "Find answers to common questions about the quarter allotment process.",
    link: "/help", cta: "Get Help"
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#0d1b2a" }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: "100vh",
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(42,82,152,0.3) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(240,165,0,0.1) 0%, transparent 50%),
          #0d1b2a
        `,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        /* FIX: use padding-bottom large enough so stats bar never overlaps buttons */
        padding: "90px 2rem 180px",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "linear-gradient(rgba(240,165,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(240,165,0,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }} />

        {/* Animated glow line */}
        <div style={{
          position: "absolute", left: 0, right: 0, top: "50%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(240,165,0,0.3), transparent)",
          animation: "pulse 3s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        {/* ── Main content ── */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "900px", width: "100%" }}>

          {/* DVC badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: "rgba(240,165,0,0.1)", border: "1px solid rgba(240,165,0,0.3)",
            borderRadius: "30px", padding: "8px 20px", marginBottom: "2rem",
          }}>
            <div style={{
              width: 32, height: 32,
              background: "linear-gradient(135deg, #f0a500, #e09400)",
              borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Bebas Neue, sans-serif", fontSize: "0.8rem", color: "#0d1b2a",
            }}>DVC</div>
            <span style={{ fontFamily: "Rajdhani", fontWeight: 600, color: "#f0a500", letterSpacing: "2px", fontSize: "0.85rem" }}>
              DAMODAR VALLEY CORPORATION
            </span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: "clamp(3rem, 8vw, 7rem)",
            lineHeight: 0.9, letterSpacing: "4px",
            marginBottom: "1rem",
          }}>
            <span style={{ color: "#f8f9fa" }}>BOKARO</span><br />
            <span style={{ color: "#f0a500" }}>THERMAL</span><br />
            <span style={{ color: "#f8f9fa" }}>POWER STATION</span>
          </h1>

          <div style={{ height: "3px", background: "linear-gradient(90deg, transparent, #f0a500, transparent)", marginBottom: "1.5rem" }} />

          <p style={{
            fontSize: "1.15rem", color: "#8a9bb0",
            maxWidth: "600px", margin: "0 auto 2.5rem",
            lineHeight: 1.7, fontWeight: 300,
          }}>
            Digital Quarter Allotment System — empowering DVC BTPS employees with seamless, paperless housing applications.
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "0" }}>
            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="btn-primary"
                style={{ fontSize: "1rem", padding: "14px 36px" }}
              >
                Go to Dashboard →
              </button>
            ) : (
              <>
                <Link to="/apply" style={{ textDecoration: "none" }}>
                  <button className="btn-primary" style={{ fontSize: "1rem", padding: "14px 36px" }}>
                    Apply for Quarter
                  </button>
                </Link>
                <Link to="/track" style={{ textDecoration: "none" }}>
                  <button className="btn-secondary" style={{ fontSize: "1rem", padding: "14px 36px" }}>
                    Track Application
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* ── Stats bar — FIXED: absolutely positioned but with enough bottom padding above ── */}
        <div style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 4rem)",
          maxWidth: "800px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          zIndex: 2,
        }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              textAlign: "center", padding: "1rem",
              background: "rgba(30,58,95,0.5)",
              backdropFilter: "blur(8px)",
              borderRadius: "8px",
              border: "1px solid rgba(240,165,0,0.15)",
            }}>
              <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.8rem", color: "#f0a500", letterSpacing: "2px" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#8a9bb0", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 2rem", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "3rem", color: "#f0a500", letterSpacing: "3px", marginBottom: "2rem" }}>
          About DVC BTPS
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
          <div>
            <p style={{ color: "#b0c4de", lineHeight: 1.8, marginBottom: "1.2rem", fontSize: "1rem" }}>
              Bokaro Thermal Power Station B (BTPS-B) is a coal-based power station operated by the Damodar Valley Corporation (DVC),
              located in Bokaro District, Jharkhand — 44 km from Bokaro Steel City and 55 km from Dhanbad.
            </p>
            <p style={{ color: "#b0c4de", lineHeight: 1.8, marginBottom: "1.2rem", fontSize: "1rem" }}>
              Situated on the banks of the Konar River on the Chota Nagpur Plateau, the station has an installed capacity of 630 MW
              across three units, with the first unit commissioned in March 1986. The entire power generated is supplied to the DVC network.
            </p>
            <p style={{ color: "#b0c4de", lineHeight: 1.8, fontSize: "1rem" }}>
              A new 500 MW unit was commissioned by BHEL in May 2016 at the adjoining BTPS-A site, replacing the earlier decommissioned
              Bokaro 'A' station — the very first thermal plant in the DVC system, originally commissioned in 1953.
              Boilers are of ABL make; turbines and generators are of BHEL make.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[
              { label: "Location",      value: "Bokaro Thermal, Jharkhand" },
              { label: "Owner",         value: "Damodar Valley Corp."       },
              { label: "Primary Fuel",  value: "Coal"                        },
              { label: "River",         value: "Konar River"                 },
              { label: "Turbines",      value: "BHEL Make"                   },
              { label: "PIN",           value: "829107"                      },
            ].map(item => (
              <div key={item.label} style={{
                padding: "1rem",
                background: "rgba(30,58,95,0.3)",
                borderRadius: "8px",
                border: "1px solid rgba(240,165,0,0.1)",
              }}>
                <div style={{ fontSize: "0.75rem", color: "#f0a500", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, marginBottom: "4px" }}>{item.label}</div>
                <div style={{ color: "#f8f9fa", fontWeight: 500, fontSize: "0.95rem" }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK ACCESS ─────────────────────────────────────────────────── */}
      <section style={{
        padding: "60px 2rem",
        background: "rgba(30,58,95,0.15)",
        borderTop: "1px solid rgba(240,165,0,0.1)",
        borderBottom: "1px solid rgba(240,165,0,0.1)",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "Bebas Neue, sans-serif", fontSize: "3rem", color: "#f8f9fa",
            letterSpacing: "3px", textAlign: "center", marginBottom: "3rem",
          }}>
            QUICK <span style={{ color: "#f0a500" }}>ACCESS</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {FEATURES.map(f => (
              <div
                key={f.title}
                style={{
                  padding: "2rem",
                  background: "rgba(13,27,42,0.6)",
                  border: "1px solid rgba(240,165,0,0.15)",
                  borderRadius: "12px",
                  transition: "all 0.3s",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(240,165,0,0.5)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(240,165,0,0.15)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{f.icon}</div>
                <h3 style={{ fontFamily: "Rajdhani", fontWeight: 700, fontSize: "1.2rem", color: "#f0a500", marginBottom: "0.5rem" }}>{f.title}</h3>
                <p style={{ color: "#8a9bb0", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem", flex: 1 }}>{f.desc}</p>
                <Link to={f.link} style={{ textDecoration: "none" }}>
                  <button className="btn-secondary" style={{ fontSize: "0.85rem", padding: "8px 20px" }}>{f.cta}</button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GENERATION UNITS TABLE ───────────────────────────────────────── */}
      <section style={{ padding: "60px 2rem", maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2.5rem", color: "#f0a500", letterSpacing: "3px", marginBottom: "2rem" }}>
          Generation Units
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(240,165,0,0.1)" }}>
                {["Unit", "Capacity (MW)", "Commissioned", "Status"].map(h => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left",
                    fontFamily: "Rajdhani", fontWeight: 700, color: "#f0a500",
                    letterSpacing: "1px", fontSize: "0.85rem", textTransform: "uppercase",
                    borderBottom: "1px solid rgba(240,165,0,0.2)",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Unit 1",     "210", "March 1986",    "Decommissioned"],
                ["Unit 2",     "210", "November 1990", "Decommissioned"],
                ["Unit 3",     "210", "August 1993",   "Decommissioned"],
                ["BTPS-A New", "500", "May 2016",      "Operational"   ],
              ].map(([u, c, d, s]) => (
                <tr key={u} style={{ borderBottom: "1px solid rgba(30,58,95,0.5)" }}>
                  <td style={{ padding: "12px 16px", color: "#f8f9fa", fontWeight: 500 }}>{u}</td>
                  <td style={{ padding: "12px 16px", color: "#b0c4de" }}>{c}</td>
                  <td style={{ padding: "12px 16px", color: "#b0c4de" }}>{d}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600,
                      background: s === "Operational" ? "rgba(46,204,113,0.15)" : "rgba(192,57,43,0.15)",
                      color:      s === "Operational" ? "#2ecc71" : "#e74c3c",
                    }}>{s}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{
        background: "rgba(13,27,42,0.9)",
        borderTop: "1px solid rgba(240,165,0,0.2)",
        padding: "2rem", textAlign: "center",
      }}>
        <p style={{ color: "#8a9bb0", fontSize: "0.85rem" }}>
          © 2024 Damodar Valley Corporation · Bokaro Thermal Power Station · P.O. Bokaro Thermal, Dist. Bokaro (Jharkhand) – 829107
        </p>
        <p style={{ color: "#f0a500", fontSize: "0.8rem", marginTop: "0.4rem", fontFamily: "Rajdhani", letterSpacing: "1px" }}>
          DIGITAL QUARTER ALLOTMENT SYSTEM
        </p>
      </footer>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        @media (max-width: 600px) {
          /* stack stats 2x2 on small screens */
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  );
}
