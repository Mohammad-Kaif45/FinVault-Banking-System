import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Pulling secure identity data stored during login
  const userName = localStorage.getItem("name") || "Enterprise User";
  const userId = localStorage.getItem("userId") || "Unknown";
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const theme = { bg: "#F3F4F6", header: "#111827", cardBg: "#FFFFFF", primary: "#2563EB", textMain: "#1F2937", textSec: "#6B7280", border: "#E5E7EB", dark: "#0f172a" };

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: "100vh", fontFamily: "sans-serif", paddingBottom: "60px" }}>

      {/* HEADER */}
      <div style={{ backgroundColor: theme.header, color: "white", padding: "0 10%", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: "20px", fontWeight: "600", cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
          FinVault <span style={{fontWeight:"300", opacity:0.7}}>Enterprise</span>
        </div>
        <div style={{ fontSize: "14px", display: "flex", gap: "20px" }}>
            <span style={{ cursor: "pointer", color: "#9CA3AF" }} onClick={() => navigate("/dashboard")}>Dashboard</span>
            <span style={{ cursor: "pointer", color: "white", fontWeight: "500" }}>Identity Profile</span>
        </div>
      </div>

      <div style={{ padding: "40px 10%", maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "24px", color: theme.textMain }}>Institutional Identity</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "24px" }}>

          {/* LEFT COLUMN: Main Profile & Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Identity Banner */}
            <div style={{ backgroundColor: theme.cardBg, borderRadius: "12px", border: `1px solid ${theme.border}`, overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
              <div style={{ height: "100px", background: "linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)", position: "relative" }}>
                {/* Fixed Avatar: Vibrant Blue with White Text */}
                <div style={{ position: "absolute", bottom: "-40px", left: "30px", width: "80px", height: "80px", backgroundColor: theme.primary, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `4px solid ${theme.cardBg}`, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                  <span style={{ fontSize: "32px", fontWeight: "700", color: "white" }}>
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <div style={{ padding: "50px 30px 30px 30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h2 style={{ fontSize: "24px", fontWeight: "700", color: theme.textMain, margin: "0 0 8px 0" }}>{userName}</h2>
                    <span style={{ backgroundColor: "#DBEAFE", color: "#1E40AF", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600", letterSpacing: "0.5px" }}>
                      CLEARANCE: STANDARD
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "12px", color: theme.textSec, fontWeight: "600", marginBottom: "4px", textTransform: "uppercase" }}>Global User ID</div>
                    <div style={{ fontSize: "16px", fontWeight: "600", fontFamily: "monospace", color: theme.textMain }}>USR-{userId.padStart(6, '0')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Virtual Cards Section */}
            <div style={{ backgroundColor: theme.cardBg, borderRadius: "12px", border: `1px solid ${theme.border}`, padding: "30px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: theme.textMain, margin: "0 0 20px 0" }}>Active Payment Methods</h3>

              <div style={{ display: "flex", gap: "20px", overflowX: "auto", paddingBottom: "10px" }}>
                {/* Debit Card */}
                <div style={{ minWidth: "280px", height: "160px", background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)", borderRadius: "16px", padding: "20px", color: "white", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
                  <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", background: "rgba(255,255,255,0.05)", borderRadius: "50%" }}></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "14px", fontWeight: "600", letterSpacing: "1px" }}>DEBIT</span>
                    <svg width="32" height="20" viewBox="0 0 32 20" fill="none"><circle cx="10" cy="10" r="10" fill="#EB001B" fillOpacity="0.8"/><circle cx="22" cy="10" r="10" fill="#F79E1B" fillOpacity="0.8"/></svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: "monospace", fontSize: "18px", letterSpacing: "2px", marginBottom: "4px" }}>**** **** **** 4920</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", opacity: 0.8 }}>
                      <span>{userName.toUpperCase()}</span>
                      <span>12/28</span>
                    </div>
                  </div>
                </div>

                {/* Credit Card */}
                <div style={{ minWidth: "280px", height: "160px", background: "linear-gradient(135deg, #1e3a8a 0%, #172554 100%)", borderRadius: "16px", padding: "20px", color: "white", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
                  <div style={{ position: "absolute", top: "50%", left: "-20px", width: "80px", height: "80px", background: "rgba(255,255,255,0.05)", borderRadius: "50%" }}></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "14px", fontWeight: "600", letterSpacing: "1px", color: "#fbbf24" }}>CORPORATE CREDIT</span>
                    <span style={{ fontSize: "16px", fontWeight: "700", fontStyle: "italic" }}>VISA</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "monospace", fontSize: "18px", letterSpacing: "2px", marginBottom: "4px" }}>**** **** **** 8831</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", opacity: 0.8 }}>
                      <span>{userName.toUpperCase()}</span>
                      <span>05/27</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Security & Settings */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Security Panel */}
            <div style={{ backgroundColor: theme.cardBg, borderRadius: "12px", border: `1px solid ${theme.border}`, padding: "24px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: theme.textMain, margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🔒</span> Security Settings
              </h3>

              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", color: theme.textSec, marginBottom: "4px" }}>Status</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "500", color: "#10B981", fontSize: "14px" }}>
                  <span style={{ width: "8px", height: "8px", backgroundColor: "#10B981", borderRadius: "50%", display: "inline-block" }}></span>
                  Active & Verified
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", color: theme.textSec, marginBottom: "4px" }}>Last Login IPv4</div>
                <div style={{ fontWeight: "500", color: theme.textMain, fontSize: "14px", fontFamily: "monospace" }}>
                  192.168.1.45 (Local)
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontSize: "12px", color: theme.textSec, marginBottom: "4px" }}>Session JWT Token</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ flex: 1, backgroundColor: theme.bg, padding: "8px", borderRadius: "6px", fontSize: "12px", fontFamily: "monospace", color: theme.textSec, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", border: `1px solid ${theme.border}` }}>
                    {token ? `${token.substring(0, 20)}...` : "None"}
                  </div>
                  <button onClick={copyToken} style={{ backgroundColor: copied ? "#10B981" : theme.primary, color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600", transition: "all 0.2s" }}>
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p style={{ fontSize: "11px", color: theme.textSec, marginTop: "6px" }}>This token authorizes your device to securely communicate with FinVault microservices.</p>
              </div>

              <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: "20px" }}>
                <button
                  onClick={handleLogout}
                  style={{ width: "100%", backgroundColor: "#FEE2E2", color: "#991B1B", border: "none", padding: "12px", borderRadius: "6px", fontWeight: "600", cursor: "pointer", transition: "background-color 0.2s" }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#FECACA"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#FEE2E2"}
                >
                  Revoke Access (Sign Out)
                </button>
              </div>
            </div>

            {/* Account Limits */}
            <div style={{ backgroundColor: theme.cardBg, borderRadius: "12px", border: `1px solid ${theme.border}`, padding: "24px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: theme.textMain, margin: "0 0 16px 0", textTransform: "uppercase" }}>
                Daily Limits
              </h3>
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px", fontWeight: "500" }}>
                  <span style={{ color: theme.textSec }}>Transfers</span>
                  <span style={{ color: theme.textMain }}>₹1,50,000 / ₹5,00,000</span>
                </div>
                <div style={{ width: "100%", height: "6px", backgroundColor: theme.bg, borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: "30%", height: "100%", backgroundColor: theme.primary }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px", fontWeight: "500" }}>
                  <span style={{ color: theme.textSec }}>Withdrawals</span>
                  <span style={{ color: theme.textMain }}>₹40,000 / ₹1,00,000</span>
                </div>
                <div style={{ width: "100%", height: "6px", backgroundColor: theme.bg, borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: "40%", height: "100%", backgroundColor: "#F59E0B" }}></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;