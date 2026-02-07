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

    @PostMapping("/deposit")
    public Transaction deposit(@RequestBody TransactionRequest request) {
        return transactionService.depositMoney(request.getAccountId(), request.getAmount());
    }

    @PostMapping("/withdraw")
    public Transaction withdraw(@RequestBody TransactionRequest request) {
        return transactionService.withdrawMoney(request.getAccountId(), request.getAmount());
    }

    @PostMapping("/transfer")
    public Transaction transfer(@RequestBody TransferRequest request) {
        // Map DTO fields to Service method
        return transactionService.transferMoney(
                request.getFromAccountId(),
                request.getReceiverAccountId(),
                request.getAmount()
        );
    }

    // --- DTOs ---
    public static class TransactionRequest {
        private Long accountId;
        private Double amount;
        // Getters/Setters
        public Long getAccountId() { return accountId; }
        public void setAccountId(Long accountId) { this.accountId = accountId; }
        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
    }

    public static class TransferRequest {
        // 👇 Changed variable name to match Frontend JSON
        private Long fromAccountId;
        private Long receiverAccountId;
        private Double amount;

        // Getters/Setters
        public Long getFromAccountId() { return fromAccountId; }
        public void setFromAccountId(Long fromAccountId) { this.fromAccountId = fromAccountId; }

        public Long getReceiverAccountId() { return receiverAccountId; }
        public void setReceiverAccountId(Long receiverAccountId) { this.receiverAccountId = receiverAccountId; }

        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
    }
}