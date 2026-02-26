// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
//
// function Register() {
//   const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "USER" });
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [passwordError, setPasswordError] = useState(""); // 👈 NEW: State to hold the security warning
//   const navigate = useNavigate();
//
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     // Clear the error message as soon as the user starts typing again
//     if (e.target.name === "password") setPasswordError("");
//   };
//
//   // --- CYBERSECURITY: Password Strength Validator ---
//   const validatePassword = (password) => {
//     if (password.length < 8) return "Must be at least 8 characters long.";
//     if (!/[A-Z]/.test(password)) return "Must contain at least one uppercase letter (A-Z).";
//     if (!/[a-z]/.test(password)) return "Must contain at least one lowercase letter (a-z).";
//     if (!/[0-9]/.test(password)) return "Must contain at least one number (0-9).";
//     if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Must contain at least one special character.";
//     return ""; // Empty string means it's secure!
//   };
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//
//     // 1. Run the security check
//     const errorMsg = validatePassword(formData.password);
//     if (errorMsg) {
//       setPasswordError(errorMsg); // Display the error under the box
//       return; // Stop the form submission
//     }
//
//     // 2. If secure, proceed to the backend
//     try {
//       // 🚀 PORT FIX: Pointing to User Service on 8082
//       await axios.post("http://localhost:8082/users/register", formData);
//       setShowSuccess(true);
//       setTimeout(() => {
//         setShowSuccess(false);
//         navigate("/login");
//       }, 3000);
//     } catch (error) {
//       alert("Registration Failed! Try a different email.");
//     }
//   };
//
//   const theme = { bg: "#F3F4F6", navy: "#0f172a", white: "#FFFFFF", primary: "#2563EB", textMain: "#1F2937", textSec: "#6B7280", border: "#E5E7EB", danger: "#EF4444" };
//
//   return (
//     <div style={{ display: "flex", height: "100vh", fontFamily: "-apple-system, sans-serif", overflow: "hidden", position: "relative" }}>
//
//       {/* 🟢 CENTERED SUCCESS MESSAGE */}
//       {showSuccess && (
//         <div style={{ position: "fixed", top: "40px", right: "15%", backgroundColor: "#ffffff", border: "1px solid #10b981", color: "#000000", padding: "12px 24px", borderRadius: "8px", zIndex: 1000, display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: "14px" }}>
//           Identity registered successfully ✅
//         </div>
//       )}
//
//       <style>
//         {`
//           @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
//           .animate-text { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
//           .watermark-bg { position: absolute; font-size: 110px; font-weight: 900; color: rgba(0,0,0,0.03); z-index: 0; transform: rotate(-10deg); white-space: nowrap; user-select: none; }
//           .reg-card { transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease; position: relative; z-index: 10; }
//           .reg-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
//         `}
//       </style>
//
//       {/* LEFT SIDE */}
//       <div style={{ flex: "0.4", backgroundColor: theme.navy, color: "white", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px" }}>
//         <h1 className="animate-text" style={{ fontSize: "24px", fontWeight: "600", letterSpacing: "1px", marginBottom: "60px", animationDelay: "0.2s" }}>FINVAULT <span style={{ opacity: 0.5 }}>ENTERPRISE</span></h1>
//         <h2 className="animate-text" style={{ fontSize: "36px", fontWeight: "700", marginBottom: "20px", animationDelay: "0.5s" }}>Join the Network.</h2>
//         <p className="animate-text" style={{ color: "#94a3b8", fontSize: "16px", lineHeight: "1.6", animationDelay: "0.8s" }}>Establish your global banking identity. Access institutional-grade security and manage your assets with precision.</p>
//       </div>
//
//       {/* RIGHT SIDE */}
//       <div style={{ flex: "0.6", backgroundColor: theme.bg, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
//         <div className="watermark-bg" style={{ top: "5%", left: "5%" }}>REGISTRATION</div>
//         <div className="watermark-bg" style={{ bottom: "10%", right: "5%" }}>COMPLIANCE</div>
//
//         <div className="reg-card" style={{ width: "100%", maxWidth: "420px", backgroundColor: theme.white, padding: "48px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
//           <h3 style={{ color: theme.textMain, fontSize: "22px", fontWeight: "700", marginBottom: "8px", textAlign: "center" }}>Create Account</h3>
//           <p style={{ color: theme.textSec, fontSize: "14px", marginBottom: "32px", textAlign: "center" }}>Enter your credentials to get started.</p>
//
//           <form onSubmit={handleSubmit}>
//             <div style={{ marginBottom: "20px" }}>
//               <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>Full Name</label>
//               <input type="text" name="name" onChange={handleChange} required style={{ width: "100%", padding: "12px", borderRadius: "6px", border: `1px solid ${theme.border}`, backgroundColor: "#F9FAFB" }} />
//             </div>
//
//             <div style={{ marginBottom: "20px" }}>
//               <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>Official Email</label>
//               <input type="email" name="email" onChange={handleChange} required style={{ width: "100%", padding: "12px", borderRadius: "6px", border: `1px solid ${theme.border}`, backgroundColor: "#F9FAFB" }} />
//             </div>
//
//             <div style={{ marginBottom: "32px" }}>
//               <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>Secure Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 onChange={handleChange}
//                 required
//                 style={{ width: "100%", padding: "12px", borderRadius: "6px", border: `1px solid ${passwordError ? theme.danger : theme.border}`, backgroundColor: "#F9FAFB", transition: "border 0.3s" }}
//               />
//               {/* 👇 NEW: Conditional rendering for the error message 👇 */}
//               {passwordError && (
//                 <div style={{ color: theme.danger, fontSize: "12px", marginTop: "8px", display: "flex", alignItems: "center", gap: "4px", fontWeight: "500" }}>
//                   <span>🔒</span> {passwordError}
//                 </div>
//               )}
//             </div>
//
//             <button type="submit" style={{ width: "100%", backgroundColor: theme.primary, color: "white", padding: "14px", borderRadius: "6px", border: "none", fontWeight: "600", cursor: "pointer" }}>Register Identity</button>
//           </form>
//
//           <p style={{ textAlign: "center", marginTop: "24px", fontSize: "13px" }}>Already registered? <a href="/login" style={{ color: theme.primary, textDecoration: "none" }}>Sign In</a></p>
//         </div>
//       </div>
//     </div>
//   );
// }
//
// export default Register;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "USER" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  // 👇 NEW: State to track if the password should be visible
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "password") setPasswordError("");
  };

  const validatePassword = (password) => {
    if (password.length < 8) return "Must be at least 8 characters long.";
    if (!/[A-Z]/.test(password)) return "Must contain at least one uppercase letter (A-Z).";
    if (!/[a-z]/.test(password)) return "Must contain at least one lowercase letter (a-z).";
    if (!/[0-9]/.test(password)) return "Must contain at least one number (0-9).";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Must contain at least one special character.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMsg = validatePassword(formData.password);
    if (errorMsg) {
      setPasswordError(errorMsg);
      return;
    }

    try {
      await axios.post("http://localhost:8082/users/register", formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/login");
      }, 3000);
    } catch (error) {
      alert("Registration Failed! Try a different email.");
    }
  };

  const theme = { bg: "#F3F4F6", navy: "#0f172a", white: "#FFFFFF", primary: "#2563EB", textMain: "#1F2937", textSec: "#6B7280", border: "#E5E7EB", danger: "#EF4444" };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "-apple-system, sans-serif", overflow: "hidden", position: "relative" }}>

      {showSuccess && (
        <div style={{ position: "fixed", top: "40px", right: "15%", backgroundColor: "#ffffff", border: "1px solid #10b981", color: "#000000", padding: "12px 24px", borderRadius: "8px", zIndex: 1000, display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: "14px" }}>
          Identity registered successfully ✅
        </div>
      )}

      <style>
        {`
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .animate-text { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
          .watermark-bg { position: absolute; font-size: 110px; font-weight: 900; color: rgba(0,0,0,0.03); z-index: 0; transform: rotate(-10deg); white-space: nowrap; user-select: none; }
          .reg-card { transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease; position: relative; z-index: 10; }
          .reg-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
        `}
      </style>

      {/* LEFT SIDE */}
      <div style={{ flex: "0.4", backgroundColor: theme.navy, color: "white", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px" }}>
        <h1 className="animate-text" style={{ fontSize: "24px", fontWeight: "600", letterSpacing: "1px", marginBottom: "60px", animationDelay: "0.2s" }}>FINVAULT <span style={{ opacity: 0.5 }}>ENTERPRISE</span></h1>
        <h2 className="animate-text" style={{ fontSize: "36px", fontWeight: "700", marginBottom: "20px", animationDelay: "0.5s" }}>Join the Network.</h2>
        <p className="animate-text" style={{ color: "#94a3b8", fontSize: "16px", lineHeight: "1.6", animationDelay: "0.8s" }}>Establish your global banking identity. Access institutional-grade security and manage your assets with precision.</p>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ flex: "0.6", backgroundColor: theme.bg, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
        <div className="watermark-bg" style={{ top: "5%", left: "5%" }}>REGISTRATION</div>
        <div className="watermark-bg" style={{ bottom: "10%", right: "5%" }}>COMPLIANCE</div>

        <div className="reg-card" style={{ width: "100%", maxWidth: "420px", backgroundColor: theme.white, padding: "48px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
          <h3 style={{ color: theme.textMain, fontSize: "22px", fontWeight: "700", marginBottom: "8px", textAlign: "center" }}>Create Account</h3>
          <p style={{ color: theme.textSec, fontSize: "14px", marginBottom: "32px", textAlign: "center" }}>Enter your credentials to get started.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>Full Name</label>
              <input type="text" name="name" onChange={handleChange} required style={{ width: "100%", padding: "12px", borderRadius: "6px", border: `1px solid ${theme.border}`, backgroundColor: "#F9FAFB", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>Official Email</label>
              <input type="email" name="email" onChange={handleChange} required style={{ width: "100%", padding: "12px", borderRadius: "6px", border: `1px solid ${theme.border}`, backgroundColor: "#F9FAFB", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>Secure Password</label>

              {/* 👇 NEW: Relative container to hold the input and the eye button together */}
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"} // Toggles between dots and text
                  name="password"
                  onChange={handleChange}
                  required
                  // Added paddingRight: "40px" so text doesn't hide behind the button
                  style={{ width: "100%", padding: "12px", paddingRight: "40px", borderRadius: "6px", border: `1px solid ${passwordError ? theme.danger : theme.border}`, backgroundColor: "#F9FAFB", transition: "border 0.3s", boxSizing: "border-box" }}
                />

                {/* 👇 The Eye Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: theme.textSec
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    // Eye Open SVG
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    // Eye Closed (Crossed out) SVG
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {passwordError && (
                <div style={{ color: theme.danger, fontSize: "12px", marginTop: "8px", display: "flex", alignItems: "center", gap: "4px", fontWeight: "500" }}>
                  <span>🔒</span> {passwordError}
                </div>
              )}
            </div>

            <button type="submit" style={{ width: "100%", backgroundColor: theme.primary, color: "white", padding: "14px", borderRadius: "6px", border: "none", fontWeight: "600", cursor: "pointer" }}>Register Identity</button>
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "13px" }}>Already registered? <a href="/login" style={{ color: theme.primary, textDecoration: "none" }}>Sign In</a></p>
        </div>
      </div>
    </div>
  );
}

export default Register;