import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const FIELDS = [
  { name: "employee_id", label: "Employee ID", type: "text", placeholder: "e.g. EMP001" },
  { name: "name", label: "Full Name", type: "text", placeholder: "As per service records" },
  { name: "email", label: "Email Address", type: "email", placeholder: "official@dvcbtps.in" },
  { name: "mobile", label: "Mobile Number", type: "tel", placeholder: "10-digit number" },
  { name: "designation", label: "Designation", type: "text", placeholder: "e.g. Junior Engineer" },
  { name: "department", label: "Department / Office", type: "text", placeholder: "e.g. Operations" },
  { name: "pay_scale", label: "Pay Scale", type: "text", placeholder: "e.g. Pay Level 7" },
  { name: "grade_pay", label: "Grade Pay", type: "text", placeholder: "e.g. 4600" },
  { name: "dvc_joining_date", label: "Date of Joining DVC", type: "date" },
  { name: "current_station_joining", label: "Date of Present Joining at Station", type: "date" },
  { name: "password", label: "Password", type: "password", placeholder: "Min 8 characters" },
  { name: "confirm_password", label: "Confirm Password", type: "password", placeholder: "Repeat password" },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ marital_status: "Unmarried" });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) { toast.error("Passwords do not match"); return; }
    if (form.password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      const { confirm_password, ...data } = form;
      await register(data);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0d1b2a",
      padding: "2rem", display: "flex", justifyContent: "center"
    }}>
      <div style={{ width: "100%", maxWidth: "700px", paddingTop: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: "2.5rem", letterSpacing: "3px", color: "#f8f9fa" }}>
            EMPLOYEE <span style={{ color: "#f0a500" }}>REGISTRATION</span>
          </h1>
          <p style={{ color: "#8a9bb0" }}>DVC BTPS · Quarter Allotment Portal</p>
        </div>

        <div className="card" style={{ padding: "2.5rem" }}>
          <form onSubmit={submit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {FIELDS.map(f => (
                <div key={f.name} style={{ gridColumn: f.name === "name" || f.name === "email" ? "1 / -1" : "auto" }}>
                  <label>{f.label}</label>
                  <input className="input-field" name={f.name} type={f.type}
                    placeholder={f.placeholder} onChange={handle} required />
                </div>
              ))}
              <div>
                <label>Marital Status</label>
                <select className="input-field" name="marital_status" onChange={handle} value={form.marital_status}>
                  <option>Unmarried</option>
                  <option>Married</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <button className="btn-primary" type="submit" disabled={loading}
                style={{ width: "100%", fontSize: "1rem", padding: "14px", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Registering..." : "Register Account →"}
              </button>
            </div>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <span style={{ color: "#8a9bb0", fontSize: "0.9rem" }}>Already registered? </span>
            <Link to="/login" style={{ color: "#f0a500", fontWeight: 600, fontSize: "0.9rem" }}>Login Here</Link>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link to="/" style={{ color: "#8a9bb0", fontSize: "0.85rem", textDecoration: "none" }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
