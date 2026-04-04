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

            console.log(`Successfully downloaded ${txRes.data.length} transactions.`);
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

  // --- THE BULLETPROOF LIMIT CALCULATOR ---
  const TRANSFER_LIMIT = 500000;
  const WITHDRAWAL_LIMIT = 100000;
  let spentTransfers = 0;
  let spentWithdrawals = 0;

  const todayObj = new Date();
  const todayStr = todayObj.toDateString();
  const todayLocal = `${todayObj.getFullYear()}-${String(todayObj.getMonth()+1).padStart(2,'0')}-${String(todayObj.getDate()).padStart(2,'0')}`;

  console.log(`--- CALCULATING LIMITS FOR TODAY: ${todayStr} (ISO: ${todayLocal}) ---`);

  (Array.isArray(transactions) ? transactions : []).forEach(tx => {
    // 1. Grab ANY field that looks like a date
    let rawDate = tx.timestamp || tx.date || tx.createdAt || tx.transactionDate;
    let isToday = false;

    // 2. Try to parse the date normally
    if (rawDate) {
      let parsedDate = Array.isArray(rawDate) ? new Date(rawDate[0], rawDate[1] - 1, rawDate[2]) : new Date(rawDate);
      if (!isNaN(parsedDate) && parsedDate.toDateString() === todayStr) {
        isToday = true;
      } else if (typeof rawDate === 'string' && rawDate.includes(todayLocal)) {
        isToday = true;
      }
    }

    // 3. Ultimate Fallback: Brute force scan the raw transaction string for today's date
    if (!isToday && JSON.stringify(tx).includes(todayLocal)) {
      isToday = true;
    }

    if (isToday) {
      const txAmount = parseFloat(tx.amount) || 0;
      const currentAccNum = account ? String(account.accountNumber) : "";
      const fromAccNum = tx.fromAccountNumber ? String(tx.fromAccountNumber) : "";
      const txType = tx.type ? String(tx.type).toUpperCase() : "";

      let isOutgoing = false;
      let isWithdrawal = false;

      // Logic A: By Account Number Match
      if (fromAccNum === currentAccNum) {
          isOutgoing = true;
          isWithdrawal = (!tx.toAccountNumber || String(tx.toAccountNumber) === "null" || String(tx.toAccountNumber) === "");
      }
      // Logic B: By Explicit Type String Match
      else if (txType === "WITHDRAWAL" || txType === "TRANSFER") {
          isOutgoing = true;
          isWithdrawal = (txType === "WITHDRAWAL");
      }

      if (isOutgoing) {
        if (isWithdrawal) {
          spentWithdrawals += txAmount;
          console.log(`[✔] COUNTED WITHDRAWAL: ₹${txAmount}`);
        } else {
          spentTransfers += txAmount;
          console.log(`[✔] COUNTED TRANSFER: ₹${txAmount}`);
        }
      }
    } else {
      console.log(`[X] Skipped: Old Transaction. Raw Date was: ${rawDate}`);
    }
  });

  console.log(`FINAL TALLY -> Transfers: ₹${spentTransfers} | Withdrawals: ₹${spentWithdrawals}`);

  const transferPct = Math.min((spentTransfers / TRANSFER_LIMIT) * 100, 100);
  const withdrawPct = Math.min((spentWithdrawals / WITHDRAWAL_LIMIT) * 100, 100);

  const safeUserId = userId ? String(userId).padStart(6, '0') : "000000";
  const safeInitial = user?.name ? String(user.name).charAt(0).toUpperCase() : "U";
  const theme = { bg: "#F3F4F6", boxBg: "#FFFFFF", primary: "#2563EB", border: "#E5E7EB", text: "#1F2937", textSec: "#6B7280" };

  if (loading) return <div style={{padding: "50px"}}>Connecting to FinVault...</div>;

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: "100vh", fontFamily: "sans-serif", padding: "20px" }}>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", backgroundColor: theme.boxBg, padding: "15px 30px", borderRadius: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: "20px", fontWeight: "bold", color: theme.text }}>FinVault <span style={{fontWeight:300, opacity:0.7}}>Enterprise</span></div>
        <div style={{ display: "flex", gap: "20px", fontSize: "14px", fontWeight: "500" }}>
          <span style={{ cursor: "pointer", color: theme.textSec }} onClick={() => window.location.href = "/dashboard"}>Dashboard</span>
          <span style={{ color: theme.primary, fontWeight: 'bold' }}>Profile</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", maxWidth: "1200px", margin: "0 auto", flexWrap: "wrap" }}>

        <div style={{ flex: "2", minWidth: "600px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ backgroundColor: theme.boxBg, borderRadius: "12px", overflow: "hidden", border: `1px solid ${theme.border}` }}>
            <div style={{ backgroundColor: "#3B82F6", height: "100px", position: "relative" }}>
              <div onClick={handleAvatarClick} style={{ position: "absolute", bottom: "-40px", left: "30px", width: "100px", height: "100px", backgroundColor: "#1E40AF", color: "white", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "48px", fontWeight: "bold", border: "5px solid white", overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                {avatar ? <img src={avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : safeInitial}
              </div>
            </div>
            <div style={{ padding: "50px 30px 20px 30px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "26px", color: theme.text }}>{user.name}</h2>
                <span style={{ backgroundColor: "#DBEAFE", color: "#1D4ED8", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", display: "inline-block", marginTop: "10px" }}>CLEARANCE: STANDARD</span>
              </div>
              <div style={{ textAlign: "right", color: theme.textSec, fontSize: "12px", fontWeight: "bold" }}>
                GLOBAL USER ID<br/><span style={{ color: theme.text, fontSize: "18px" }}>USR-{safeUserId}</span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: theme.boxBg, padding: "20px", borderRadius: "12px", border: `1px solid ${theme.border}` }}>
            <h3 style={{ margin: "0 0 20px 0", color: theme.text, fontSize: "16px" }}>Active Payment Methods</h3>
            <div style={{ display: "flex", gap: "20px" }}>
              <VirtualCard account={account} cardType="DEBIT" themeBg="linear-gradient(135deg, #1f2937, #374151)" network="Mastercard" />
              <VirtualCard account={account} cardType="CORPORATE CREDIT" themeBg="linear-gradient(135deg, #1e3a8a, #1e40af)" network="VISA" />
            </div>
          </div>
        </div>

        <div style={{ flex: "1", minWidth: "300px", display: "flex", flexDirection: "column", gap: "20px" }}>

          <div style={{ backgroundColor: theme.boxBg, padding: "20px", borderRadius: "12px", border: `1px solid ${theme.border}` }}>
            <h3 style={{ margin: "0 0 20px 0", color: theme.text, fontSize: "16px" }}>Security Settings</h3>

            <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: "10px", marginBottom: "10px" }}>
              <p style={{ fontSize: "12px", color: theme.textSec, fontWeight: "bold", marginBottom: "10px" }}>CHANGE PASSWORD</p>
              {statusMsg.text && <div style={{ padding: "10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", textAlign: "center", marginBottom: '10px', backgroundColor: statusMsg.type === "error" ? "#FEE2E2" : "#D1FAE5", color: statusMsg.type === "error" ? "#991B1B" : "#065F46" }}>{statusMsg.text}</div>}
              <input type="password" placeholder="Current Password" value={passwords.oldPassword} onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} style={{ width: "100%", padding: "12px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #CCC", boxSizing: "border-box" }} />
              <input type="password" placeholder="New Password" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #CCC", boxSizing: "border-box" }} />
              <button onClick={handleUpdatePassword} style={{ width: "100%", backgroundColor: theme.primary, color: "white", padding: "12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" }}>Update Password</button>
            </div>

            <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("userId"); window.location.href = "/login"; }} style={{ width: "100%", backgroundColor: "#FEE2E2", color: "#991B1B", padding: "12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold", marginTop: "15px" }}>Revoke Access (Sign Out)</button>
          </div>

          <div style={{ backgroundColor: theme.boxBg, padding: "20px", borderRadius: "12px", border: `1px solid ${theme.border}` }}>
            <h3 style={{ margin: "0 0 10px 0", color: theme.text, fontSize: "16px", textTransform: "uppercase" }}>Daily Limits</h3>

            {ledgerError && (
               <p style={{fontSize: "12px", color: "#DC2626", fontWeight: "bold", backgroundColor: "#FEE2E2", padding: "8px", borderRadius: "4px"}}>
                 ⚠️ Token Expired: Cannot sync live transactions. Please Sign Out and log back in.
               </p>
            )}

            <div style={{ marginBottom: "20px", marginTop: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "5px" }}><span style={{ color: theme.textSec }}>Transfers</span><span style={{ fontWeight: "bold" }}>₹{spentTransfers.toLocaleString('en-IN')} / ₹{TRANSFER_LIMIT.toLocaleString('en-IN')}</span></div>
              <div style={{ width: "100%", height: "8px", backgroundColor: "#E5E7EB", borderRadius: "10px" }}><div style={{ width: `${transferPct}%`, height: "100%", backgroundColor: theme.primary, borderRadius: "10px", transition: "width 1s" }}></div></div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "5px" }}><span style={{ color: theme.textSec }}>Withdrawals</span><span style={{ fontWeight: "bold" }}>₹{spentWithdrawals.toLocaleString('en-IN')} / ₹{WITHDRAWAL_LIMIT.toLocaleString('en-IN')}</span></div>
              <div style={{ width: "100%", height: "8px", backgroundColor: "#E5E7EB", borderRadius: "10px" }}><div style={{ width: `${withdrawPct}%`, height: "100%", backgroundColor: "#F59E0B", borderRadius: "10px", transition: "width 1s" }}></div></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;