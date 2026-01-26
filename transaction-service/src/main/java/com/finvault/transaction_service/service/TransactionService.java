package com.finvault.transaction_service.service;

import com.finvault.transaction_service.client.AccountClient;
import com.finvault.transaction_service.entity.Transaction;
import com.finvault.transaction_service.repository.TransactionRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountClient accountClient;

    // --- 1. DEPOSIT LOGIC ---
    @CircuitBreaker(name = "accountService", fallbackMethod = "depositFallback")
    public Transaction depositMoney(Long accountId, Double amount) {
        accountClient.deposit(accountId, amount); // This might fail!

        Transaction transaction = new Transaction(
                null, accountId, BigDecimal.valueOf(amount), "DEPOSIT_SUCCESS"
        );
        transaction.setTimestamp(LocalDateTime.now());
        return transactionRepository.save(transaction);
    }

    // --- FALLBACK FOR DEPOSIT ---
    // Must have SAME arguments as original + Throwable
    public Transaction depositFallback(Long accountId, Double amount, Throwable t) {
        // "Plan B": The Account Service is down.
        // We save a FAILED transaction so the user knows what happened.
        System.out.println("⚠️ Circuit Breaker Tripped! Reason: " + t.getMessage());

        Transaction transaction = new Transaction(
                null, accountId, BigDecimal.valueOf(amount), "FAILED_SERVICE_DOWN"
        );
        transaction.setTimestamp(LocalDateTime.now());
        return transactionRepository.save(transaction);
    }

    // --- 2. WITHDRAW LOGIC ---
    // (You can add CircuitBreaker here too if you want, same pattern)
    public Transaction withdrawMoney(Long accountId, Double amount) {
        accountClient.withdraw(accountId, amount);
        Transaction transaction = new Transaction(
                accountId, null, BigDecimal.valueOf(amount), "WITHDRAW_SUCCESS"
        );
        transaction.setTimestamp(LocalDateTime.now());
        return transactionRepository.save(transaction);
    }

    // --- 3. TRANSFER LOGIC ---
    public Transaction transferMoney(Long fromAccountId, Long toAccountId, Double amount) {
        accountClient.withdraw(fromAccountId, amount);
        accountClient.deposit(toAccountId, amount);
        Transaction transaction = new Transaction(
                fromAccountId, toAccountId, BigDecimal.valueOf(amount), "TRANSFER_SUCCESS"
        );
        transaction.setTimestamp(LocalDateTime.now());
        return transactionRepository.save(transaction);
    }
}