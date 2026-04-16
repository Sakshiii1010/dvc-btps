import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DVCLogo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
    <div style={{
      width: 48, height: 48,
      background: "linear-gradient(135deg, #f0a500, #e09400)",
      borderRadius: "8px",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Bebas Neue, sans-serif", fontSize: "1.1rem",
      color: "#0d1b2a", fontWeight: "700", letterSpacing: "1px"
    }}>DVC</div>
    <div>
      <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#f0a500", lineHeight: 1.1 }}>DAMODAR VALLEY</div>
      <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "0.75rem", color: "#8a9bb0", letterSpacing: "2px", textTransform: "uppercase" }}>BTPS · BOKARO</div>
    </div>
  </div>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = user
    ? user.role === "admin"
      ? [{ to: "/admin", label: "Dashboard" }]
      : [
          { to: "/dashboard", label: "Dashboard" },
          { to: "/apply", label: "Apply" },
          { to: "/track", label: "Track" },
          { to: "/contact", label: "Contact" },
          { to: "/help", label: "Help" },
        ]
    : [
        { to: "/", label: "Home" },
        { to: "/contact", label: "Contact" },
        { to: "/help", label: "Help" },
      ];

  const navStyle = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
    background: "rgba(13, 27, 42, 0.95)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(240, 165, 0, 0.2)",
    padding: "0 2rem",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    height: "70px",
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={{ textDecoration: "none" }}><DVCLogo /></Link>

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        {navLinks.map(link => (
          <Link key={link.to} to={link.to} style={{
            textDecoration: "none",
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 600,
            fontSize: "0.95rem",
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: isActive(link.to) ? "#f0a500" : "#8a9bb0",
            borderBottom: isActive(link.to) ? "2px solid #f0a500" : "2px solid transparent",
            paddingBottom: "2px",
            transition: "all 0.2s",
          }}>{link.label}</Link>
        ))}

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "#f0a500", fontFamily: "Rajdhani", fontWeight: 600, fontSize: "0.9rem" }}>
              {user.name?.split(" ")[0]}
            </span>
            <button onClick={() => { logout(); navigate("/"); }} style={{
              background: "rgba(192,57,43,0.2)", color: "#e74c3c",
              border: "1px solid rgba(192,57,43,0.4)", padding: "6px 16px",
              borderRadius: "6px", cursor: "pointer", fontFamily: "Rajdhani",
              fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase"
            }}>Logout</button>
          </div>
        ) : (
          <Link to="/login">
            <button className="btn-primary" style={{ padding: "8px 20px", fontSize: "0.85rem" }}>Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
}
