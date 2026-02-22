import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountType: "SAVINGS",
    balance: 1000
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        navigate("/login");
        return;
      }

      const payload = {
        userId: userId,
        accountType: formData.accountType,
        balance: formData.balance
      };

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.post("http://localhost:8080/accounts/create", payload, config);

      alert("Account Created Successfully! ₹" + formData.balance + " deposited.");
      navigate("/dashboard");

    } catch (error) {
      console.error("Creation Failed:", error);
      alert("Failed to initiate account opening. Please check your connection.");
    }
  };

  // --- CORPORATE THEME ---
  const theme = {
    bg: "#F3F4F6",
    navy: "#0f172a",
    white: "#FFFFFF",
    primary: "#2563EB",
    textMain: "#1F2937",
    textSec: "#6B7280",
    border: "#E5E7EB"
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", overflow: "hidden" }}>

      {/* 👇 INTERACTIVE STYLES */}
      <style>
        {`
          .watermark-bg {
            position: absolute;
            font-size: 120px;
            font-weight: 900;
            color: rgba(0,0,0,0.03);
            white-space: nowrap;
            user-select: none;
            z-index: 0;
            transform: rotate(-10deg);
          }
          .form-card {
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
            position: relative;
            z-index: 10;
          }
          .form-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          }
        `}
      </style>

      {/* 1. LEFT SIDE: CORPORATE BRANDING */}
      <div style={{
        flex: "0.4",
        backgroundColor: theme.navy,
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px",
        position: "relative"
      }}>
        <h1 style={{ fontSize: "24px", fontWeight: "600", letterSpacing: "1px", marginBottom: "20px", opacity: 0.9 }}>
          FINVAULT <span style={{ opacity: 0.5, fontWeight: "300" }}>ENTERPRISE</span>
        </h1>
        <h2 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "20px" }}>Establish Your Portfolio.</h2>
        <p style={{ color: "#94a3b8", fontSize: "16px", lineHeight: "1.6", position: "relative", zIndex: 1 }}>
          You are opening a new account under the FinVault Enterprise Banking Group.
          Please select your preferred account type and initial capital.
        </p>
      </div>

      {/* 2. RIGHT SIDE: OPEN ACCOUNT FORM WITH WATERMARK */}
      <div style={{
        flex: "0.6",
        backgroundColor: theme.bg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
      }}>

        {/* BACKGROUND WATERMARKS */}
        <div className="watermark-bg" style={{ top: "10%", left: "-5%" }}>INVESTMENT</div>
        <div className="watermark-bg" style={{ bottom: "15%", right: "-10%" }}>SECURITY</div>
        <div className="watermark-bg" style={{ top: "40%", left: "20%", fontSize: "80px" }}>ASSETS</div>

        <div className="form-card" style={{
          width: "100%", maxWidth: "420px",
          backgroundColor: theme.white,
          padding: "48px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          border: `1px solid ${theme.border}`
        }}>

          <h3 style={{ color: theme.textMain, fontSize: "22px", fontWeight: "700", marginBottom: "8px", textAlign: "center" }}>
            New Account Application
          </h3>
          <p style={{ color: theme.textSec, fontSize: "14px", marginBottom: "32px", textAlign: "center" }}>
            Configure your banking preferences below.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: theme.textMain, marginBottom: "8px" }}>
                Select Account Category
              </label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                style={{
                  width: "100%", padding: "12px", borderRadius: "6px",
                  border: `1px solid ${theme.border}`, fontSize: "14px", outline: "none",
                  backgroundColor: "#F9FAFB", color: theme.textMain, cursor: "pointer"
                }}
              >
                <option value="SAVINGS">Savings Account (Standard)</option>
                <option value="CURRENT">Current Account (Business)</option>
              </select>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: theme.textMain, marginBottom: "8px" }}>
                Initial Deposit (₹)
              </label>
              <input
                type="number"
                name="balance"
                value={formData.balance}
                onChange={handleChange}
                min="500"
                required
                style={{
                  width: "100%", padding: "12px", borderRadius: "6px",
                  border: `1px solid ${theme.border}`, fontSize: "14px", outline: "none",
                  backgroundColor: "#F9FAFB", color: theme.textMain
                }}
              />
              <span style={{ fontSize: "11px", color: theme.textSec }}>Minimum balance required: ₹500.00</span>
            </div>

            <button
              type="submit"
              style={{
                width: "100%", backgroundColor: theme.primary, color: "white",
                padding: "14px", borderRadius: "6px", border: "none",
                fontSize: "14px", fontWeight: "600", cursor: "pointer",
                marginBottom: "12px", transition: "0.2s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#1D4ED8"}
              onMouseOut={(e) => e.target.style.backgroundColor = theme.primary}
            >
              Authorize & Open Account
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              style={{
                width: "100%", backgroundColor: "transparent", color: theme.textSec,
                padding: "10px", borderRadius: "6px", border: "none",
                fontSize: "13px", cursor: "pointer"
              }}
            >
              Return to Overview
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;