import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Transfer() {
  const { accountId } = useParams(); // THIS Account is the Sender
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    targetAccountId: "",
    amount: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // ⚠️ BACKEND: Ensure TransactionService handles this!
      const payload = {
        sourceAccountId: accountId,
        targetAccountId: formData.targetAccountId,
        amount: parseFloat(formData.amount)
      };

      await axios.post("http://localhost:8080/transactions/transfer", payload, config);

      alert("Transfer Successful! 🚀");
      navigate("/dashboard");

    } catch (error) {
      console.error("Transfer Error:", error);
      alert("Transfer Failed! Check Account IDs.");
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h2>🔄 Transfer Money</h2>
      <p>Sending from Account: <strong>{accountId}</strong></p>

      <form onSubmit={handleTransfer} style={{ display: "inline-block", textAlign: "left" }}>

        <div style={{ marginBottom: "10px" }}>
          <label>Target Account ID (Receiver):</label><br />
          <input type="number" name="targetAccountId" onChange={handleChange} required style={{ padding: "8px", width: "250px" }} />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Amount ($):</label><br />
          <input type="number" name="amount" onChange={handleChange} required style={{ padding: "8px", width: "250px" }} />
        </div>

        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer" }}>
          Send Money
        </button>
      </form>

      <br/>
      <button onClick={() => navigate("/dashboard")} style={{ marginTop: "10px", padding: "10px", border:"none", background: "#ddd" }}>
          Cancel
       </button>
    </div>
  );
}

export default Transfer;