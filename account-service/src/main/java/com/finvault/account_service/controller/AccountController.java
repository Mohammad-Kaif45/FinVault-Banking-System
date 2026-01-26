package com.finvault.account_service.controller;

import com.finvault.account_service.entity.Account;
import com.finvault.account_service.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/accounts") // This means the URL will be http://localhost:8082/accounts
public class AccountController {

    @Autowired
    private AccountService accountService;

    // POST: Create a new account
    // URL: http://localhost:8082/accounts


    @PostMapping
    public Account createAccount(@RequestBody Account account) {
        return accountService.createAccount(account);
    }



    // GET: Get accounts by User ID
    // URL: http://localhost:8082/accounts/user/{userId}
    @GetMapping("/user/{userId}")
    public List<Account> getAccountsByUser(@PathVariable Long userId) {
        return accountService.getAccountsByUserId(userId);
    }

    // PUT: Deposit Money
    // URL: http://localhost:8082/accounts/1/deposit?amount=1000
    @PutMapping("/{id}/deposit")
    public Account deposit(@PathVariable Long id, @RequestParam Double amount) {
        return accountService.deposit(id, amount);
    }

    // PUT: Withdraw Money
    // URL: http://localhost:8082/accounts/1/withdraw?amount=500
    @PutMapping("/{id}/withdraw")
    public Account withdraw(@PathVariable Long id, @RequestParam Double amount) {
        return accountService.withdraw(id, amount);
    }
}