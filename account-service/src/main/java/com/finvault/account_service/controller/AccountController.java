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

    // 4. Withdraw Money
    @PostMapping("/{id}/withdraw")
    public ResponseEntity<Account> withdraw(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Double amount = Double.parseDouble(request.get("amount").toString());
        accountService.withdraw(id, amount);
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    // 5. Deposit Money
    @PostMapping("/{id}/deposit")
    public ResponseEntity<Account> deposit(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Double amount = Double.parseDouble(request.get("amount").toString());
        accountService.deposit(id, amount);
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    // --- 👇 CRITICAL FIX: Transfer by Account Number String 👇 ---
    // URL: POST /accounts/{id}/transfer/{targetAccountNumber}
    @PostMapping("/{id}/transfer/{targetAccountNumber}")
    public ResponseEntity<Account> transfer(
            @PathVariable Long id,
            @PathVariable String targetAccountNumber, // 👈 CHANGED: Long to String
            @RequestBody Map<String, Object> request) {

        // Safe conversion of amount
        Double amount = Double.parseDouble(request.get("amount").toString());

        // Call service with the 16-digit target string
        accountService.transfer(id, targetAccountNumber, amount);

        // Return updated source account
        return ResponseEntity.ok(accountService.getAccountById(id));
    }
}