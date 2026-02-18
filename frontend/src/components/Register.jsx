import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER" // Default role
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Send Data to Backend
      await axios.post("http://localhost:8080/users/register", formData);

      // 2. Success!
      alert("Registration Successful! Please Login.");
      navigate("/login"); // Redirect to Login page

    } catch (error) {
      console.error("Registration Failed:", error);
      alert("Registration Failed! Try a different email.");
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h2>📝 Create a FinVault Account</h2>
      <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "left" }}>

        <div style={{ marginBottom: "10px" }}>
          <label>Name:</label><br />
          <input type="text" name="name" onChange={handleChange} required style={{ padding: "8px", width: "250px" }} />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label><br />
          <input type="email" name="email" onChange={handleChange} required style={{ padding: "8px", width: "250px" }} />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label><br />
          <input type="password" name="password" onChange={handleChange} required style={{ padding: "8px", width: "250px" }} />
        </div>

        <button type="submit" style={{ padding: "10px 20px", width: "100%", cursor: "pointer", backgroundColor: "#4CAF50", color: "white", border: "none" }}>
          Register
        </button>
      </form>

      <p style={{ marginTop: "20px" }}>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}

export default Register;