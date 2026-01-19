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

    // POST: Transfer Money
    // URL: http://localhost:8083/transactions/transfer?from=1&to=2&amount=500
    @PostMapping("/transfer")
    public Transaction transfer(
            @RequestParam Long from,
            @RequestParam Long to,
            @RequestParam Double amount) {

        return transactionService.transferMoney(from, to, amount);
    }
}