import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  // 👇 NEW: State to track if the password should be visible
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error if user starts typing again
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🚀 Pointing to User Service on 8082
      const response = await axios.post("http://localhost:8082/users/login", formData);

      // Store credentials securely in the browser
      if (response.data.token) localStorage.setItem("token", response.data.token);
      if (response.data.userId) localStorage.setItem("userId", response.data.userId);
      if (response.data.name) localStorage.setItem("name", response.data.name);

      // Route to dashboard
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid credentials. Please verify your email and password.");
    }
  };

  const theme = { bg: "#F3F4F6", navy: "#0f172a", white: "#FFFFFF", primary: "#2563EB", textMain: "#1F2937", textSec: "#6B7280", border: "#E5E7EB", danger: "#EF4444" };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "-apple-system, sans-serif", overflow: "hidden", position: "relative" }}>

      <style>
        {`
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .animate-text { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
          .watermark-bg { position: absolute; font-size: 110px; font-weight: 900; color: rgba(0,0,0,0.03); z-index: 0; transform: rotate(-10deg); white-space: nowrap; user-select: none; }
          .login-card { transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease; position: relative; z-index: 10; }
          .login-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
        `}
      </style>

      {/* LEFT SIDE: Branding matching the Register page */}
      <div style={{ flex: "0.4", backgroundColor: theme.navy, color: "white", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px" }}>
        <h1 className="animate-text" style={{ fontSize: "24px", fontWeight: "600", letterSpacing: "1px", marginBottom: "60px", animationDelay: "0.2s" }}>FINVAULT <span style={{ opacity: 0.5 }}>ENTERPRISE</span></h1>
        <h2 className="animate-text" style={{ fontSize: "36px", fontWeight: "700", marginBottom: "20px", animationDelay: "0.5s" }}>Welcome Back.</h2>
        <p className="animate-text" style={{ color: "#94a3b8", fontSize: "16px", lineHeight: "1.6", animationDelay: "0.8s" }}>Access your secure enterprise dashboard to manage liquidity, execute transfers, and monitor institutional assets.</p>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div style={{ flex: "0.6", backgroundColor: theme.bg, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
        <div className="watermark-bg" style={{ top: "5%", left: "5%" }}>AUTHENTICATION</div>
        <div className="watermark-bg" style={{ bottom: "10%", right: "5%" }}>SECURE ACCESS</div>

        <div className="login-card" style={{ width: "100%", maxWidth: "420px", backgroundColor: theme.white, padding: "48px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
          <h3 style={{ color: theme.textMain, fontSize: "22px", fontWeight: "700", marginBottom: "8px", textAlign: "center" }}>Sign In</h3>
          <p style={{ color: theme.textSec, fontSize: "14px", marginBottom: "32px", textAlign: "center" }}>Enter your credentials to access your vault.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>Official Email</label>
              <input type="email" name="email" onChange={handleChange} required style={{ width: "100%", padding: "12px", borderRadius: "6px", border: `1px solid ${theme.border}`, backgroundColor: "#F9FAFB", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>Secure Password</label>

              {/* 👇 Relative container to hold input + eye button */}
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "12px", paddingRight: "40px", borderRadius: "6px", border: `1px solid ${error ? theme.danger : theme.border}`, backgroundColor: "#F9FAFB", transition: "border 0.3s", boxSizing: "border-box" }}
                />

                {/* 👇 The Eye Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: theme.textSec
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </button>
              </div>

              {/* Error Message for Invalid Credentials */}
              {error && (
                <div style={{ color: theme.danger, fontSize: "12px", marginTop: "8px", display: "flex", alignItems: "center", gap: "4px", fontWeight: "500" }}>
                  <span>⚠️</span> {error}
                </div>
              )}
            </div>

            <button type="submit" style={{ width: "100%", backgroundColor: theme.primary, color: "white", padding: "14px", borderRadius: "6px", border: "none", fontWeight: "600", cursor: "pointer" }}>Sign In</button>
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "13px" }}>
            New to FinVault? <a href="/register" style={{ color: theme.primary, textDecoration: "none" }}>Register Identity</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;