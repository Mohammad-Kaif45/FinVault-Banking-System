import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/users/login", formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("name", response.data.name);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      alert("Access Denied: Invalid Credentials.");
    }
  };

  const theme = { bg: "#F3F4F6", navy: "#0f172a", white: "#FFFFFF", primary: "#2563EB", textMain: "#1F2937", textSec: "#6B7280", border: "#E5E7EB" };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "-apple-system, sans-serif", position: "relative" }}>

      {showSuccess && (
        <div style={{ position: "fixed", top: "40px", right: "15%", backgroundColor: "#ffffff", border: "1px solid #10b981", color: "#000000", padding: "12px 24px", borderRadius: "8px", zIndex: 1000, display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: "14px" }}>
          Login successful. Accessing dashboard ✅
        </div>
      )}

      <style>{`.login-card { transition: transform 0.4s ease, box-shadow 0.4s ease; } .login-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }`}</style>

      {/* LEFT SIDE */}
      <div style={{ flex: "0.4", backgroundColor: theme.navy, color: "white", padding: "60px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "600", letterSpacing: "1px", marginBottom: "60px", opacity: 0.9 }}>FINVAULT <span style={{ opacity: 0.5 }}>ENTERPRISE</span></h1>
          <h2 style={{ fontSize: "36px", fontWeight: "700", lineHeight: "1.2", marginBottom: "20px" }}>Secure Client Access.</h2>
          <p style={{ color: "#94a3b8", fontSize: "16px", lineHeight: "1.6" }}>Welcome to the FinVault secure banking portal.</p>
        </div>
        <div style={{ fontSize: "12px", color: "#64748b" }}>
          <p style={{ marginBottom: "10px" }}>🔒 256-Bit SSL Encryption</p>
          <p>© 2026 FinVault Banking Group. All rights reserved.</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ flex: "0.6", backgroundColor: theme.bg, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="login-card" style={{ width: "100%", maxWidth: "420px", backgroundColor: theme.white, padding: "48px", borderRadius: "8px", border: `1px solid ${theme.border}`, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <h3 style={{ color: theme.textMain, fontSize: "22px", fontWeight: "700", marginBottom: "8px", textAlign: "center" }}>Welcome Back</h3>
          <p style={{ color: theme.textSec, fontSize: "14px", marginBottom: "32px", textAlign: "center" }}>Enter credentials to access account.</p>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}><label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>Email Address</label><input type="email" name="email" onChange={handleChange} required style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: `1px solid ${theme.border}`, backgroundColor: "#F9FAFB" }} /></div>
            <div style={{ marginBottom: "24px" }}><label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>Password</label><input type="password" name="password" onChange={handleChange} required style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: `1px solid ${theme.border}`, backgroundColor: "#F9FAFB" }} /></div>
            <button type="submit" style={{ width: "100%", backgroundColor: theme.primary, color: "white", padding: "12px", borderRadius: "6px", border: "none", cursor: "pointer" }}>Log In</button>
          </form>
          <div style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: theme.textSec }}>New here? <a href="/register" style={{ color: theme.primary, textDecoration: "none" }}>Create an account</a></div>
        </div>
      </div>
    </div>
  );
}

export default Login;