import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER"
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/users/register", formData);
      alert("Corporate Identity Created. Please sign in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration Failed:", error);
      alert("Access Denied: Email already registered or system error.");
    }
  };

  // --- CORPORATE THEME ---
  const theme = {
    bg: "#F3F4F6",
    navy: "#0f172a", // Darker Slate Navy
    white: "#FFFFFF",
    primary: "#2563EB",
    textMain: "#1F2937",
    textSec: "#6B7280",
    border: "#E5E7EB"
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", overflow: "hidden" }}>

      {/* 👇 INTERACTIVE STYLES */}
      <style>
        {`
          .watermark-bg {
            position: absolute;
            font-size: 110px;
            font-weight: 900;
            color: rgba(0,0,0,0.03);
            white-space: nowrap;
            user-select: none;
            z-index: 0;
            transform: rotate(-10deg);
          }
          .reg-card {
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
            position: relative;
            z-index: 10;
          }
          .reg-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          }
        `}
      </style>

      {/* 1. LEFT SIDE: CORPORATE BRANDING */}
      <div style={{
        flex: "0.4",
        backgroundColor: theme.navy,
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px",
        position: "relative"
      }}>
        <h1 style={{ fontSize: "24px", fontWeight: "600", letterSpacing: "1px", marginBottom: "60px", opacity: 0.9 }}>
          FINVAULT <span style={{ opacity: 0.5, fontWeight: "300" }}>ENTERPRISE</span>
        </h1>
        <h2 style={{ fontSize: "36px", fontWeight: "700", lineHeight: "1.2", marginBottom: "20px" }}>
          Join the Network.
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "16px", lineHeight: "1.6" }}>
          Establish your global banking identity. Access institutional-grade security and manage your assets with precision.
        </p>
      </div>

      {/* 2. RIGHT SIDE: FORM AREA */}
      <div style={{
        flex: "0.6",
        backgroundColor: theme.bg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
      }}>

        {/* BACKGROUND WATERMARKS */}
        <div className="watermark-bg" style={{ top: "5%", left: "5%" }}>REGISTRATION</div>
        <div className="watermark-bg" style={{ bottom: "10%", right: "5%" }}>COMPLIANCE</div>

        <div className="reg-card" style={{
          width: "100%", maxWidth: "420px",
          backgroundColor: theme.white,
          padding: "48px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          border: `1px solid ${theme.border}`
        }}>

          <h3 style={{ color: theme.textMain, fontSize: "22px", fontWeight: "700", marginBottom: "8px", textAlign: "center" }}>
            Welcome Back
          </h3>
          <p style={{ color: theme.textSec, fontSize: "14px", marginBottom: "32px", textAlign: "center" }}>
            Create your credentials to get started.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: theme.textMain, marginBottom: "8px" }}>Full Name</label>
              <input type="text" name="name" onChange={handleChange} required
                style={{ width: "100%", padding: "12px", borderRadius: "6px", border: `1px solid ${theme.border}`, backgroundColor: "#F9FAFB" }} />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: theme.textMain, marginBottom: "8px" }}>Official Email</label>
              <input type="email" name="email" onChange={handleChange} required
                style={{ width: "100%", padding: "12px", borderRadius: "6px", border: `1px solid ${theme.border}`, backgroundColor: "#F9FAFB" }} />
            </div>

            <div style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: theme.textMain, marginBottom: "8px" }}>Secure Password</label>
              <input type="password" name="password" onChange={handleChange} required
                style={{ width: "100%", padding: "12px", borderRadius: "6px", border: `1px solid ${theme.border}`, backgroundColor: "#F9FAFB" }} />
            </div>

            <button type="submit"
              style={{ width: "100%", backgroundColor: theme.primary, color: "white", padding: "14px", borderRadius: "6px", border: "none", fontWeight: "600", cursor: "pointer", transition: "0.2s" }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#1D4ED8"}
              onMouseOut={(e) => e.target.style.backgroundColor = theme.primary}
            >
              Register Identity
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: theme.textSec }}>
            Already registered? <a href="/login" style={{ color: theme.primary, textDecoration: "none", fontWeight: "500" }}>Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;