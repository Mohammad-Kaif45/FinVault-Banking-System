import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  // Pulling secure identity data stored during login
  const userName = localStorage.getItem("name") || "Enterprise User";
  const userId = localStorage.getItem("userId") || "Unknown";
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const theme = { bg: "#F3F4F6", header: "#111827", cardBg: "#FFFFFF", primary: "#2563EB", textMain: "#1F2937", textSec: "#6B7280", border: "#E5E7EB" };

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

      <div style={{ padding: "60px 10%", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "30px", color: theme.textMain }}>Institutional Identity</h1>

        <div style={{ backgroundColor: theme.cardBg, borderRadius: "12px", border: `1px solid ${theme.border}`, overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>

          {/* Top Banner */}
          <div style={{ height: "120px", backgroundColor: theme.navy, background: "linear-gradient(90deg, #0f172a 0%, #1e293b 100%)", position: "relative" }}>
            <div style={{ position: "absolute", bottom: "-40px", left: "40px", width: "80px", height: "80px", backgroundColor: theme.white, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `4px solid ${theme.bg}` }}>
              {/* Initials Avatar */}
              <span style={{ fontSize: "28px", fontWeight: "700", color: theme.primary }}>
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <div style={{ padding: "60px 40px 40px 40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
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

            <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: "30px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
              <div>
                <div style={{ fontSize: "13px", color: theme.textSec, marginBottom: "4px" }}>Authentication Status</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "500", color: theme.textMain }}>
                  <span style={{ width: "8px", height: "8px", backgroundColor: "#10B981", borderRadius: "50%", display: "inline-block" }}></span>
                  Active & Verified
                </div>
              </div>
              <div>
                <div style={{ fontSize: "13px", color: theme.textSec, marginBottom: "4px" }}>Security Token</div>
                <div style={{ fontWeight: "500", color: theme.textMain, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {token ? `${token.substring(0, 15)}...` : "None"}
                </div>
              </div>
            </div>

            <div style={{ marginTop: "50px", borderTop: `1px solid ${theme.border}`, paddingTop: "30px", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleLogout}
                style={{ backgroundColor: "#FEE2E2", color: "#991B1B", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "600", cursor: "pointer", transition: "background-color 0.2s" }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#FECACA"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#FEE2E2"}
              >
                Revoke Access (Sign Out)
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;