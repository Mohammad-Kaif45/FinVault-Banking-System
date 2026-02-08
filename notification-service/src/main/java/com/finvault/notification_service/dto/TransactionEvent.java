package com.finvault.notification_service.dto;

import java.math.BigDecimal;

public class TransactionEvent {
    private String transactionType;
    private String sourceAccountId;
    private String targetAccountId;
    private BigDecimal amount;
    private String status;

    // --- 1. NO-ARGS CONSTRUCTOR (Required for JSON/Jackson) ---
    public TransactionEvent() {
    }

    // --- 2. ALL-ARGS CONSTRUCTOR (This fixes your error!) ---
    public TransactionEvent(String transactionType, String sourceAccountId, String targetAccountId, BigDecimal amount, String status) {
        this.transactionType = transactionType;
        this.sourceAccountId = sourceAccountId;
        this.targetAccountId = targetAccountId;
        this.amount = amount;
        this.status = status;
    }

    // --- 3. GETTERS AND SETTERS ---
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public String getSourceAccountId() { return sourceAccountId; }
    public void setSourceAccountId(String sourceAccountId) { this.sourceAccountId = sourceAccountId; }

    public String getTargetAccountId() { return targetAccountId; }
    public void setTargetAccountId(String targetAccountId) { this.targetAccountId = targetAccountId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}