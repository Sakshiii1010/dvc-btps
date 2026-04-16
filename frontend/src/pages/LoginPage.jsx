import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ employee_id: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.employee_id, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse at center, rgba(42,82,152,0.25) 0%, #0d1b2a 70%)",
      padding: "2rem"
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            width: 64, height: 64, background: "linear-gradient(135deg,#f0a500,#e09400)",
            borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem", fontFamily: "Bebas Neue,sans-serif", fontSize: "1.4rem",
            color: "#0d1b2a", fontWeight: 700
          }}>DVC</div>
          <h1 style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: "2.2rem", letterSpacing: "3px", color: "#f8f9fa" }}>
            EMPLOYEE LOGIN
          </h1>
          <p style={{ color: "#8a9bb0", fontSize: "0.9rem", marginTop: "0.4rem" }}>DVC BTPS · Quarter Allotment Portal</p>
        </div>

        <div className="card" style={{ padding: "2.5rem" }}>
          <form onSubmit={submit}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label>Employee ID</label>
              <input className="input-field" name="employee_id" placeholder="e.g. EMP001"
                value={form.employee_id} onChange={handle} required />
            </div>
            <div style={{ marginBottom: "2rem" }}>
              <label>Password</label>
              <input className="input-field" name="password" type="password" placeholder="Enter password"
                value={form.password} onChange={handle} required />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}
              style={{ width: "100%", fontSize: "1rem", padding: "14px", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Signing In..." : "Sign In →"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <span style={{ color: "#8a9bb0", fontSize: "0.9rem" }}>New employee? </span>
            <Link to="/register" style={{ color: "#f0a500", fontWeight: 600, fontSize: "0.9rem" }}>Register Here</Link>
          </div>
          <div style={{ textAlign: "center", marginTop: "0.75rem" }}>
            <Link to="/admin/login" style={{ color: "#8a9bb0", fontSize: "0.8rem" }}>Admin Login →</Link>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link to="/" style={{ color: "#8a9bb0", fontSize: "0.85rem", textDecoration: "none" }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
