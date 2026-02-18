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

    // 2. Get Account by ID (With Logging)
    @GetMapping("/{id}")
    public Account getAccount(
            @PathVariable Long id,
            @RequestHeader(value = "loggedInUser", required = false) String loggedInUser,
            @RequestHeader(value = "loggedInRole", required = false) String loggedInRole
    ) {
        System.out.println("🚨 Access Request for Account " + id + " by: " + loggedInUser);
        return accountService.getAccountById(id);
    }

    // 3. Get Accounts by User ID
    @GetMapping("/user/{userId}")
    public List<Account> getAccountsByUser(@PathVariable Long userId) {
        return accountService.getAccountsByUserId(userId);
    }

    // --- 👇 CRITICAL FIXES BELOW 👇 ---

    // 4. Withdraw Money (Fixes 500 Error)
    @PostMapping("/{id}/withdraw")
    public ResponseEntity<Account> withdraw(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        // Safe Conversion: Turns "50" (Int) or "50.0" (Double) into a Double safely
        Double amount = Double.parseDouble(request.get("amount").toString());

        // Perform the withdraw
        accountService.withdraw(id, amount);

        // Fetch the updated account to show the new balance immediately
        Account updatedAccount = accountService.getAccountById(id);

        return ResponseEntity.ok(updatedAccount);
    }

    // 5. Deposit Money (Same Fix)
    @PostMapping("/{id}/deposit")
    public ResponseEntity<Account> deposit(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        // Safe Conversion
        Double amount = Double.parseDouble(request.get("amount").toString());

        // Perform the deposit
        accountService.deposit(id, amount);

        // Fetch the updated account
        Account updatedAccount = accountService.getAccountById(id);

        return ResponseEntity.ok(updatedAccount);
    }
}