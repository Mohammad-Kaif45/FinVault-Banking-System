import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // 👈 Import the messenger

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
      // 1. Send the data to the Backend
      // (Make sure your Gateway is running on port 8080!)
      const response = await axios.post("http://localhost:8080/users/login", formData);

      // 2. If successful, the backend gives us a Token
      const token = response.data;
      console.log("Token Received:", token);

      // 3. Save the Token in the Browser's "Pocket" (LocalStorage)
      localStorage.setItem("token", token);

      // 4. Send the user to the Dashboard
      alert("Login Successful!");
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
    </div>
  );
}

export default Login;