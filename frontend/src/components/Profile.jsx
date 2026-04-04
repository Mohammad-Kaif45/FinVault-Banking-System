import { useEffect, useState, useRef } from "react";
import axios from "axios";
import VirtualCard from './VirtualCard';

function Profile() {
  const NAME_KEY = "name";
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const AVATAR_KEY = `avatar_${userId}`;

  const [user, setUser] = useState({ name: "", email: "", phone: "" });
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ledgerError, setLedgerError] = useState(false);

  const [avatar, setAvatar] = useState(localStorage.getItem(AVATAR_KEY) || null);
  const fileInputRef = useRef(null);

  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !userId) { window.location.href = "/login"; return; }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const storedName = localStorage.getItem(NAME_KEY) || "FinVault User";

      try {
        const userRes = await axios.get(`http://localhost:8082/users/${userId}`, config);
        setUser({ name: userRes.data?.name || storedName, email: userRes.data?.email || "", phone: userRes.data?.phone || "" });
        if(userRes.data?.name) localStorage.setItem(NAME_KEY, userRes.data.name);
      } catch (err) {
        setUser(prev => ({...prev, name: storedName}));
      }

      try {
        const accRes = await axios.get(`http://localhost:8085/accounts/user/${userId}`, config);
        if (accRes.data && accRes.data.length > 0) {
            const currentAcc = accRes.data[0];
            setAccount(currentAcc);
            const txRes = await axios.get(`http://localhost:8081/transactions/history/${currentAcc.accountNumber}`, config);
            setTransactions(Array.isArray(txRes.data) ? txRes.data : []);
            setLedgerError(false);
        }
      } catch (err) {
        setLedgerError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, token, AVATAR_KEY]);

  const handleAvatarClick = () => { fileInputRef.current.click(); };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) return setStatusMsg({ type: "error", text: "Please upload an image file (PNG, JPG)." });
      if (file.size > 2 * 1024 * 1024) return setStatusMsg({ type: "error", text: "Image must be smaller than 2MB." });

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        localStorage.setItem(AVATAR_KEY, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePassword = async () => {
    setStatusMsg({ type: "", text: "" });
    if(!passwords.oldPassword || !passwords.newPassword) return setStatusMsg({ type: "error", text: "Both fields required." });
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`http://localhost:8082/users/change-password`, { userId, oldPassword: passwords.oldPassword, newPassword: passwords.newPassword }, config);
      setStatusMsg({ type: "success", text: "Password updated securely." });
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setStatusMsg({ type: "error", text: "Failed to update password." });
    }
  };

  // --- LIMIT CALCULATIONS (Silently running in background) ---
  const TRANSFER_LIMIT = 500000;
  const WITHDRAWAL_LIMIT = 100000;
  let spentTransfers = 0;
  let spentWithdrawals = 0;

  const todayObj = new Date();
  const todayStr = todayObj.toDateString();
  const todayLocal = `${todayObj.getFullYear()}-${String(todayObj.getMonth()+1).padStart(2,'0')}-${String(todayObj.getDate()).padStart(2,'0')}`;

  (Array.isArray(transactions) ? transactions : []).forEach(tx => {
    let rawDate = tx.timestamp || tx.date || tx.createdAt || tx.transactionDate;
    let isToday = false;

    if (rawDate) {
      let parsedDate = Array.isArray(rawDate) ? new Date(rawDate[0], rawDate[1] - 1, rawDate[2]) : new Date(rawDate);
      if (!isNaN(parsedDate) && parsedDate.toDateString() === todayStr) isToday = true;
      else if (typeof rawDate === 'string' && rawDate.includes(todayLocal)) isToday = true;
    }
    if (!isToday && JSON.stringify(tx).includes(todayLocal)) isToday = true;

    if (isToday) {
      const txAmount = parseFloat(tx.amount) || 0;
      const currentAccNum = account ? String(account.accountNumber) : "";
      const fromAccNum = tx.fromAccountNumber ? String(tx.fromAccountNumber) : "";
      const txType = tx.type ? String(tx.type).toUpperCase() : "";

      let isOutgoing = false;
      let isWithdrawal = false;

      if (fromAccNum === currentAccNum) {
          isOutgoing = true;
          isWithdrawal = (!tx.toAccountNumber || String(tx.toAccountNumber) === "null" || String(tx.toAccountNumber) === "");
      } else if (txType === "WITHDRAWAL" || txType === "TRANSFER") {
          isOutgoing = true;
          isWithdrawal = (txType === "WITHDRAWAL");
      }

      if (isOutgoing) {
        if (isWithdrawal) spentWithdrawals += txAmount;
        else spentTransfers += txAmount;
      }
    }
  });

  const transferPct = Math.min((spentTransfers / TRANSFER_LIMIT) * 100, 100);
  const withdrawPct = Math.min((spentWithdrawals / WITHDRAWAL_LIMIT) * 100, 100);

  const safeUserId = userId ? String(userId).padStart(6, '0') : "000000";
  const safeInitial = user?.name ? String(user.name).charAt(0).toUpperCase() : "U";

  // --- NEW EXECUTIVE CARBON THEME ---
  const theme = {
    bg: "#F4F5F7",           // Very light premium gray background
    boxBg: "#FFFFFF",        // Pure white cards
    primary: "#111827",      // Carbon Black for primary accents
    border: "#E5E7EB",       // Subtle borders
    text: "#111827",         // Dark carbon text
    textSec: "#6B7280",      // Slate gray secondary text
    gold: "#D97706"          // Premium metallic gold accent
  };

  if (loading) return <div style={{padding: "50px", color: theme.text}}>Connecting to FinVault...</div>;

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: "100vh", fontFamily: "sans-serif", paddingBottom: "60px" }}>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />

      {/* TOP NAVBAR (Dark Carbon) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", backgroundColor: theme.primary, padding: "15px 10%", color: "white", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
        <div style={{ fontSize: "20px", fontWeight: "bold", letterSpacing: "1px" }}>
          FinVault <span style={{fontWeight:300, opacity:0.7}}>Enterprise</span>
        </div>
        <div style={{ display: "flex", gap: "25px", fontSize: "14px", fontWeight: "500" }}>
          <span style={{ cursor: "pointer", color: "#9CA3AF", transition: "color 0.2s" }} onMouseOver={(e)=>e.target.style.color="white"} onMouseOut={(e)=>e.target.style.color="#9CA3AF"} onClick={() => window.location.href = "/dashboard"}>Dashboard</span>
          <span style={{ color: "white", fontWeight: 'bold', borderBottom: "2px solid white", paddingBottom: "4px" }}>Profile</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "24px", maxWidth: "1200px", margin: "0 auto", padding: "0 20px", flexWrap: "wrap" }}>

        {/* LEFT COLUMN */}
        <div style={{ flex: "2", minWidth: "600px", display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* HERO CARD (Executive Dark Gradient) */}
          <div style={{ backgroundColor: theme.boxBg, borderRadius: "16px", overflow: "hidden", border: `1px solid ${theme.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ background: "linear-gradient(135deg, #111827 0%, #374151 100%)", height: "120px", position: "relative" }}>

              <div
                onClick={handleAvatarClick}
                title="Click to change profile picture"
                style={{
                    position: "absolute", bottom: "-50px", left: "40px",
                    width: "110px", height: "110px",
                    backgroundColor: "#1F2937", color: "white",
                    borderRadius: "50%",
                    display: "flex", justifyContent: "center", alignItems: "center",
                    fontSize: "48px", fontWeight: "bold",
                    border: "6px solid white", overflow: 'hidden',
                    cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {avatar ? <img src={avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : safeInitial}
                <div style={{position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '11px', padding: '4px 0', textAlign:'center', opacity: 0, transition: 'opacity 0.2s'}} onMouseOver={(e)=>e.currentTarget.style.opacity=1} onMouseOut={(e)=>e.currentTarget.style.opacity=0}>Edit Photo</div>
              </div>
            </div>

            <div style={{ padding: "60px 40px 30px 40px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "28px", color: theme.text, letterSpacing: "-0.5px" }}>{user.name}</h2>
                {/* Premium Gold Clearance Badge */}
                <span style={{ backgroundColor: "rgba(217, 119, 6, 0.1)", color: theme.gold, border: `1px solid ${theme.gold}`, padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold", display: "inline-block", marginTop: "12px", letterSpacing: "1px" }}>
                  PRIVATE CLIENT
                </span>
              </div>
              <div style={{ textAlign: "right", color: theme.textSec, fontSize: "11px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>
                Global User ID<br/><span style={{ color: theme.text, fontSize: "18px", letterSpacing: "2px", fontFamily: "monospace" }}>USR-{safeUserId}</span>
              </div>
            </div>
          </div>

          {/* PAYMENT METHODS */}
          <div style={{ backgroundColor: theme.boxBg, padding: "30px", borderRadius: "16px", border: `1px solid ${theme.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ margin: "0 0 24px 0", color: theme.text, fontSize: "16px", fontWeight: "600" }}>Active Payment Methods</h3>
            <div style={{ display: "flex", gap: "24px" }}>
              <VirtualCard account={account} cardType="DEBIT" themeBg="linear-gradient(135deg, #1f2937, #0f172a)" network="Mastercard" />
              <VirtualCard account={account} cardType="CORPORATE CREDIT" themeBg="linear-gradient(135deg, #1e3a8a, #0c4a6e)" network="VISA" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ flex: "1", minWidth: "320px", display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* SECURITY SETTINGS */}
          <div style={{ backgroundColor: theme.boxBg, padding: "30px", borderRadius: "16px", border: `1px solid ${theme.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ margin: "0 0 24px 0", color: theme.text, fontSize: "16px", fontWeight: "600" }}>Security Settings</h3>

            <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: "15px", marginBottom: "15px" }}>
              <p style={{ fontSize: "11px", color: theme.textSec, fontWeight: "700", marginBottom: "12px", letterSpacing: "1px" }}>CHANGE PASSWORD</p>

              {statusMsg.text && <div style={{ padding: "12px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", textAlign: "center", marginBottom: '15px', backgroundColor: statusMsg.type === "error" ? "#FEF2F2" : "#ECFDF5", color: statusMsg.type === "error" ? "#B91C1C" : "#047857", border: `1px solid ${statusMsg.type === "error" ? "#FECACA" : "#A7F3D0"}` }}>{statusMsg.text}</div>}

              <input type="password" placeholder="Current Password" value={passwords.oldPassword} onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} style={{ width: "100%", padding: "14px", marginBottom: "12px", borderRadius: "8px", border: "1px solid #D1D5DB", backgroundColor: "#F9FAFB", boxSizing: "border-box", fontSize: "14px", outline: "none" }} />
              <input type="password" placeholder="New Password" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} style={{ width: "100%", padding: "14px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #D1D5DB", backgroundColor: "#F9FAFB", boxSizing: "border-box", fontSize: "14px", outline: "none" }} />

              <button onClick={handleUpdatePassword} style={{ width: "100%", backgroundColor: theme.primary, color: "white", padding: "14px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "14px", transition: "opacity 0.2s" }} onMouseOver={(e)=>e.target.style.opacity=0.9} onMouseOut={(e)=>e.target.style.opacity=1}>
                Update Password
              </button>
            </div>

            <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("userId"); window.location.href = "/login"; }} style={{ width: "100%", backgroundColor: "#FEF2F2", color: "#DC2626", padding: "14px", borderRadius: "8px", border: "1px solid #FECACA", cursor: "pointer", fontWeight: "600", marginTop: "10px", fontSize: "14px", transition: "background 0.2s" }} onMouseOver={(e)=>e.target.style.backgroundColor="#FEE2E2"} onMouseOut={(e)=>e.target.style.backgroundColor="#FEF2F2"}>
              Revoke Access (Sign Out)
            </button>
          </div>

          {/* DAILY LIMITS */}
          <div style={{ backgroundColor: theme.boxBg, padding: "30px", borderRadius: "16px", border: `1px solid ${theme.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ margin: "0 0 15px 0", color: theme.text, fontSize: "16px", fontWeight: "600" }}>Daily Limits</h3>

            {ledgerError && (
               <p style={{fontSize: "12px", color: "#B91C1C", fontWeight: "600", backgroundColor: "#FEF2F2", padding: "10px", borderRadius: "6px", border: "1px solid #FECACA", marginBottom: "20px"}}>
                 ⚠️ Secure Session Expired. Please sign out and authenticate again to view live limits.
               </p>
            )}

            <div style={{ marginBottom: "24px", marginTop: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                <span style={{ color: theme.textSec, fontWeight: "500" }}>Transfers</span>
                <span style={{ fontWeight: "700", color: theme.text }}>₹{spentTransfers.toLocaleString('en-IN')} <span style={{opacity: 0.5}}>/ ₹{TRANSFER_LIMIT.toLocaleString('en-IN')}</span></span>
              </div>
              <div style={{ width: "100%", height: "8px", backgroundColor: "#F3F4F6", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ width: `${transferPct}%`, height: "100%", backgroundColor: theme.primary, borderRadius: "10px", transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)" }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                <span style={{ color: theme.textSec, fontWeight: "500" }}>Withdrawals</span>
                <span style={{ fontWeight: "700", color: theme.text }}>₹{spentWithdrawals.toLocaleString('en-IN')} <span style={{opacity: 0.5}}>/ ₹{WITHDRAWAL_LIMIT.toLocaleString('en-IN')}</span></span>
              </div>
              <div style={{ width: "100%", height: "8px", backgroundColor: "#F3F4F6", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ width: `${withdrawPct}%`, height: "100%", backgroundColor: theme.gold, borderRadius: "10px", transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)" }}></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;