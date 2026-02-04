package com.finvault.transaction_service.service;

import com.finvault.transaction_service.client.AccountClient;
import com.finvault.transaction_service.entity.Transaction;
import com.finvault.transaction_service.repository.TransactionRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountClient accountClient;

    // --- NEW: Inject Kafka Template to send messages ---
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    private static final String TOPIC = "transaction-updates";

    // --- 1. DEPOSIT LOGIC ---
    @CircuitBreaker(name = "accountService", fallbackMethod = "depositFallback")
    public Transaction depositMoney(Long accountId, Double amount) {
        accountClient.deposit(accountId, amount);

        Transaction transaction = new Transaction(
                null, accountId, BigDecimal.valueOf(amount), "DEPOSIT_SUCCESS"
        );
        transaction.setTimestamp(LocalDateTime.now());
        Transaction savedTransaction = transactionRepository.save(transaction);

        // Notify Kafka
        String message = "Deposit of " + amount + " to Account " + accountId;
        kafkaTemplate.send(TOPIC, message);
        System.out.println("📤 Kafka Message Sent: " + message);

        return savedTransaction;
    }

    // --- FALLBACK FOR DEPOSIT ---
    public Transaction depositFallback(Long accountId, Double amount, Throwable t) {
        System.out.println("⚠️ Circuit Breaker Tripped! Reason: " + t.getMessage());

        Transaction transaction = new Transaction(
                null, accountId, BigDecimal.valueOf(amount), "FAILED_SERVICE_DOWN"
        );
        transaction.setTimestamp(LocalDateTime.now());
        return transactionRepository.save(transaction);
    }

    // --- 2. WITHDRAW LOGIC ---
    public Transaction withdrawMoney(Long accountId, Double amount) {
        accountClient.withdraw(accountId, amount);
        Transaction transaction = new Transaction(
                accountId, null, BigDecimal.valueOf(amount), "WITHDRAW_SUCCESS"
        );
        transaction.setTimestamp(LocalDateTime.now());
        Transaction savedTransaction = transactionRepository.save(transaction);

        // Notify Kafka
        String message = "Withdrawal of " + amount + " from Account " + accountId;
        kafkaTemplate.send(TOPIC, message);
        System.out.println("📤 Kafka Message Sent: " + message);

        return savedTransaction;
    }

    // --- 3. TRANSFER LOGIC ---
    public Transaction transferMoney(Long fromAccountId, Long toAccountId, Double amount) {
        // 1. Move the money via Account Service
        accountClient.withdraw(fromAccountId, amount);
        accountClient.deposit(toAccountId, amount);

        // 2. Save the Record to Database
        Transaction transaction = new Transaction(
                fromAccountId, toAccountId, BigDecimal.valueOf(amount), "TRANSFER_SUCCESS"
        );
        transaction.setTimestamp(LocalDateTime.now());
        Transaction savedTransaction = transactionRepository.save(transaction);

        // 3. Send Notification to Kafka (THIS WAS MISSING!)
        String message = "Transfer of " + amount + " from " + fromAccountId + " to " + toAccountId;
        kafkaTemplate.send(TOPIC, message);
        System.out.println("📤 Kafka Message Sent: " + message);

        return savedTransaction;
    }
}