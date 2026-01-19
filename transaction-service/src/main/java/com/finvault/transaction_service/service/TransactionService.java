package com.finvault.transaction_service.service;

import com.finvault.transaction_service.client.AccountClient;
import com.finvault.transaction_service.entity.Transaction;
import com.finvault.transaction_service.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountClient accountClient; // This is our bridge to the other service

    public Transaction transferMoney(Long fromAccountId, Long toAccountId, Double amount) {

        // Step 1: Withdraw from Sender (Calls Account Service)
        accountClient.withdraw(fromAccountId, amount);

        // Step 2: Deposit to Receiver (Calls Account Service)
        accountClient.deposit(toAccountId, amount);

        // Step 3: Save the Transaction Record
        Transaction transaction = new Transaction(
                fromAccountId,
                toAccountId,
                BigDecimal.valueOf(amount),
                "SUCCESS"
        );

        return transactionRepository.save(transaction);
    }
}