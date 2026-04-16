import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(form.username, form.password);
      toast.success("Admin access granted");
      navigate("/admin");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Invalid admin credentials");
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse at center, rgba(192,57,43,0.15) 0%, #0d1b2a 70%)",
      padding: "2rem"
    }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: 60, height: 60, background: "linear-gradient(135deg,#c0392b,#a93226)",
            borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem", fontSize: "1.5rem"
          }}>🔐</div>
          <h1 style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: "2rem", letterSpacing: "3px", color: "#f8f9fa" }}>
            ADMIN PORTAL
          </h1>
          <p style={{ color: "#8a9bb0", fontSize: "0.9rem" }}>DVC BTPS · Housing Committee Access</p>
        </div>

        <div className="card" style={{ padding: "2.5rem", border: "1px solid rgba(192,57,43,0.3)" }}>
          <form onSubmit={submit}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label>Admin Username</label>
              <input className="input-field" name="username" placeholder="admin"
                value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
            </div>
            <div style={{ marginBottom: "2rem" }}>
              <label>Password</label>
              <input className="input-field" name="password" type="password" placeholder="Admin password"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "14px", background: "linear-gradient(135deg,#c0392b,#a93226)",
              color: "#fff", border: "none", borderRadius: "8px", fontFamily: "Rajdhani,sans-serif",
              fontWeight: 700, fontSize: "1rem", letterSpacing: "1px", cursor: "pointer",
              textTransform: "uppercase", opacity: loading ? 0.7 : 1
            }}>
              {loading ? "Authenticating..." : "🔐 Secure Login"}
            </button>
          </form>
        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link to="/login" style={{ color: "#8a9bb0", fontSize: "0.85rem", textDecoration: "none" }}>← Employee Login</Link>
        </div>
      </div>
    </div>
  );
}
