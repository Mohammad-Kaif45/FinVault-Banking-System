package com.finvault.transaction_service.service;

import com.finvault.transaction_service.client.AccountClient;
import com.finvault.transaction_service.entity.Transaction;
import com.finvault.transaction_service.repository.TransactionRepository;
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
    public Transaction depositMoney(Long accountId, Double amount) {
        // A. Call Account Service to update balance
        accountClient.deposit(accountId, amount);

        // B. Save Record (From = null, To = accountId)
        Transaction transaction = new Transaction(
                null,
                accountId,
                BigDecimal.valueOf(amount),
                "DEPOSIT_SUCCESS"
        );
        transaction.setTimestamp(LocalDateTime.now()); // Ensure timestamp is set
        return transactionRepository.save(transaction);
    }

    // --- 2. WITHDRAW LOGIC ---
    public Transaction withdrawMoney(Long accountId, Double amount) {
        // A. Call Account Service to update balance
        accountClient.withdraw(accountId, amount);

        // B. Save Record (From = accountId, To = null)
        Transaction transaction = new Transaction(
                accountId,
                null,
                BigDecimal.valueOf(amount),
                "WITHDRAW_SUCCESS"
        );
        transaction.setTimestamp(LocalDateTime.now());
        return transactionRepository.save(transaction);
    }

    // --- 3. TRANSFER LOGIC ---
    public Transaction transferMoney(Long fromAccountId, Long toAccountId, Double amount) {
        // A. Withdraw from Sender
        accountClient.withdraw(fromAccountId, amount);

        // B. Deposit to Receiver
        accountClient.deposit(toAccountId, amount);

        // C. Save Record
        Transaction transaction = new Transaction(
                fromAccountId,
                toAccountId,
                BigDecimal.valueOf(amount),
                "TRANSFER_SUCCESS"
        );
        transaction.setTimestamp(LocalDateTime.now());
        return transactionRepository.save(transaction);
    }
}