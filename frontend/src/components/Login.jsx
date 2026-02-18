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
      alert("Invalid Email or Password. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif", backgroundColor: "#f4f7f6" }}>

      {/* 👇 CSS ANIMATIONS & HOVER EFFECTS */}
      <style>
        {`
          /* 1. Left Side Text Animation */
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-text {
            animation: fadeInUp 0.8s ease-out forwards;
            opacity: 0;
          }

          /* 2. Right Side Box Hover Effect (The Zoom) */
          .login-box {
            transition: transform 0.4s ease, box-shadow 0.4s ease; /* Smooth Speed */
            background-color: white;
            border: 1px solid #e0e0e0;
            padding: 40px;
            border-radius: 12px;
            width: 100%;
            max-width: 400px;
            box-shadow: 0px 10px 30px rgba(0,0,0,0.05);
          }

          /* When mouse moves over the box */
          .login-box:hover {
            transform: scale(1.03); /* Zooms in slightly */
            box-shadow: 0px 20px 60px rgba(0,0,0,0.15); /* Shadow grows */
          }
        `}
      </style>

      {/* 🟢 LEFT SIDE: Branding */}
      <div style={{
        flex: "1",
        background: "linear-gradient(135deg, #0061f2 0%, #00ba88 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px"
      }}>
        <h1 className="animate-text" style={{ fontSize: "56px", marginBottom: "10px", animationDelay: "0.2s" }}>
          FinVault 🏦
        </h1>
        <h2 className="animate-text" style={{ fontWeight: "300", marginBottom: "30px", animationDelay: "0.5s" }}>
          Secure Banking for Everyone.
        </h2>
        <div className="animate-text" style={{ fontSize: "18px", lineHeight: "1.8", opacity: "0", animationDelay: "0.8s" }}>
          <p>✅ <strong>Instant Transfers:</strong> Send money in seconds.</p>
          <p>✅ <strong>Secure Accounts:</strong> Industry-standard protection.</p>
          <p>✅ <strong>24/7 Access:</strong> Manage your wealth anytime.</p>
        </div>
        <p className="animate-text" style={{ marginTop: "40px", fontSize: "16px", opacity: "0", animationDelay: "1.2s", fontStyle: "italic" }}>
          "Join over 10,000 users trusting FinVault today."
        </p>
      </div>

      {/* ⚪ RIGHT SIDE: Login Form (Now with Hover Effect) */}
      <div style={{
        flex: "1",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff"
      }}>

        {/* 👇 ADDED CLASS NAME "login-box" HERE */}
        <div className="login-box">
          <h2 style={{ color: "#333", textAlign: "center", marginBottom: "5px" }}>Welcome Back</h2>
          <p style={{ color: "#666", textAlign: "center", marginBottom: "30px" }}>Please enter your details to sign in.</p>

          <form onSubmit={handleSubmit}>
            <label style={{ fontWeight: "bold", color: "#444", fontSize: "14px" }}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="admin@test.com"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "12px", margin: "8px 0 20px 0", border: "1px solid #ccc", borderRadius: "6px" }}
            />

            <label style={{ fontWeight: "bold", color: "#444", fontSize: "14px" }}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "12px", margin: "8px 0 20px 0", border: "1px solid #ccc", borderRadius: "6px" }}
            />

            <button
              type="submit"
              style={{ width: "100%", backgroundColor: "#0061f2", color: "white", padding: "14px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "16px", fontWeight: "bold", transition: "0.3s" }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#0051c9"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#0061f2"}
            >
              Sign In
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
            Don't have an account? <a href="/register" style={{ color: "#0061f2", fontWeight: "bold", textDecoration: "none" }}>Sign up</a>
          </p>
        </div>

        <p style={{ marginTop: "30px", color: "#aaa", fontSize: "12px" }}>© 2026 FinVault Banking System.</p>
      </div>

    </div>
  );
}

export default Login;