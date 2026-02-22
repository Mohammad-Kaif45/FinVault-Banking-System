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
    // URL: POST /accounts/create
    @PostMapping("/create")
    public Account createAccount(@RequestBody Account account) {
        return accountService.createAccount(account);
    }

    // 2. Get Account by ID (With Security Logging)
    @GetMapping("/{id}")
    public Account getAccount(
            @PathVariable Long id,
            @RequestHeader(value = "loggedInUser", required = false) String loggedInUser,
            @RequestHeader(value = "loggedInRole", required = false) String loggedInRole
    ) {
        // Log access for audit purposes
        System.out.println("🚨 Access Request for Account " + id + " by: " + loggedInUser + " | Role: " + loggedInRole);
        return accountService.getAccountById(id);
    }

    // 3. Get Accounts by User ID
    @GetMapping("/user/{userId}")
    public List<Account> getAccountsByUser(@PathVariable Long userId) {
        return accountService.getAccountsByUserId(userId);
    }

    // 4. Withdraw Money
    // URL: POST /accounts/{id}/withdraw
    @PostMapping("/{id}/withdraw")
    public ResponseEntity<Account> withdraw(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        // Bulletproof conversion to handle different numeric formats safely
        Double amount = Double.parseDouble(request.get("amount").toString());

        accountService.withdraw(id, amount);

        // Return updated account state for the UI
        Account updatedAccount = accountService.getAccountById(id);
        return ResponseEntity.ok(updatedAccount);
    }

    // 5. Deposit Money
    // URL: POST /accounts/{id}/deposit
    @PostMapping("/{id}/deposit")
    public ResponseEntity<Account> deposit(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Double amount = Double.parseDouble(request.get("amount").toString());

        accountService.deposit(id, amount);

        Account updatedAccount = accountService.getAccountById(id);
        return ResponseEntity.ok(updatedAccount);
    }

    // 6. Transfer Money (UPDATED VERSION)
    // URL: POST /accounts/{id}/transfer/{targetId}
    @PostMapping("/{id}/transfer/{targetId}")
    public ResponseEntity<Account> transfer(
            @PathVariable Long id,
            @PathVariable Long targetId,
            @RequestBody Map<String, Object> request) {

        // Convert amount safely from JSON
        Double amount = Double.parseDouble(request.get("amount").toString());

        // Perform the transfer logic in the service
        accountService.transfer(id, targetId, amount);

        // Return the source account with the new balance
        Account updatedSourceAccount = accountService.getAccountById(id);
        return ResponseEntity.ok(updatedSourceAccount);
    }
}