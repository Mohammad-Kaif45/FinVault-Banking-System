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
      // 1. Send Creds to Backend
      const response = await axios.post("http://localhost:8080/users/login", formData);

      // 2. Extract Token + User Details
      const { token, userId, name } = response.data;

      console.log("Login Success:", response.data);

      // 3. Save EVERYTHING to LocalStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("name", name);

      // 4. Redirect with a personal welcome
      alert("Login Successful! Welcome " + name);
      navigate("/dashboard");

    } catch (error) {
      console.error("Login Failed:", error);
      alert("Login Failed! Check your email or password.");
    }
  };

  return (
    <div className="login-container" style={{ padding: "50px", textAlign: "center" }}>
      <h2>🔐 Login to FinVault</h2>
      <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "left" }}>

        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label><br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ padding: "8px", width: "250px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label><br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ padding: "8px", width: "250px" }}
          />
        </div>

        <button type="submit" style={{ padding: "10px 20px", cursor: "pointer", width: "100%" }}>
          Login
        </button>
      </form>

      {/* 👇 ADDED THIS LINK FOR NEW USERS 👇 */}
      <p style={{ marginTop: "20px" }}>
        Don't have an account? <a href="/register" style={{ color: "blue", fontWeight: "bold" }}>Sign up here</a>
      </p>

    </div>
  );
}

export default Login;