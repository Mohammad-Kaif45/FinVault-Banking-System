import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Transfer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [targetId, setTargetId] = useState("");
  const [amount, setAmount] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:8080/accounts/${id}/transfer/${targetId}`,
        { amount: amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      alert("Transfer Failed: Please check the Target Account ID and your balance.");
    }
  };

  const theme = { bg: "#F3F4F6", navy: "#0f172a", white: "#FFFFFF", primary: "#2563EB", textMain: "#1F2937", textSec: "#6B7280", border: "#E5E7EB" };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "-apple-system, sans-serif", overflow: "hidden", position: "relative" }}>

      {showSuccess && (
        <div style={{ position: "fixed", top: "40px", right: "15%", backgroundColor: "#ffffff", border: "1px solid #10b981", color: "#000000", padding: "12px 24px", borderRadius: "8px", zIndex: 1000, display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: "14px" }}>
          Transfer successful. Funds dispatched ✅
        </div>
      )}

      <style>{`.watermark-bg { position: absolute; font-size: 120px; font-weight: 900; color: rgba(0,0,0,0.03); z-index: 0; transform: rotate(-10deg); white-space: nowrap; user-select: none; } .form-card { transition: transform 0.4s ease, box-shadow 0.4s ease; position: relative; z-index: 10; } .form-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }`}</style>

      {/* LEFT SIDE */}
      <div style={{ flex: "0.4", backgroundColor: theme.navy, color: "white", padding: "60px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "600", letterSpacing: "1px", marginBottom: "20px" }}>FINVAULT <span style={{ opacity: 0.5 }}>ENTERPRISE</span></h1>
        <h2 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "20px" }}>Global Transfers.</h2>
        <p style={{ color: "#94a3b8", fontSize: "16px", lineHeight: "1.6" }}>Dispatch funds securely across the FinVault network with real-time settlement.</p>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ flex: "0.6", backgroundColor: theme.bg, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
        <div className="watermark-bg" style={{ top: "10%", left: "5%" }}>TRANSFER</div>
        <div className="watermark-bg" style={{ bottom: "15%", right: "5%" }}>NET-SETTLE</div>

        <div className="form-card" style={{ width: "100%", maxWidth: "420px", backgroundColor: theme.white, padding: "48px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
          <h3 style={{ color: theme.textMain, fontSize: "22px", fontWeight: "700", marginBottom: "8px", textAlign: "center" }}>Fund Transfer</h3>
          <p style={{ color: theme.textSec, fontSize: "14px", marginBottom: "32px", textAlign: "center" }}>Source Account: <span style={{color: theme.textMain, fontWeight: "600"}}>{id}</span></p>

          <form onSubmit={handleTransfer}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: theme.textMain, marginBottom: "8px" }}>Target Account ID</label>
              <input type="number" value={targetId} onChange={(e) => setTargetId(e.target.value)} required placeholder="Destination ID"
                style={{ width: "100%", padding: "12px", borderRadius: "6px", border: `1px solid ${theme.border}`, backgroundColor: "#F9FAFB" }} />
            </div>

            <div style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: theme.textMain, marginBottom: "8px" }}>Amount (₹)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="Amount to send"
                style={{ width: "100%", padding: "12px", borderRadius: "6px", border: `1px solid ${theme.border}`, backgroundColor: "#F9FAFB" }} />
            </div>

            <button type="submit" style={{ width: "100%", backgroundColor: theme.primary, color: "white", padding: "14px", borderRadius: "6px", border: "none", fontWeight: "600", cursor: "pointer" }}>
              Authorize Transfer
            </button>
            <button type="button" onClick={() => navigate("/dashboard")} style={{ width: "100%", backgroundColor: "transparent", color: theme.textSec, padding: "10px", border: "none", cursor: "pointer", marginTop: "10px" }}>
              Return to Overview
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Transfer;