package com.finvault.transaction_service.controller;

import com.finvault.transaction_service.entity.Transaction;
import com.finvault.transaction_service.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // 1. DEPOSIT
    @PostMapping("/deposit")
    public Transaction deposit(@RequestBody DepositRequest request) {
        return transactionService.depositMoney(request.getAccountId(), request.getAmount());
    }

    // 2. WITHDRAW
    @PostMapping("/withdraw")
    public Transaction withdraw(@RequestBody DepositRequest request) {
        return transactionService.withdrawMoney(request.getAccountId(), request.getAmount());
    }

    // 3. TRANSFER (UPDATED TO USE JSON BODY)
    @PostMapping("/transfer")
    public Transaction transfer(@RequestBody TransferRequest request) {
        return transactionService.transferMoney(
                request.getFromAccountId(),
                request.getToAccountId(),
                request.getAmount()
        );
    }

    // --- Helper Classes for JSON ---

    // For Deposit & Withdraw
    public static class DepositRequest {
        private Long accountId;
        private Double amount;
        // Getters & Setters
        public Long getAccountId() { return accountId; }
        public void setAccountId(Long accountId) { this.accountId = accountId; }
        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
    }

    // For Transfer (ADD THIS)
    public static class TransferRequest {
        private Long fromAccountId;
        private Long toAccountId;
        private Double amount;
        // Getters & Setters
        public Long getFromAccountId() { return fromAccountId; }
        public void setFromAccountId(Long fromAccountId) { this.fromAccountId = fromAccountId; }
        public Long getToAccountId() { return toAccountId; }
        public void setToAccountId(Long toAccountId) { this.toAccountId = toAccountId; }
        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
    }
}