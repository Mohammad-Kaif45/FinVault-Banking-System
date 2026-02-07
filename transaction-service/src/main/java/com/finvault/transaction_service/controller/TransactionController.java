//package com.finvault.transaction_service.controller;
//
//import com.finvault.transaction_service.entity.Transaction;
//import com.finvault.transaction_service.service.TransactionService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/transactions")
//public class TransactionController {
//
//    @Autowired
//    private TransactionService transactionService;
//
//    // 1. DEPOSIT
//    @PostMapping("/deposit")
//    public Transaction deposit(@RequestBody DepositRequest request) {
//        return transactionService.depositMoney(request.getAccountId(), request.getAmount());
//    }
//
//    // 2. WITHDRAW
//    @PostMapping("/withdraw")
//    public Transaction withdraw(@RequestBody DepositRequest request) {
//        return transactionService.withdrawMoney(request.getAccountId(), request.getAmount());
//    }
//
//    // 3. TRANSFER (UPDATED TO USE JSON BODY)
//    @PostMapping("/transfer")
//    public Transaction transfer(@RequestBody TransferRequest request) {
//        return transactionService.transferMoney(
//                request.getFromAccountId(),
//                request.getToAccountId(),
//                request.getAmount()
//        );
//    }
//
//    // --- Helper Classes for JSON ---
//
//    // For Deposit & Withdraw
//    public static class DepositRequest {
//        private Long accountId;
//        private Double amount;
//        // Getters & Setters
//        public Long getAccountId() { return accountId; }
//        public void setAccountId(Long accountId) { this.accountId = accountId; }
//        public Double getAmount() { return amount; }
//        public void setAmount(Double amount) { this.amount = amount; }
//    }
//
//    // For Transfer (ADD THIS)
//    public static class TransferRequest {
//        private Long fromAccountId;
//        private Long toAccountId;
//        private Double amount;
//        // Getters & Setters
//        public Long getFromAccountId() { return fromAccountId; }
//        public void setFromAccountId(Long fromAccountId) { this.fromAccountId = fromAccountId; }
//        public Long getToAccountId() { return toAccountId; }
//        public void setToAccountId(Long toAccountId) { this.toAccountId = toAccountId; }
//        public Double getAmount() { return amount; }
//        public void setAmount(Double amount) { this.amount = amount; }
//    }
//}


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
        // Map senderId (frontend) to fromAccountId (backend)
        return transactionService.transferMoney(
                request.getSenderId(),
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
        private Long senderId; // Matches frontend
        private Long receiverAccountId;
        private Double amount;

        // Getters/Setters
        public Long getSenderId() { return senderId; }
        public void setSenderId(Long senderId) { this.senderId = senderId; }
        public Long getReceiverAccountId() { return receiverAccountId; }
        public void setReceiverAccountId(Long receiverAccountId) { this.receiverAccountId = receiverAccountId; }
        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
    }
}