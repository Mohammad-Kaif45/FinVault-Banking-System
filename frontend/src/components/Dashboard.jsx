import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 👇 Get Name from storage for the UI
  const userName = localStorage.getItem("name") || "User";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get Token AND User ID
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          window.location.href = "/login";
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        // 2. 👇 DYNAMIC FETCH: Get accounts for THIS User ID
        console.log(`Fetching accounts for user: ${userId}...`);
        const response = await axios.get(`http://localhost:8080/accounts/user/${userId}`, config);

        console.log("Data Received:", response.data);

        // 3. Handle the List (We pick the first account)
        if (response.data && response.data.length > 0) {
            setAccount(response.data[0]);
        } else {
            setAccount(null); // User exists but has no accounts
        }
        setLoading(false);

      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Could not load data. Check console.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <h2 style={{padding: "20px"}}>🌀 Loading your dashboard...</h2>;
  if (error) return <h2 style={{padding: "20px", color: "red"}}>⚠️ {error}</h2>;

  return (
    <div style={{ padding: "50px", fontFamily: "Arial" }}>
      {/* 👇 Personal Welcome Message */}
      <h1>👋 Welcome, {userName}!</h1>
      <h3>Your Financial Overview:</h3>

      {account ? (
        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px", maxWidth: "400px" }}>
          <h3>Account ID: {account.id}</h3>
          <p><strong>Type:</strong> {account.accountType}</p>
          <p style={{ fontSize: "24px", color: "green", fontWeight: "bold" }}>
             Balance: ${account.balance}
          </p>

          {/* 👇 ADDED WITHDRAW & TRANSFER BUTTONS 👇 */}
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
                onClick={() => window.location.href = `/withdraw/${account.id}`}
                style={{ flex: 1, padding: "10px", backgroundColor: "#ffc107", border: "none", cursor: "pointer", fontWeight: "bold" }}
            >
                💸 Withdraw
            </button>

            <button
                onClick={() => window.location.href = `/transfer/${account.id}`}
                style={{ flex: 1, padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
            >
                🔄 Transfer
            </button>
          </div>

        </div>
      ) : (
        <div style={{ border: "2px dashed #ccc", padding: "30px", maxWidth: "400px", textAlign: "center" }}>
            <h3>No Accounts Found</h3>
            <p>It looks like you are new here!</p>
            <button
                onClick={() => window.location.href = "/create-account"}
                style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer", fontSize: "16px" }}
            >
                ➕ Create Your First Account
            </button>
        </div>
      )}

      <button
        onClick={() => {
            // Clear everything on Logout
            localStorage.clear();
            window.location.href = "/login";
        }}
        style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#ff4d4d", color: "white", border: "none", cursor: "pointer" }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;