import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook for navigation

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Button Works! Email is: " + formData.email);
    console.log("Login Data Submitted:", formData);
    // Tomorrow we will connect this to the Backend!
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
    </div>
  );
}

export default Login;