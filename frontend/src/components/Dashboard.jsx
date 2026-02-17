import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get the Token
        const token = localStorage.getItem("token");

        // 2. If no token, go to Login
        if (!token) {
          window.location.href = "/login";
          return;
        }

        // 3. Prepare the Key (Header)
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        // 4. Fetch Data (Account ID 1)
        console.log("Fetching data...");
        const response = await axios.get("http://localhost:8080/accounts/1", config);

        console.log("Data Received:", response.data);
        setAccount(response.data);
        setLoading(false);

      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Could not load data. Check console.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- SAFE RENDERING (Prevents the White Screen Crash) ---
  if (loading) return <h2 style={{padding: "20px"}}>🌀 Loading your dashboard...</h2>;
  if (error) return <h2 style={{padding: "20px", color: "red"}}>⚠️ {error}</h2>;

  return (
    <div style={{ padding: "50px", fontFamily: "Arial" }}>
      <h1>📊 Your Dashboard</h1>

      {/* Only show this box if account exists */}
      {account ? (
        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px", maxWidth: "400px" }}>
          <h3>Account ID: {account.id}</h3>
          <p><strong>Type:</strong> {account.accountType}</p>
          <p style={{ fontSize: "24px", color: "green", fontWeight: "bold" }}>
             Balance: ${account.balance}
          </p>
        </div>
      ) : (
        <p>No account data found.</p>
      )}

      <button
        onClick={() => {
            localStorage.removeItem("token");
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