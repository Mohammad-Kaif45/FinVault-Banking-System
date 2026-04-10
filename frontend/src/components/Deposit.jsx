import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios
import axios from "axios";

function Deposit() {
  const navigate = useNavigate();
  // Forcefully grab the ID directly from the URL
  const id = window.location.pathname.split("/").pop();

  const [amount, setAmount] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // handleDeposite
  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Pointing to Account Service on 8085
      await axios.post(`http://localhost:8085/accounts/${id}/deposit`,
        { amount: amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Deposit Error:", error);
      alert("Transaction Failed: Unable to process deposit at this time.");
    }
  };

  const theme = { bg: "#F3F4F6", navy: "#0f172a", white: "#FFFFFF", primary: "#2563EB", textMain: "#1F2937", textSec: "#6B7280", border: "#E5E7EB", success: "#10B981" };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "-apple-system, sans-serif", overflow: "hidden", position: "relative" }}>

      {showSuccess && (
        <div style={{ position: "fixed", top: "40px", right: "15%", backgroundColor: "#ffffff", border: `1px solid ${theme.success}`, color: "#000000", padding: "12px 24px", borderRadius: "8px", zIndex: 1000, display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: "14px" }}>
          Capital deposited successfully. Updating ledger... ✅
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
        <h2 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "20px" }}>Add Capital.</h2>
        <p style={{ color: "#94a3b8", fontSize: "16px", lineHeight: "1.6" }}>Securely inject liquidity into your enterprise accounts with instant ledger synchronization.</p>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ flex: "0.6", backgroundColor: theme.bg, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
        <div className="watermark-bg" style={{ top: "10%", left: "5%" }}>DEPOSIT</div>
        <div className="watermark-bg" style={{ bottom: "15%", right: "5%" }}>ASSETS</div>

        <div className="form-card" style={{ width: "100%", maxWidth: "420px", backgroundColor: theme.white, padding: "48px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
          <h3 style={{ color: theme.textMain, fontSize: "22px", fontWeight: "700", marginBottom: "8px", textAlign: "center" }}>Capital Deposit</h3>
          <p style={{ color: theme.textSec, fontSize: "14px", marginBottom: "32px", textAlign: "center" }}>Account ID: <span style={{color: theme.textMain, fontWeight: "600"}}>{id}</span></p>

          <form onSubmit={handleDeposit}>
            <div style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: theme.textMain, marginBottom: "8px" }}>Amount to Deposit (₹)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="e.g. 10000"
                style={{ width: "100%", padding: "12px", borderRadius: "6px", border: `1px solid ${theme.border}`, backgroundColor: "#F9FAFB", boxSizing: "border-box" }} />
            </div>

            <button type="submit" style={{ width: "100%", backgroundColor: theme.success, color: "white", padding: "14px", borderRadius: "6px", border: "none", fontWeight: "600", cursor: "pointer", transition: "opacity 0.2s" }} onMouseOver={(e)=>e.target.style.opacity=0.9} onMouseOut={(e)=>e.target.style.opacity=1}>
              Confirm Deposit
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

export default Deposit;