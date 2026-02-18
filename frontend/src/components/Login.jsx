import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/users/login", formData);
      const { token, userId, name } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("name", name);

      navigate("/dashboard");

    } catch (error) {
      console.error("Login Failed:", error);
      alert("Access Denied: Invalid Credentials.");
    }
  };

  // --- CORPORATE THEME ---
  const theme = {
    bg: "#F3F4F6",          // Light Gray (Same as Dashboard BG)
    navy: "#0f172a",        // 👇 UPDATED: Darker, Deeper Slate (Less Bright)
    white: "#FFFFFF",
    primary: "#2563EB",     // Corporate Blue
    textMain: "#1F2937",    // Dark Gray
    textSec: "#6B7280",     // Light Gray
    border: "#E5E7EB"       // Light Border
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>

      {/* 1. LEFT SIDE: BRANDING (Darker & Professional) */}
      <div style={{
        flex: "0.4",
        backgroundColor: theme.navy, // Uses the new darker color
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px"
      }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "600", letterSpacing: "1px", marginBottom: "60px", opacity: 0.9 }}>
            FINVAULT <span style={{ opacity: 0.5, fontWeight: "300" }}>ENTERPRISE</span>
          </h1>

          <h2 style={{ fontSize: "36px", fontWeight: "700", lineHeight: "1.2", marginBottom: "20px", opacity: 0.95 }}>
            Secure Client Access.
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "16px", lineHeight: "1.6", maxWidth: "400px" }}>
            Welcome to the FinVault secure banking portal. Please log in to manage your corporate accounts, transfers, and assets.
          </p>
        </div>

        <div style={{ fontSize: "12px", color: "#64748b" }}>
          <p style={{ marginBottom: "10px" }}>🔒 256-Bit SSL Encryption</p>
          <p>© 2026 FinVault Banking Group. All rights reserved.</p>
        </div>
      </div>

      {/* 2. RIGHT SIDE: LOGIN FORM */}
      <div style={{
        flex: "0.6",
        backgroundColor: theme.bg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>

        <div style={{
          width: "100%", maxWidth: "420px",
          backgroundColor: theme.white,
          padding: "48px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          border: `1px solid ${theme.border}`
        }}>

          {/* 👇 UPDATED: "Welcome Back" & CENTERED */}
          <h3 style={{
            color: theme.textMain,
            fontSize: "22px",
            fontWeight: "700",
            marginBottom: "8px",
            textAlign: "center" // Centered
          }}>
            Welcome Back
          </h3>

          <p style={{
            color: theme.textSec,
            fontSize: "14px",
            marginBottom: "32px",
            textAlign: "center" // Centered
          }}>
            Enter your credentials to access your account.
          </p>

          <form onSubmit={handleSubmit}>

            {/* EMAIL INPUT */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: theme.textMain, marginBottom: "8px" }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: "6px",
                  border: `1px solid ${theme.border}`, fontSize: "14px", outline: "none",
                  backgroundColor: "#F9FAFB", color: theme.textMain
                }}
                onFocus={(e) => e.target.style.borderColor = theme.primary}
                onBlur={(e) => e.target.style.borderColor = theme.border}
              />
            </div>

            {/* PASSWORD INPUT */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: theme.textMain, marginBottom: "8px" }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: "6px",
                  border: `1px solid ${theme.border}`, fontSize: "14px", outline: "none",
                  backgroundColor: "#F9FAFB", color: theme.textMain
                }}
                onFocus={(e) => e.target.style.borderColor = theme.primary}
                onBlur={(e) => e.target.style.borderColor = theme.border}
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              style={{
                width: "100%", backgroundColor: theme.primary, color: "white",
                padding: "12px", borderRadius: "6px", border: "none",
                fontSize: "14px", fontWeight: "500", cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#1D4ED8"}
              onMouseOut={(e) => e.target.style.backgroundColor = theme.primary}
            >
              Log In
            </button>

          </form>

          {/* SIGN UP LINK */}
          <div style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: theme.textSec }}>
            New to FinVault? <a href="/register" style={{ color: theme.primary, textDecoration: "none", fontWeight: "500" }}>Create an account</a>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;