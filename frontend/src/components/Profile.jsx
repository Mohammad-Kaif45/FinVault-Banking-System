import { useEffect, useState } from "react";
import axios from "axios";
import VirtualCard from './VirtualCard';

function Profile() {
  // 1. SAFEGUARD: Pull the name directly from localStorage
  const storedName = localStorage.getItem("name") || "Kaif Ansari";
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // 2. Initialize state with the stored name
  const [user, setUser] = useState({ name: storedName, email: "", phone: "" });
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ email: "", phone: "" });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !userId) { window.location.href = "/login"; return; }
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const userRes = await axios.get(`http://localhost:8082/users/${userId}`, config);

        // 3. FIX: Merge backend data, but keep the storedName if backend name is missing!
        setUser({
          name: userRes.data.name || storedName,
          email: userRes.data.email || "",
          phone: userRes.data.phone || ""
        });
        setEditData({ email: userRes.data.email || "", phone: userRes.data.phone || "" });

        const accRes = await axios.get(`http://localhost:8085/accounts/user/${userId}`, config);
        if (accRes.data && accRes.data.length > 0) {
            setAccount(accRes.data[0]);
            const txRes = await axios.get(`http://localhost:8081/transactions/history/${accRes.data[0].accountNumber}`, config);
            setTransactions(txRes.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, token, storedName]);

  const today = new Date().toISOString().split('T')[0];
  const TRANSFER_LIMIT = 500000;
  const WITHDRAWAL_LIMIT = 100000;

  let spentTransfers = 0;
  let spentWithdrawals = 0;

  transactions.forEach(t => {
    if (t.date && t.date.includes(today)) {
      if (t.type === 'TRANSFER') spentTransfers += t.amount;
      if (t.type === 'WITHDRAWAL') spentWithdrawals += t.amount;
    }
  });

  const transferPct = Math.min((spentTransfers / TRANSFER_LIMIT) * 100, 100);
  const withdrawPct = Math.min((spentWithdrawals / WITHDRAWAL_LIMIT) * 100, 100);

  const handleUpdateDetails = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:8082/users/${userId}`, editData, config);
      setUser({ ...user, email: editData.email, phone: editData.phone });
      setEditMode(false);
      setStatusMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setStatusMsg({ type: "error", text: "Failed to update profile." });
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`http://localhost:8082/users/change-password`, {
        userId: userId,
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      }, config);
      setStatusMsg({ type: "success", text: "Password updated securely." });
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setStatusMsg({ type: "error", text: "Invalid current password." });
    }
  };

  const theme = { bg: "#F3F4F6", boxBg: "#FFFFFF", primary: "#2563EB", border: "#E5E7EB", text: "#1F2937", textSec: "#6B7280" };

  if (loading) return <div style={{padding: "50px", fontFamily: "sans-serif"}}>Loading Enterprise Security Data...</div>;

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: "100vh", fontFamily: "sans-serif", padding: "20px" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", backgroundColor: theme.boxBg, padding: "15px 30px", borderRadius: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: "20px", fontWeight: "bold", color: theme.text }}>FinVault</div>
        <div style={{ display: "flex", gap: "20px", fontSize: "14px", fontWeight: "500" }}>
          <span style={{ cursor: "pointer", color: theme.textSec }} onClick={() => window.location.href = "/dashboard"}>Dashboard</span>
          <span style={{ color: theme.primary }}>Profile</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", maxWidth: "1200px", margin: "0 auto", flexWrap: "wrap" }}>

        <div style={{ flex: "2", minWidth: "600px", display: "flex", flexDirection: "column", gap: "20px" }}>

          <div style={{ backgroundColor: theme.boxBg, borderRadius: "12px", overflow: "hidden", border: `1px solid ${theme.border}` }}>
            <div style={{ backgroundColor: "#3B82F6", height: "100px", position: "relative" }}>
              <div style={{ position: "absolute", bottom: "-30px", left: "30px", width: "80px", height: "80px", backgroundColor: "#1E40AF", color: "white", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "36px", fontWeight: "bold", border: "4px solid white" }}>
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
            <div style={{ padding: "40px 30px 20px 30px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "24px", color: theme.text }}>{user.name}</h2>
                <span style={{ backgroundColor: "#DBEAFE", color: "#1D4ED8", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", display: "inline-block", marginTop: "10px" }}>CLEARANCE: STANDARD</span>
              </div>
              <div style={{ textAlign: "right", color: theme.textSec, fontSize: "12px", fontWeight: "bold" }}>
                GLOBAL USER ID<br/><span style={{ color: theme.text, fontSize: "16px" }}>USR-{userId ? userId.padStart(6, '0') : "000000"}</span>
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

          <div style={{ backgroundColor: theme.boxBg, padding: "20px", borderRadius: "12px", border: `1px solid ${theme.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, color: theme.text, fontSize: "16px" }}>Personal Details</h3>
              <button onClick={() => setEditMode(!editMode)} style={{ backgroundColor: editMode ? "#F3F4F6" : theme.primary, color: editMode ? theme.text : "white", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                {editMode ? "Cancel" : "Edit Details"}
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ fontSize: "12px", color: theme.textSec, fontWeight: "bold" }}>EMAIL ADDRESS</label>
                {editMode ? (
                  <input style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "6px", border: "1px solid #CCC" }} value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} />
                ) : (
                  <p style={{ margin: "5px 0 0 0", color: theme.primary, fontWeight: "bold" }}>{user.email || "Not Provided"}</p>
                )}
              </div>
              <div>
                <label style={{ fontSize: "12px", color: theme.textSec, fontWeight: "bold" }}>REGISTERED PHONE</label>
                {editMode ? (
                  <input style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "6px", border: "1px solid #CCC" }} value={editData.phone} onChange={(e) => setEditData({...editData, phone: e.target.value})} />
                ) : (
                  <p style={{ margin: "5px 0 0 0", color: theme.primary, fontWeight: "bold" }}>{user.phone || "Not Provided"}</p>
                )}
              </div>
              {editMode && (
                <button onClick={handleUpdateDetails} style={{ backgroundColor: "#10B981", color: "white", padding: "10px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold", marginTop: "10px" }}>Save Changes</button>
              )}
            </div>
          </div>

        </div>

        <div style={{ flex: "1", minWidth: "300px", display: "flex", flexDirection: "column", gap: "20px" }}>

          <div style={{ backgroundColor: theme.boxBg, padding: "20px", borderRadius: "12px", border: `1px solid ${theme.border}` }}>
            <h3 style={{ margin: "0 0 20px 0", color: theme.text, fontSize: "16px" }}>Security Settings</h3>

            <div style={{ marginBottom: "20px" }}>
              <span style={{ color: "#10B981", fontSize: "12px", fontWeight: "bold" }}>● Active & Verified</span>
              <p style={{ fontSize: "12px", color: theme.textSec, margin: "10px 0 5px 0" }}>Last Login IPv4</p>
              <p style={{ fontSize: "14px", fontWeight: "bold", margin: 0 }}>192.168.1.45 (Local)</p>
            </div>

            <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: "20px", marginBottom: "20px" }}>
              <p style={{ fontSize: "12px", color: theme.textSec, fontWeight: "bold", marginBottom: "10px" }}>CHANGE PASSWORD</p>
              <input type="password" placeholder="Current Password" value={passwords.oldPassword} onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #CCC", boxSizing: "border-box" }} />
              <input type="password" placeholder="New Password" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #CCC", boxSizing: "border-box" }} />
              <button onClick={handleUpdatePassword} style={{ width: "100%", backgroundColor: theme.primary, color: "white", padding: "10px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" }}>Update Password</button>
            </div>

            {statusMsg.text && (
              <div style={{ padding: "10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", textAlign: "center", backgroundColor: statusMsg.type === "error" ? "#FEE2E2" : "#D1FAE5", color: statusMsg.type === "error" ? "#991B1B" : "#065F46" }}>
                {statusMsg.text}
              </div>
            )}

            <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} style={{ width: "100%", backgroundColor: "#FEE2E2", color: "#991B1B", padding: "12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold", marginTop: "20px" }}>
              Revoke Access (Sign Out)
            </button>
          </div>

          <div style={{ backgroundColor: theme.boxBg, padding: "20px", borderRadius: "12px", border: `1px solid ${theme.border}` }}>
            <h3 style={{ margin: "0 0 20px 0", color: theme.text, fontSize: "16px", textTransform: "uppercase" }}>Daily Limits</h3>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "5px" }}>
                <span style={{ color: theme.textSec }}>Transfers</span>
                <span style={{ fontWeight: "bold" }}>₹{spentTransfers.toLocaleString('en-IN')} / ₹{TRANSFER_LIMIT.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ width: "100%", height: "6px", backgroundColor: "#E5E7EB", borderRadius: "10px" }}>
                <div style={{ width: `${transferPct}%`, height: "100%", backgroundColor: theme.primary, borderRadius: "10px", transition: "width 1s" }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "5px" }}>
                <span style={{ color: theme.textSec }}>Withdrawals</span>
                <span style={{ fontWeight: "bold" }}>₹{spentWithdrawals.toLocaleString('en-IN')} / ₹{WITHDRAWAL_LIMIT.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ width: "100%", height: "6px", backgroundColor: "#E5E7EB", borderRadius: "10px" }}>
                <div style={{ width: `${withdrawPct}%`, height: "100%", backgroundColor: "#F59E0B", borderRadius: "10px", transition: "width 1s" }}></div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;