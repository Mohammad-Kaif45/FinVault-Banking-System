import React, { useState } from 'react';

const VirtualCard = ({ account, cardType, themeBg, network }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const cardNumber = account?.accountNumber ? account.accountNumber.substring(0, 16) : "4532124589003214";
  const cvv = cardType === "DEBIT" ? "842" : "109";
  const expiry = cardType === "DEBIT" ? "12/28" : "05/27";
  const cardHolder = localStorage.getItem("name") || "FinVault User";

  const styles = {
    cardWrapper: { perspective: "1000px", width: "100%", height: "200px", cursor: "pointer", flex: 1 },
    cardInner: { position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transition: "transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" },
    front: { position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", background: themeBg, borderRadius: "12px", padding: "20px", color: "white", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box" },
    back: { position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", background: themeBg, borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", transform: "rotateY(180deg)", display: "flex", flexDirection: "column", overflow: "hidden", boxSizing: "border-box" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "600", fontSize: "14px", letterSpacing: "1px" },
    number: { fontSize: "20px", letterSpacing: "3px", fontFamily: "monospace", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" },
    footer: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", textTransform: "uppercase", fontSize: "10px", letterSpacing: "1px" },
    magStripe: { width: "100%", height: "40px", backgroundColor: "#000", marginTop: "20px" },
    cvvStrip: { width: "100%", height: "30px", backgroundColor: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 15px", color: "black", fontFamily: "monospace", fontSize: "14px", fontStyle: "italic", marginTop: "10px", boxSizing: "border-box" }
  };

  return (
    <div style={styles.cardWrapper} onClick={() => setIsFlipped(!isFlipped)}>
      <div style={styles.cardInner}>
        {/* FRONT */}
        <div style={styles.front}>
          <div style={styles.header}>
            <span>{cardType}</span>
            <span style={{ fontStyle: "italic", fontSize: "16px", fontWeight: "bold" }}>{network}</span>
          </div>
          <div style={styles.number}>{cardNumber.match(/.{1,4}/g)?.join(' ') || cardNumber}</div>
          <div style={styles.footer}>
            <div>{cardHolder}</div>
            <div>{expiry}</div>
          </div>
        </div>
        {/* BACK */}
        <div style={styles.back}>
          <div style={styles.magStripe}></div>
          <div style={styles.cvvStrip}><span style={{ backgroundColor: "white", padding: "2px 6px" }}>{cvv}</span></div>
        </div>
      </div>
    </div>
  );
};

export default VirtualCard;