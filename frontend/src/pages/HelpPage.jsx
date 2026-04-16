import React, { useState } from "react";
import Navbar from "../components/Navbar";

const FAQS = [
  { q: "Who is eligible to apply for quarter allotment?", a: "All permanent employees of DVC BTPS are eligible to apply. The type of quarter allotted depends on your designation, pay scale, and slab entry date." },
  { q: "How do I register on the portal?", a: "Click 'Register' on the Login page and fill in your Employee ID, name, email, designation, department, pay details, and create a password. Your details must match DVC service records." },
  { q: "Can I save my application midway?", a: "Yes. Click 'Save Draft' at any time in the application form. Your data is saved and auto-loaded next time you log in." },
  { q: "What documents are needed for SC/ST applicants?", a: "SC/ST applicants must submit documentary proof of their category. The portal requires you to indicate that proof has been enclosed with your physical submission to the Housing Committee." },
  { q: "How long does the allotment process take?", a: "The Housing Committee reviews applications based on seniority and availability. Typical processing time is 15–30 working days after submission." },
  { q: "What if both husband and wife work at BTPS?", a: "If your spouse is already allotted quarters at BTPS, you must declare this in the application. Dual allotment is generally not permitted." },
  { q: "Can I express preference for a specific quarter?", a: "Yes. You can specify a preferred block or quarter type in the form. Note: failing to take occupation of your preferred quarter if allotted means you forfeit claims for one year." },
  { q: "How do I track my application status?", a: "Log in to the portal and click 'Track Application' from the dashboard or navigation bar. You will see real-time status: Pending, Approved, or Rejected." },
  { q: "What happens after my application is approved?", a: "You will see your allotted quarter number in the Track Application view. You must take occupation within the stipulated period. Contact the Housing Committee for key handover." },
  { q: "Who is the Admin of this portal?", a: "The portal is administered by the DVC BTPS Housing Committee Secretary. For admin-related issues, contact the Estate / Housing Office." },
];

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: "1px solid rgba(240,165,0,0.15)", borderRadius: "10px", marginBottom: "0.75rem",
      overflow: "hidden", transition: "all 0.3s"
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", padding: "1.2rem 1.5rem", background: open ? "rgba(240,165,0,0.08)" : "rgba(13,27,42,0.5)",
        border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
        textAlign: "left"
      }}>
        <span style={{ fontFamily: "Rajdhani", fontWeight: 600, color: "#f8f9fa", fontSize: "1rem" }}>{q}</span>
        <span style={{ color: "#f0a500", fontSize: "1.2rem", transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
      </button>
      {open && (
        <div style={{ padding: "1rem 1.5rem 1.5rem", background: "rgba(13,27,42,0.3)" }}>
          <p style={{ color: "#b0c4de", lineHeight: 1.8, fontSize: "0.9rem" }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0d1b2a" }}>
      <Navbar />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "100px 2rem 3rem" }}>
        <h1 style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: "2.5rem", letterSpacing: "3px", color: "#f8f9fa", marginBottom: "0.5rem" }}>
          HELP & <span style={{ color: "#f0a500" }}>FAQ</span>
        </h1>
        <p style={{ color: "#8a9bb0", marginBottom: "2.5rem" }}>Frequently asked questions about the DVC BTPS Quarter Allotment Portal</p>
        {FAQS.map((f, i) => <FAQ key={i} q={f.q} a={f.a} />)}

        <div className="card" style={{ padding: "2rem", marginTop: "2rem", textAlign: "center" }}>
          <h3 style={{ fontFamily: "Rajdhani", fontWeight: 700, color: "#f0a500", marginBottom: "0.75rem" }}>
            Still have questions?
          </h3>
          <p style={{ color: "#b0c4de", marginBottom: "1.5rem" }}>
            Contact the DVC BTPS Housing Committee or visit the Estate Office during working hours.
          </p>
          <a href="/contact" style={{ textDecoration: "none" }}>
            <button className="btn-secondary">Contact Housing Committee</button>
          </a>
        </div>
      </div>
    </div>
  );
}
