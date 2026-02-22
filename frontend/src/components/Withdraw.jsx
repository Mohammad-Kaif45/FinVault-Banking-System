import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Withdraw() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      // 👇 Matches the 'Bulletproof' Map<String, Object> backend logic
      await axios.post(`http://localhost:8080/accounts/${id}/withdraw`,
        { amount: amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Withdraw Error:", error);
      alert("Transaction Declined: Insufficient funds or system error.");
    }
  };

  const theme = { bg: "#F3F4F6", navy: "#0f172a", white: "#FFFFFF", primary: "#2563EB", textMain: "#1F2937", textSec: "#6B7280", border: "#E5E7EB" };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "-apple-system, sans-serif", overflow: "hidden", position: "relative" }}>

      {showSuccess && (
        <div style={{ position: "fixed", top: "40px", right: "15%", backgroundColor: "#ffffff", border: "1px solid #10b981", color: "#000000", padding: "12px 24px", borderRadius: "8px", zIndex: 1000, display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: "14px" }}>
          Cash withdrawal successful. Updating balance... ✅
        </div>
      )}

      <style>{`
        .watermark-bg { position: absolute; font-size: 120px; font-weight: 900; color: rgba(0,0,0,0.03); white-space: nowrap; user-select: none; z-index: 0; transform: rotate(-10deg); }
        .form-card { transition: transform 0.4s ease, box-shadow 0.4s ease; position: relative; z-index: 10; }
        .form-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
      `}</style>

      {/* LEFT SIDE */}
      <div style={{ flex: "0.4", backgroundColor: theme.navy, color: "white", padding: "60px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "600", letterSpacing: "1px", marginBottom: "20px" }}>FINVAULT <span style={{ opacity: 0.5 }}>ENTERPRISE</span></h1>
        <h2 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "20px" }}>Secure Liquidity.</h2>
        <p style={{ color: "#94a3b8", fontSize: "16px", lineHeight: "1.6" }}>Withdraw capital instantly from your enterprise account with military-grade encryption.</p>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ flex: "0.6", backgroundColor: theme.bg, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
        <div className="watermark-bg" style={{ top: "10%", left: "5%" }}>WITHDRAW</div>
        <div className="watermark-bg" style={{ bottom: "15%", right: "5%" }}>LIQUIDITY</div>

        <div className="form-card" style={{ width: "100%", maxWidth: "420px", backgroundColor: theme.white, padding: "48px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
          <h3 style={{ color: theme.textMain, fontSize: "22px", fontWeight: "700", marginBottom: "8px", textAlign: "center" }}>Cash Withdrawal</h3>
          <p style={{ color: theme.textSec, fontSize: "14px", marginBottom: "32px", textAlign: "center" }}>Account ID: <span style={{color: theme.textMain, fontWeight: "600"}}>{id}</span></p>

          <form onSubmit={handleWithdraw}>
            <div style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: theme.textMain, marginBottom: "8px" }}>Amount to Withdraw (₹)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="e.g. 500"
                style={{ width: "100%", padding: "12px", borderRadius: "6px", border: `1px solid ${theme.border}`, backgroundColor: "#F9FAFB" }} />
            </div>

            <button type="submit" style={{ width: "100%", backgroundColor: "#f59e0b", color: "white", padding: "14px", borderRadius: "6px", border: "none", fontWeight: "600", cursor: "pointer" }}>
              Confirm Withdrawal
            </button>
            <button type="button" onClick={() => navigate("/dashboard")} style={{ width: "100%", backgroundColor: "transparent", color: theme.textSec, padding: "10px", border: "none", cursor: "pointer", marginTop: "10px" }}>
              Cancel Transaction
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Withdraw;