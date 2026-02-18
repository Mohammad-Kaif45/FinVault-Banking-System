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

        if (!token || !userId) {
          window.location.href = "/login";
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`http://localhost:8080/accounts/user/${userId}`, config);

        if (response.data && response.data.length > 0) {
            setAccount(response.data[0]);
        } else {
            setAccount(null);
        }
        setLoading(false);

      } catch (err) {
        console.error("Fetch Error:", err);
        setError("System unavailable. Please contact support.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- CORPORATE STYLES ---
  const theme = {
    bg: "#F3F4F6",
    header: "#111827",
    cardBg: "#FFFFFF",
    primary: "#2563EB",
    textMain: "#1F2937",
    textSec: "#6B7280",
    border: "#E5E7EB"
  };

  const styles = {
    container: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      backgroundColor: theme.bg,
      minHeight: "100vh",
      color: theme.textMain
    },
    header: {
      backgroundColor: theme.header,
      color: "white",
      padding: "0 10%",
      height: "60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    },
    brand: { fontSize: "20px", fontWeight: "600", letterSpacing: "0.5px" },
    userMenu: { fontSize: "14px", display: "flex", gap: "20px", alignItems: "center" },
    logoutLink: { color: "#9CA3AF", cursor: "pointer", textDecoration: "none", fontSize: "13px" },
    main: { padding: "40px 10%", maxWidth: "1200px", margin: "0 auto" },
    sectionTitle: { fontSize: "24px", fontWeight: "500", marginBottom: "20px", color: theme.header },
    grid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" },
    card: {
      backgroundColor: theme.cardBg,
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      padding: "24px"
    },
    label: { fontSize: "12px", textTransform: "uppercase", color: theme.textSec, fontWeight: "600", letterSpacing: "0.5px", marginBottom: "8px" },
    balance: { fontSize: "36px", fontWeight: "700", color: theme.textMain, marginBottom: "8px" },
    actionList: { display: "flex", flexDirection: "column", gap: "12px" },
    actionBtn: {
      backgroundColor: "white", border: `1px solid ${theme.primary}`, color: theme.primary,
      padding: "12px", borderRadius: "6px", cursor: "pointer", fontWeight: "500",
      textAlign: "center", textDecoration: "none", display: "block"
    },
    primaryBtn: {
      backgroundColor: theme.primary, color: "white", border: "none", padding: "12px",
      borderRadius: "6px", cursor: "pointer", fontWeight: "500", width: "100%", marginTop: "10px"
    }
  };

  if (loading) return <div style={{padding: "50px", fontFamily: "sans-serif"}}>Loading...</div>;
  if (error) return <div style={{padding: "50px", color: "red", fontFamily: "sans-serif"}}>{error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.brand}>FinVault <span style={{fontWeight:"300", opacity:0.7}}>Enterprise</span></div>
        <div style={styles.userMenu}>
            <span>{userName}</span>
            <span style={styles.logoutLink} onClick={() => { localStorage.clear(); window.location.href = "/login"; }}>Sign Out</span>
        </div>
      </div>

      <div style={styles.main}>
        <h1 style={styles.sectionTitle}>Account Overview</h1>

        {account ? (
          <div style={styles.grid}>
            <div style={styles.card}>
              <div style={{display: "flex", justifyContent: "space-between", marginBottom: "20px"}}>
                 <div>
                     <div style={styles.label}>Available Balance</div>
                     {/* 👇 UPDATED: Rupee Symbol & Indian Formatting (en-IN) */}
                     <div style={styles.balance}>₹{account.balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                 </div>
                 <div style={{textAlign: "right"}}>
                     <div style={styles.label}>Status</div>
                     <span style={{backgroundColor: "#DEF7EC", color: "#03543F", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "600"}}>ACTIVE</span>
                 </div>
              </div>

              <div style={{borderTop: `1px solid ${theme.border}`, paddingTop: "20px"}}>
                  <div style={styles.label}>Account Details</div>
                  <div style={{display: "flex", gap: "40px"}}>
                      <div><div style={{fontSize: "13px", color: theme.textSec}}>Account Number</div><div style={{fontWeight: "500"}}>**** **** {account.id + 1020}</div></div>
                      <div><div style={{fontSize: "13px", color: theme.textSec}}>Account Type</div><div style={{fontWeight: "500"}}>{account.accountType}</div></div>
                      {/* 👇 UPDATED: INR Currency */}
                      <div><div style={{fontSize: "13px", color: theme.textSec}}>Currency</div><div style={{fontWeight: "500"}}>INR</div></div>
                  </div>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.label}>Quick Actions</div>
              <div style={styles.actionList}>
                <button style={{...styles.actionBtn, backgroundColor: theme.primary, color: "white"}} onClick={() => window.location.href = `/transfer/${account.id}`}>Transfer Funds &rarr;</button>
                <button style={styles.actionBtn} onClick={() => window.location.href = `/withdraw/${account.id}`}>Withdraw Cash</button>
              </div>
              <div style={{marginTop: "20px", fontSize: "12px", color: theme.textSec, lineHeight: "1.5"}}>For support, please contact the dedicated relationship manager or visit the nearest branch.</div>
            </div>
          </div>
        ) : (
          <div style={{...styles.card, textAlign: "center", padding: "60px"}}>
            <h3 style={{color: theme.textMain}}>No Accounts Found</h3>
            <p style={{color: theme.textSec, marginBottom: "20px"}}>This user ID does not have an active banking account.</p>
            <button style={styles.primaryBtn} onClick={() => window.location.href = "/create-account"}>Open New Account</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;