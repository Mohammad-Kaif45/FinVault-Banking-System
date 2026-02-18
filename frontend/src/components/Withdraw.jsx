import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useParams gets ID from URL
import axios from "axios";

function Withdraw() {
  const { accountId } = useParams(); // Get Account ID from the URL
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // ⚠️ BACKEND: Make sure your AccountController has a withdraw endpoint!
      // URL: http://localhost:8080/accounts/{id}/withdraw
      // Body: { "amount": 500 }
      const payload = { amount: parseFloat(amount) };

      await axios.post(`http://localhost:8080/accounts/${accountId}/withdraw`, payload, config);

      alert("Withdrawal Successful! 💸");
      navigate("/dashboard");

    } catch (error) {
      console.error("Withdraw Error:", error);
      alert("Withdraw Failed! Check balance or backend.");
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h2>💸 Withdraw Money</h2>
      <h3>Account ID: {accountId}</h3>

      <form onSubmit={handleWithdraw}>
        <div style={{ marginBottom: "15px" }}>
          <label>Initial Deposit (₹):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            required
            style={{ padding: "8px", width: "200px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#ffc107", border: "none", cursor: "pointer" }}>
          Confirm Withdraw
        </button>
      </form>
       <button onClick={() => navigate("/dashboard")} style={{ marginTop: "10px", padding: "10px", border:"none", background: "#ddd" }}>
          Cancel
       </button>
    </div>
  );
}

export default Withdraw;