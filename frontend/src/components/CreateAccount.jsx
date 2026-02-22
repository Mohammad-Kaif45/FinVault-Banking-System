import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ accountType: "SAVINGS", balance: 1000 });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
      await axios.post("http://localhost:8080/accounts/create", { userId: localStorage.getItem("userId"), ...formData }, config);
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); navigate("/dashboard"); }, 3000);
    } catch (error) { alert("Creation Failed."); }
  };

  const theme = { bg: "#F3F4F6", navy: "#0f172a", white: "#FFFFFF", primary: "#2563EB", textMain: "#1F2937", textSec: "#6B7280", border: "#E5E7EB" };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "-apple-system, sans-serif", overflow: "hidden", position: "relative" }}>

      {showSuccess && (
        <div style={{ position: "fixed", top: "40px", right: "15%", backgroundColor: "#ffffff", border: "1px solid #10b981", color: "#000000", padding: "12px 24px", borderRadius: "8px", zIndex: 1000, display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: "14px" }}>
          Account authorized and initialized ✅
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
        <h2 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "20px" }}>Establish Portfolio.</h2>
        <p style={{ color: "#94a3b8", fontSize: "16px", lineHeight: "1.6" }}>Select your preferred account type and initial capital.</p>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ flex: "0.6", backgroundColor: theme.bg, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
        <div className="watermark-bg" style={{ top: "10%", left: "-5%" }}>INVESTMENT</div>
        <div className="watermark-bg" style={{ bottom: "15%", right: "-10%" }}>SECURITY</div>

        <div className="form-card" style={{ width: "100%", maxWidth: "420px", backgroundColor: theme.white, padding: "48px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
          <h3 style={{ color: theme.textMain, fontSize: "22px", fontWeight: "700", marginBottom: "8px", textAlign: "center" }}>New Application</h3>
          <p style={{ color: theme.textSec, fontSize: "14px", marginBottom: "32px", textAlign: "center" }}>Configure banking preferences.</p>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}><label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>Account Category</label><select onChange={(e) => setFormData({...formData, accountType: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "6px", border: `1px solid ${theme.border}`, backgroundColor: "#F9FAFB" }}><option value="SAVINGS">Savings Account</option><option value="CURRENT">Current Account</option></select></div>
            <div style={{ marginBottom: "32px" }}><label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>Initial Deposit (₹)</label><input type="number" onChange={(e) => setFormData({...formData, balance: e.target.value})} min="500" required style={{ width: "100%", padding: "12px", borderRadius: "6px", border: `1px solid ${theme.border}`, backgroundColor: "#F9FAFB" }} /></div>
            <button type="submit" style={{ width: "100%", backgroundColor: theme.primary, color: "white", padding: "14px", borderRadius: "6px", border: "none", fontWeight: "600", cursor: "pointer" }}>Authorize</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;