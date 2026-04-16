import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function ContactPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0d1b2a" }}>
      <Navbar />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "100px 2rem 3rem" }}>
        <h1 style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: "2.5rem", letterSpacing: "3px", color: "#f8f9fa", marginBottom: "0.5rem" }}>
          CONTACT <span style={{ color: "#f0a500" }}>US</span>
        </h1>
        <p style={{ color: "#8a9bb0", marginBottom: "3rem" }}>Reach DVC BTPS Housing Committee and Administration</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
          {[
            { icon: "🏢", title: "DVC BTPS Head Office", lines: ["Damodar Valley Corporation", "Bokaro Thermal Power Station", "P.O. Bokaro Thermal, Dist. Bokaro", "Jharkhand – 829107"] },
            { icon: "🏠", title: "Housing Committee", lines: ["Secretary, Housing Committee", "DVC BTPS, Bokaro Thermal", "For quarter allotment queries", "Office Hours: Mon–Sat, 9AM–5PM"] },
            { icon: "📞", title: "Telephone", lines: ["DVC BTPS Exchange: 06542-XXXXXX", "Housing Office: Ext. XXX", "Emergency: Ext. XXX"] },
            { icon: "🌐", title: "Official Website", lines: ["www.dvcindia.gov.in", "For DVC network information", "Government of India undertaking"] },
          ].map(c => (
            <div key={c.title} className="card" style={{ padding: "1.8rem" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{c.icon}</div>
              <h3 style={{ fontFamily: "Rajdhani", fontWeight: 700, color: "#f0a500", marginBottom: "0.75rem", fontSize: "1.1rem" }}>{c.title}</h3>
              {c.lines.map((l, i) => <p key={i} style={{ color: "#b0c4de", fontSize: "0.9rem", lineHeight: 1.8 }}>{l}</p>)}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
          <h3 style={{ fontFamily: "Rajdhani", fontWeight: 700, color: "#f0a500", marginBottom: "0.75rem" }}>
            For Application-Related Queries
          </h3>
          <p style={{ color: "#b0c4de", marginBottom: "1.5rem" }}>
            For queries about your quarter allotment application status, please use the online portal or visit the Housing Committee office during working hours.
          </p>
          <Link to="/track"><button className="btn-primary">Track My Application</button></Link>
        </div>
      </div>
    </div>
  );
}
