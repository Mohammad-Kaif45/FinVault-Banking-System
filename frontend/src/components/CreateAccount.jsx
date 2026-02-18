import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountType: "SAVINGS", // Default selection
    balance: 1000           // Default initial deposit
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Get User ID & Token from storage
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        alert("You must be logged in!");
        navigate("/login");
        return;
      }

      // 2. Prepare Data
      // (Backend expects: userId, accountType, balance)
      const payload = {
        userId: userId,
        accountType: formData.accountType,
        balance: formData.balance
      };

      // 3. Send Request to Backend
      // ⚠️ MAKE SURE THIS URL MATCHES YOUR ACCOUNT CONTROLLER
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };



      await axios.post("http://localhost:8080/accounts/create", payload, config);

      // 4. Success!
      alert("Account Created Successfully! 🎉");
      navigate("/dashboard");

    } catch (error) {
      console.error("Creation Failed:", error);
      alert("Failed to create account. Check console for details.");
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h2>🏦 Open a New Account</h2>
      <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "left" }}>

        <div style={{ marginBottom: "15px" }}>
          <label>Account Type:</label><br />
          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            style={{ padding: "8px", width: "266px" }}
          >
            <option value="SAVINGS">Savings Account</option>
            <option value="CURRENT">Current Account</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Initial Deposit ($):</label><br />
          <input
            type="number"
            name="balance"
            value={formData.balance}
            onChange={handleChange}
            min="100"
            required
            style={{ padding: "8px", width: "250px" }}
          />
        </div>

        <button type="submit" style={{ padding: "10px 20px", width: "100%", backgroundColor: "#007BFF", color: "white", border: "none", cursor: "pointer" }}>
          Create Account
        </button>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{ marginTop: "10px", padding: "10px 20px", width: "100%", backgroundColor: "#6c757d", color: "white", border: "none", cursor: "pointer" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default CreateAccount;