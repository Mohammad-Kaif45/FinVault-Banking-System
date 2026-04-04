import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Dashboard() {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTx, setLoadingTx] = useState(false);
  const [error, setError] = useState(null);

  const userName = localStorage.getItem("name") || "Client";

  // 1. Fetch Account Details
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token || !userId) { window.location.href = "/login"; return; }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`http://localhost:8085/accounts/user/${userId}`, config);

        if (response.data && response.data.length > 0) {
            setAccount(response.data[0]);
        } else {
            setAccount(null);
        }
        setLoading(false);
      } catch (err) {
        setError("System unavailable. Please contact support.");
        setLoading(false);
      }
    };
    fetchAccount();
  }, []);

  // 2. Fetch Transaction History
  useEffect(() => {
    if (account && account.accountNumber) {
      const fetchTransactions = async () => {
        setLoadingTx(true);
        try {
          const token = localStorage.getItem("token");
          const config = { headers: { Authorization: `Bearer ${token}` } };

          const res = await axios.get(`http://localhost:8081/transactions/history/${account.accountNumber}`, config);
          setTransactions(res.data);
        } catch (err) {
          console.error("Ledger fetch error:", err);
        } finally {
          setLoadingTx(false);
        }
      };
      fetchTransactions();
    }
  }, [account]);

  // --- CORPORATE STYLES (PURE INLINE) ---
  const theme = { bg: "#F3F4F6", header: "#111827", cardBg: "#FFFFFF", primary: "#2563EB", textMain: "#1F2937", textSec: "#6B7280", border: "#E5E7EB" };

  // --- HELPER TO FORMAT TRANSACTIONS ---
  const getTxDetails = (tx) => {
    const isOutgoing = tx.fromAccountNumber === account.accountNumber;
    let type = "Transfer";
    let counterpart = isOutgoing ? `To: ${tx.toAccountNumber}` : `From: ${tx.fromAccountNumber}`;

    if (!tx.fromAccountNumber) { type = "Deposit"; counterpart = "Branch/ATM"; }
    if (!tx.toAccountNumber) { type = "Withdrawal"; counterpart = "Branch/ATM"; }

    return {
      type,
      counterpart,
      amountPrefix: isOutgoing ? "-" : "+",
      amountColor: isOutgoing ? theme.textMain : "#10B981"
    };
  };

  // --- HELPER TO FIX THE 1970 DATE BUG ---
  const parseDate = (timestamp) => {
    if (!timestamp) return new Date();
    if (Array.isArray(timestamp)) {
      return new Date(timestamp[0], timestamp[1] - 1, timestamp[2], timestamp[3], timestamp[4], timestamp[5] || 0);
    }
    return new Date(timestamp);
  };

  // --- PROFESSIONAL PDF GENERATION LOGIC ---
  const downloadStatement = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text("FINVAULT ENTERPRISE", 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128);
    doc.text("Official Account Statement", 14, 28);
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);
    doc.text(`Account Holder: ${userName}`, 14, 42);
    doc.text(`Account Number: ${account.accountNumber}`, 14, 48);
    doc.text(`Statement Date: ${new Date().toLocaleDateString('en-IN')}`, 14, 54);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Available Balance: INR ${account.balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}`, 14, 62);
    const tableColumn = ["Date & Time", "Transaction Type", "Counterpart", "Amount (INR)", "Status"];
    const tableRows = [];
    transactions.forEach(tx => {
      const { type, counterpart, amountPrefix } = getTxDetails(tx);
      const txDate = parseDate(tx.timestamp);
      const rowData = [
        txDate.toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
        type,
        counterpart,
        `${amountPrefix}${tx.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}`,
        tx.status.split('_').pop()
      ];
      tableRows.push(rowData);
    });
    autoTable(doc, {
      startY: 70,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      styles: { fontSize: 10, cellPadding: 4 }
    });
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(45);
      doc.setTextColor(240, 243, 248);
      doc.text("FINVAULT STATEMENT", 105, 150, { align: "center", angle: 45 });
      doc.setFontSize(9);
      doc.setTextColor(156, 163, 175);
      doc.text("Confidential - Generated securely by the FinVault Enterprise Banking System.", 14, doc.internal.pageSize.height - 10);
    }
    doc.save(`FinVault_Statement_${account.accountNumber}.pdf`);
  };

  // --- DYNAMIC GREETING LOGIC ---
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) return <div style={{padding: "50px", fontFamily: "sans-serif"}}>Loading Enterprise Portal...</div>;

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: "100vh", fontFamily: "sans-serif", paddingBottom: "60px" }}>
      {/* HEADER */}
      <div style={{ backgroundColor: theme.header, color: "white", padding: "0 10%", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: "20px", fontWeight: "600" }}>FinVault <span style={{fontWeight:"300", opacity:0.7}}>Enterprise</span></div>
        <div style={{ fontSize: "14px", display: "flex", gap: "20px", alignItems: "center" }}>
            <span style={{fontWeight: "500"}}>{userName}</span>
            <span style={{color: "#60A5FA", cursor: "pointer", fontWeight: "500"}} onClick={() => window.location.href = "/profile"}>Profile</span>

            <span style={{color: "#9CA3AF", cursor: "pointer"}} onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("userId"); window.location.href = "/login"; }}>Sign Out</span>

        </div>
      </div>

      <div style={{ padding: "40px 10%", maxWidth: "1200px", margin: "0 auto" }}>

        {/* 👇 UPDATED DYNAMIC GREETING HEADER 👇 */}
        <h1 style={{ fontSize: "24px", fontWeight: "500", marginBottom: "24px", color: theme.textMain }}>
          {getGreeting()}, {userName.split(' ')[0]}
          <span style={{display: 'block', fontSize: '14px', color: theme.textSec, marginTop: '6px', fontWeight: "400"}}>Here is your financial summary.</span>
        </h1>
        {/* 👆 --------------------------------- 👆 */}

        {account ? (
          <>
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
              {/* QUICK ACTIONS */}
              <div style={{ backgroundColor: theme.cardBg, borderRadius: "8px", border: `1px solid ${theme.border}`, padding: "24px" }}>
                <div style={{fontSize: "12px", color: theme.textSec, fontWeight: "600", marginBottom: "15px"}}>QUICK ACTIONS</div>
                <button style={{ width: "100%", backgroundColor: theme.primary, color: "white", padding: "12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "600", marginBottom: "10px" }} onClick={() => window.location.href = `/transfer/${account.id}`}>Transfer Funds &rarr;</button>
                <button style={{ width: "100%", backgroundColor: "#10B981", color: "white", padding: "12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "600", marginBottom: "10px", transition: "opacity 0.2s" }} onClick={() => window.location.href = `/deposit/${account.id}`}>Deposit Capital &darr;</button>
                <button style={{ width: "100%", backgroundColor: "white", border: `1px solid ${theme.primary}`, color: theme.primary, padding: "12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }} onClick={() => window.location.href = `/withdraw/${account.id}`}>Withdraw Cash</button>
              </div>
            </div>
            {/* TRANSACTION HISTORY TABLE */}
            <div style={{ marginTop: "24px", backgroundColor: theme.cardBg, borderRadius: "8px", border: `1px solid ${theme.border}`, padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div style={{ fontSize: "16px", fontWeight: "600", color: theme.textMain }}>Transaction History</div>
                <button onClick={downloadStatement} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "white", border: `1px solid ${theme.border}`, color: theme.textMain, padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "500" }}>📄 Download Statement</button>
              </div>
              {loadingTx ? (
                 <div style={{ color: theme.textSec, fontSize: "14px", padding: "20px 0" }}>Syncing ledger data...</div>
              ) : transactions.length > 0 ? (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${theme.border}`, color: theme.textSec, fontSize: "12px", textTransform: "uppercase" }}>
                        <th style={{ padding: "12px 0", fontWeight: "600" }}>Date & Time</th>
                        <th style={{ padding: "12px 0", fontWeight: "600" }}>Type</th>
                        <th style={{ padding: "12px 0", fontWeight: "600" }}>Details</th>
                        <th style={{ padding: "12px 0", fontWeight: "600", textAlign: "right" }}>Amount</th>
                        <th style={{ padding: "12px 0", fontWeight: "600", textAlign: "center" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => {
                        const { type, counterpart, amountPrefix, amountColor } = getTxDetails(tx);
                        const displayDate = parseDate(tx.timestamp);
                        return (
                          <tr key={tx.id} style={{ borderBottom: `1px solid ${theme.border}`, fontSize: "14px" }}>
                            <td style={{ padding: "16px 0", color: theme.textSec }}>{displayDate.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                            <td style={{ padding: "16px 0", fontWeight: "500" }}>{type}</td>
                            <td style={{ padding: "16px 0", color: theme.textSec }}>{counterpart}</td>
                            <td style={{ padding: "16px 0", fontWeight: "600", color: amountColor, textAlign: "right" }}>{amountPrefix}₹{tx.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                            <td style={{ padding: "16px 0", textAlign: "center" }}>
                              <span style={{ backgroundColor: tx.status.includes("SUCCESS") ? "#DEF7EC" : "#FDE8E8", color: tx.status.includes("SUCCESS") ? "#03543F" : "#9B1C1C", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "600" }}>{tx.status.split('_').pop()}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : ( <div style={{ textAlign: "center", padding: "40px", color: theme.textSec, fontSize: "14px" }}>No transactions found.</div> )}
            </div>
          </>
        ) : (
          <div style={{ backgroundColor: theme.cardBg, borderRadius: "8px", border: `1px solid ${theme.border}`, padding: "60px", textAlign: "center" }}>
            <h3 style={{ color: theme.textMain }}>No Accounts Found</h3>
            <button style={{ backgroundColor: theme.primary, color: "white", padding: "12px 24px", borderRadius: "6px", border: "none", marginTop: "20px", cursor: "pointer" }} onClick={() => window.location.href = "/create-account"}>Open New Account</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;