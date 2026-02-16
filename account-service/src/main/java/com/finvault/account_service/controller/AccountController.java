package com.finvault.account_service.controller;

import com.finvault.account_service.entity.Account;
import com.finvault.account_service.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping("/create")
    public Account createAccount(@RequestBody Account account) {
        return accountService.createAccount(account);
    }

    // 👇 UPDATED: Now accepts Security Headers from Gateway
    @GetMapping("/{id}")
    public Account getAccount(
            @PathVariable Long id,
            @RequestHeader(value = "loggedInUser", required = false) String loggedInUser, // 👈 Capture User
            @RequestHeader(value = "loggedInRole", required = false) String loggedInRole  // 👈 Capture Role
    ) {
        // 🚨 DEBUG LOG: Check your IntelliJ Console when you run this!
        System.out.println("🚨 Access Request for Account " + id + " by: " + loggedInUser + " | Role: " + loggedInRole);

        return accountService.getAccountById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Account> getAccountsByUser(@PathVariable Long userId) {
        return accountService.getAccountsByUserId(userId);
    }

    // --- 👇 THESE MUST MATCH THE CLIENT EXACTLY 👇 ---

    @PostMapping("/deposit")
    public void deposit(@RequestParam Long id, @RequestParam Double amount) {
        accountService.deposit(id, amount);
    }

    @PostMapping("/withdraw")
    public void withdraw(@RequestParam Long id, @RequestParam Double amount) {
        accountService.withdraw(id, amount);
    }
}