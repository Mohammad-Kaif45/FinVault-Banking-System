package com.finvault.transaction_service.service;

import com.finvault.transaction_service.client.AccountClient;
import com.finvault.transaction_service.dto.TransactionEvent;
import com.finvault.transaction_service.entity.Transaction;
import com.finvault.transaction_service.repository.TransactionRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountClient accountClient;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    private static final String TOPIC = "transaction-updates";

    // --- 1. DEPOSIT LOGIC ---
    @CircuitBreaker(name = "accountService", fallbackMethod = "depositFallback")
    public Transaction depositMoney(String accountNumber, Double amount) { // 👈 Changed to String
        accountClient.deposit(accountNumber, amount);

        Transaction transaction = new Transaction(
                null, accountNumber, BigDecimal.valueOf(amount), "DEPOSIT_SUCCESS"
        );
        Transaction savedTransaction = transactionRepository.save(transaction);

        // Uncomment for Kafka later
//        TransactionEvent event = new TransactionEvent(
//                "DEPOSIT",
//                null,
//                accountNumber, // No need for .toString() anymore
//                BigDecimal.valueOf(amount),
//                "SUCCESS"
//        );
//        kafkaTemplate.send(TOPIC, event);

        return savedTransaction;
    }

    public Transaction depositFallback(String accountNumber, Double amount, Throwable t) {
        System.err.println("Fallback executed: " + t.getMessage());
        return transactionRepository.save(new Transaction(null, accountNumber, BigDecimal.valueOf(amount), "FAILED"));
    }

    // --- 2. WITHDRAW LOGIC ---
    @CircuitBreaker(name = "accountService", fallbackMethod = "withdrawFallback")
    public Transaction withdrawMoney(String accountNumber, Double amount) { // 👈 Changed to String
        accountClient.withdraw(accountNumber, amount);

        Transaction transaction = new Transaction(
                accountNumber, null, BigDecimal.valueOf(amount), "WITHDRAW_SUCCESS"
        );
        Transaction savedTransaction = transactionRepository.save(transaction);

//        TransactionEvent event = new TransactionEvent(
//                "WITHDRAW",
//                accountNumber,
//                null,
//                BigDecimal.valueOf(amount),
//                "SUCCESS"
//        );
//        kafkaTemplate.send(TOPIC, event);

        return savedTransaction;
    }

    public Transaction withdrawFallback(String accountNumber, Double amount, Throwable t) {
        return transactionRepository.save(new Transaction(accountNumber, null, BigDecimal.valueOf(amount), "FAILED"));
    }

    // --- 3. TRANSFER LOGIC ---
    public Transaction transferMoney(String fromAccountNumber, String toAccountNumber, Double amount) { // 👈 Changed to String
        accountClient.withdraw(fromAccountNumber, amount);
        accountClient.deposit(toAccountNumber, amount);

        Transaction transaction = new Transaction(
                fromAccountNumber, toAccountNumber, BigDecimal.valueOf(amount), "TRANSFER_SUCCESS"
        );
        Transaction savedTransaction = transactionRepository.save(transaction);

//        TransactionEvent event = new TransactionEvent(
//                "TRANSFER",
//                fromAccountNumber,
//                toAccountNumber,
//                BigDecimal.valueOf(amount),
//                "SUCCESS"
//        );
//        kafkaTemplate.send(TOPIC, event);

        return savedTransaction;
    }
}