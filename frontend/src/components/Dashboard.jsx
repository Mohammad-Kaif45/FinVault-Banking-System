import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userName = localStorage.getItem("name") || "Client";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token || !userId) { window.location.href = "/login"; return; }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`http://localhost:8080/accounts/user/${userId}`, config);
        setAccount(response.data && response.data.length > 0 ? response.data[0] : null);
        setLoading(false);
      } catch (err) {
        setError("System unavailable. Please contact support.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const theme = { bg: "#F3F4F6", header: "#111827", cardBg: "#FFFFFF", primary: "#2563EB", textMain: "#1F2937", textSec: "#6B7280", border: "#E5E7EB" };

  if (loading) return <div style={{padding: "50px", fontFamily: "sans-serif"}}>Loading Enterprise Portal...</div>;

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: "100vh", fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: theme.header, color: "white", padding: "0 10%", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: "20px", fontWeight: "600" }}>FinVault <span style={{fontWeight:"300", opacity:0.7}}>Enterprise</span></div>
        <div style={{ fontSize: "14px" }}>
            <span style={{marginRight: "20px"}}>{userName}</span>
            <span style={{color: "#9CA3AF", cursor: "pointer"}} onClick={() => { localStorage.clear(); window.location.href = "/login"; }}>Sign Out</span>
        </div>
      </div>

      <div style={{ padding: "40px 10%", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "500", marginBottom: "20px" }}>Account Overview</h1>

        {account ? (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
            <div style={{ backgroundColor: theme.cardBg, borderRadius: "8px", border: `1px solid ${theme.border}`, padding: "24px" }}>
              <div style={{display: "flex", justifyContent: "space-between", marginBottom: "20px"}}>
                 <div>
                     <div style={{fontSize: "12px", color: theme.textSec, fontWeight: "600"}}>AVAILABLE BALANCE</div>
                     <div style={{fontSize: "36px", fontWeight: "700"}}>₹{account.balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                 </div>
                 <span style={{backgroundColor: "#DEF7EC", color: "#03543F", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "600", height: "fit-content"}}>ACTIVE</span>
              </div>

              <div style={{borderTop: `1px solid ${theme.border}`, paddingTop: "20px", display: "flex", gap: "40px"}}>
                  <div>
                    <div style={{fontSize: "13px", color: theme.textSec}}>Account Number</div>
                    <div style={{fontWeight: "600", letterSpacing: "1px"}}>{account.accountNumber}</div>
                  </div>
                  <div>
                    <div style={{fontSize: "13px", color: theme.textSec}}>Account Type</div>
                    <div style={{fontWeight: "600"}}>{account.accountType}</div>
                  </div>
              </div>
            </div>

            <div style={{ backgroundColor: theme.cardBg, borderRadius: "8px", border: `1px solid ${theme.border}`, padding: "24px" }}>
              <div style={{fontSize: "12px", color: theme.textSec, fontWeight: "600", marginBottom: "15px"}}>QUICK ACTIONS</div>
              <button
                style={{ width: "100%", backgroundColor: theme.primary, color: "white", padding: "12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "600", marginBottom: "10px" }}
                onClick={() => window.location.href = `/transfer/${account.id}`}
              >
                Transfer Funds &rarr;
              </button>
              <button
                style={{ width: "100%", backgroundColor: "white", border: `1px solid ${theme.primary}`, color: theme.primary, padding: "12px", borderRadius: "6px", cursor: "pointer" }}
                onClick={() => window.location.href = `/withdraw/${account.id}`}
              >
                Withdraw Cash
              </button>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: theme.cardBg, borderRadius: "8px", border: `1px solid ${theme.border}`, padding: "60px", textAlign: "center" }}>
            <h3>No Accounts Found</h3>
            <button style={{ backgroundColor: theme.primary, color: "white", padding: "12px 24px", borderRadius: "6px", border: "none", marginTop: "20px", cursor: "pointer" }} onClick={() => window.location.href = "/create-account"}>Open New Account</button>
          </div>
        )}
      </div>
    </div>
  );
}
export default Dashboard;