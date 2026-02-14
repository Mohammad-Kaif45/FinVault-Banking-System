package com.finvault.transaction_service.service;

import com.finvault.transaction_service.client.AccountClient;
import com.finvault.transaction_service.dto.TransactionEvent; // 👈 Make sure this import exists
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

    // 👇 FIXED: Changed to <String, Object> so we can send JSON
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    private static final String TOPIC = "transaction-updates";

    // --- 1. DEPOSIT LOGIC ---
    @CircuitBreaker(name = "accountService", fallbackMethod = "depositFallback")
    public Transaction depositMoney(Long accountId, Double amount) {
        accountClient.deposit(accountId, amount);

        Transaction transaction = new Transaction(
                null, accountId, BigDecimal.valueOf(amount), "DEPOSIT_SUCCESS"
        );
        Transaction savedTransaction = transactionRepository.save(transaction);

        // It is for kafka
//        TransactionEvent event = new TransactionEvent(
//                "DEPOSIT",
//                null,
//                accountId.toString(),
//                BigDecimal.valueOf(amount),
//                "SUCCESS"
//        );
//        kafkaTemplate.send(TOPIC, event);

        return savedTransaction;
    }

    public Transaction depositFallback(Long accountId, Double amount, Throwable t) {
        System.err.println("Fallback executed: " + t.getMessage());
        return transactionRepository.save(new Transaction(null, accountId, BigDecimal.valueOf(amount), "FAILED"));
    }

    // --- 2. WITHDRAW LOGIC ---
    @CircuitBreaker(name = "accountService", fallbackMethod = "withdrawFallback")
    public Transaction withdrawMoney(Long accountId, Double amount) {
        accountClient.withdraw(accountId, amount);

        Transaction transaction = new Transaction(
                accountId, null, BigDecimal.valueOf(amount), "WITHDRAW_SUCCESS"
        );
        Transaction savedTransaction = transactionRepository.save(transaction);

        // 👇 FIXED: Sending OBJECT, not String
//        TransactionEvent event = new TransactionEvent(
//                "WITHDRAW",
//                accountId.toString(),
//                null,
//                BigDecimal.valueOf(amount),
//                "SUCCESS"
//        );
//        kafkaTemplate.send(TOPIC, event);

        return savedTransaction;
    }

    public Transaction withdrawFallback(Long accountId, Double amount, Throwable t) {
        return transactionRepository.save(new Transaction(accountId, null, BigDecimal.valueOf(amount), "FAILED"));
    }

    // --- 3. TRANSFER LOGIC ---
    public Transaction transferMoney(Long fromAccountId, Long toAccountId, Double amount) {
        accountClient.withdraw(fromAccountId, amount);
        accountClient.deposit(toAccountId, amount);

        Transaction transaction = new Transaction(
                fromAccountId, toAccountId, BigDecimal.valueOf(amount), "TRANSFER_SUCCESS"
        );
        Transaction savedTransaction = transactionRepository.save(transaction);

        // 👇 FIXED: Sending OBJECT, not String
//        TransactionEvent event = new TransactionEvent(
//                "TRANSFER",
//                fromAccountId.toString(),
//                toAccountId.toString(),
//                BigDecimal.valueOf(amount),
//                "SUCCESS"
//        );
//        kafkaTemplate.send(TOPIC, event);

        return savedTransaction;
    }
}