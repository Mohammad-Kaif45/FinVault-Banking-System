package com.finvault.transaction_service.controller;

import com.finvault.transaction_service.entity.Transaction;
import com.finvault.transaction_service.service.TransactionService;
import com.finvault.transaction_service.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // 👈 Added import
import org.springframework.web.bind.annotation.*;

import java.util.List; // 👈 Added import

@RestController
@RequestMapping("/transactions")
@CrossOrigin(origins = "*") // ✅ Perfect, this fixes the CORS block!
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private TransactionRepository transactionRepository;

    @PostMapping("/log")
    public void logTransaction(@RequestBody Transaction receipt) {
        transactionRepository.save(receipt);
        System.out.println("📝 Ledger Updated: Saved transfer receipt to database!");
    }

    // --- 👇 CRITICAL ADDITION: The frontend needs this to build the Dashboard table 👇 ---
    @GetMapping("/history/{accountNumber}")
    public ResponseEntity<List<Transaction>> getHistory(@PathVariable String accountNumber) {
        List<Transaction> history = transactionRepository.findByFromAccountNumberOrToAccountNumberOrderByTimestampDesc(accountNumber, accountNumber);
        return ResponseEntity.ok(history);
    }
    // -----------------------------------------------------------------------------------

    @PostMapping("/deposit")
    public Transaction deposit(@RequestBody TransactionRequest request) {
        return transactionService.depositMoney(request.getAccountNumber(), request.getAmount());
    }

    @PostMapping("/withdraw")
    public Transaction withdraw(@RequestBody TransactionRequest request) {
        return transactionService.withdrawMoney(request.getAccountNumber(), request.getAmount());
    }

    @PostMapping("/transfer")
    public Transaction transfer(@RequestBody TransferRequest request) {
        return transactionService.transferMoney(
                request.getFromAccountNumber(),
                request.getReceiverAccountNumber(),
                request.getAmount()
        );
    }

    // --- DTOs ---
    public static class TransactionRequest {
        private String accountNumber;
        private Double amount;

        public String getAccountNumber() { return accountNumber; }
        public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
    }

    public static class TransferRequest {
        private String fromAccountNumber;
        private String receiverAccountNumber;
        private Double amount;

        public String getFromAccountNumber() { return fromAccountNumber; }
        public void setFromAccountNumber(String fromAccountNumber) { this.fromAccountNumber = fromAccountNumber; }

        public String getReceiverAccountNumber() { return receiverAccountNumber; }
        public void setReceiverAccountNumber(String receiverAccountNumber) { this.receiverAccountNumber = receiverAccountNumber; }

        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
    }
}