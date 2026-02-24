package com.finvault.account_service.controller;

import com.finvault.account_service.entity.Account;
import com.finvault.account_service.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    // 1. Create Account
    @PostMapping("/create")
    public Account createAccount(@RequestBody Account account) {
        return accountService.createAccount(account);
    }

    // 2. Get Account by ID
    @GetMapping("/{id}")
    public Account getAccount(@PathVariable Long id) {
        return accountService.getAccountById(id);
    }

    // 3. Get Accounts by User ID
    @GetMapping("/user/{userId}")
    public List<Account> getAccountsByUser(@PathVariable Long userId) {
        return accountService.getAccountsByUserId(userId);
    }

    // 4. Withdraw Money (Standard UI)
    @PostMapping("/{id}/withdraw")
    public ResponseEntity<Account> withdraw(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Double amount = Double.parseDouble(request.get("amount").toString());
        accountService.withdraw(id, amount);
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    // 5. Deposit Money (Standard UI)
    @PostMapping("/{id}/deposit")
    public ResponseEntity<Account> deposit(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Double amount = Double.parseDouble(request.get("amount").toString());
        accountService.deposit(id, amount);
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    // 6. Transfer by Account Number String
    @PostMapping("/{id}/transfer/{targetAccountNumber}")
    public ResponseEntity<?> transfer(
            @PathVariable Long id,
            @PathVariable String targetAccountNumber,
            @RequestBody Map<String, Object> request) {

        try {
            // Safe conversion of amount
            if (request.get("amount") == null) {
                return ResponseEntity.badRequest().body("Amount is missing");
            }
            Double amount = Double.parseDouble(request.get("amount").toString());

            // Call service with the 16-digit target string
            accountService.transfer(id, targetAccountNumber, amount);

            // Return updated source account
            return ResponseEntity.ok(accountService.getAccountById(id));

        } catch (RuntimeException e) {
            // Catches "Account not found" or "Insufficient Funds"
            System.err.println("❌ TRANSFER LOGIC FAILED: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (Exception e) {
            // Catches NullPointers and DB Crashes
            System.err.println("❌ CRITICAL SERVER ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("System Error: " + e.getMessage());
        }
    }

    // --- 👇 NEW: MICROSERVICE FEIGN ENDPOINTS 👇 ---
    // These listen for the Transaction Service's requests using the 16-digit strings

    @PostMapping("/feign/deposit")
    public void feignDeposit(@RequestParam("accountNumber") String accountNumber, @RequestParam("amount") Double amount) {
        accountService.depositByNumber(accountNumber, amount);
    }

    @PostMapping("/feign/withdraw")
    public void feignWithdraw(@RequestParam("accountNumber") String accountNumber, @RequestParam("amount") Double amount) {
        accountService.withdrawByNumber(accountNumber, amount);
    }
}