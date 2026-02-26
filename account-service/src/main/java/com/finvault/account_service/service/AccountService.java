package com.finvault.account_service.service;

import com.finvault.account_service.entity.Account;
import com.finvault.account_service.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.HashMap;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    public Account createAccount(Account account) {
        long first15Digits = (long) (Math.random() * 1000000000000000L);
        String sixteenDigitNumber = String.format("%016d", first15Digits);
        account.setAccountNumber(sixteenDigitNumber);

        if (account.getBalance() == null) {
            account.setBalance(BigDecimal.ZERO);
        }
        return accountRepository.save(account);
    }

    public List<Account> getAccountsByUserId(Long userId) {
        return accountRepository.findByUserId(userId);
    }

    public Account getAccountById(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    // --- 👇 UPDATED: Deposit now saves to the ledger 👇 ---
    public Account deposit(Long id, Double amount) {
        Account account = getAccountById(id);
        BigDecimal newBalance = account.getBalance().add(BigDecimal.valueOf(amount));
        account.setBalance(newBalance);
        Account savedAccount = accountRepository.save(account);
        System.out.println("✅ Deposited ₹" + amount + " to Account ID: " + id);

        try {
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> receipt = new HashMap<>();
            receipt.put("fromAccountNumber", null); // No sender for a deposit
            receipt.put("toAccountNumber", account.getAccountNumber());
            receipt.put("amount", amount);
            receipt.put("status", "DEPOSIT_SUCCESS");

            restTemplate.postForObject("http://localhost:8081/transactions/log", receipt, Object.class);
        } catch (Exception e) {
            System.err.println("⚠️ Warning: Failed to log deposit transaction.");
        }

        return savedAccount;
    }

    // --- 👇 UPDATED: Withdraw now saves to the ledger 👇 ---
    public Account withdraw(Long id, Double amount) {
        Account account = getAccountById(id);
        BigDecimal currentBalance = account.getBalance();
        BigDecimal amountToWithdraw = BigDecimal.valueOf(amount);

        if (currentBalance.compareTo(amountToWithdraw) < 0) {
            throw new RuntimeException("❌ Insufficient Funds. Current Balance: " + currentBalance);
        }

        account.setBalance(currentBalance.subtract(amountToWithdraw));
        Account savedAccount = accountRepository.save(account);
        System.out.println("✅ Withdrew ₹" + amount + " from Account ID: " + id);

        try {
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> receipt = new HashMap<>();
            receipt.put("fromAccountNumber", account.getAccountNumber());
            receipt.put("toAccountNumber", null); // No receiver for a withdrawal
            receipt.put("amount", amount);
            receipt.put("status", "WITHDRAW_SUCCESS");

            restTemplate.postForObject("http://localhost:8081/transactions/log", receipt, Object.class);
            System.out.println("✅ Withdrawal receipt successfully sent to Transaction Ledger!");
        } catch (Exception e) {
            System.err.println("⚠️ Warning: Failed to log withdrawal transaction.");
        }

        return savedAccount;
    }

    @Transactional
    public void transfer(Long sourceId, String targetAccountNumber, Double amount) {

        Account sourceAccount = getAccountById(sourceId);

        Account targetAccount = accountRepository.findByAccountNumber(targetAccountNumber)
                .orElseThrow(() -> new RuntimeException("Target account number not found"));

        BigDecimal currentBalance = sourceAccount.getBalance();
        BigDecimal transferAmount = BigDecimal.valueOf(amount);

        if (currentBalance.compareTo(transferAmount) < 0) {
            throw new RuntimeException("❌ Insufficient Funds");
        }

        sourceAccount.setBalance(currentBalance.subtract(transferAmount));
        targetAccount.setBalance(targetAccount.getBalance().add(transferAmount));

        accountRepository.save(sourceAccount);
        accountRepository.save(targetAccount);

        System.out.println("💸 Transfer Complete: ₹" + amount + " to Account Number " + targetAccountNumber);

        try {
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> receipt = new HashMap<>();
            receipt.put("fromAccountNumber", sourceAccount.getAccountNumber());
            receipt.put("toAccountNumber", targetAccountNumber);
            receipt.put("amount", amount);
            receipt.put("status", "TRANSFER_SUCCESS");

            restTemplate.postForObject("http://localhost:8081/transactions/log", receipt, Object.class);
            System.out.println("✅ Transfer receipt successfully sent to Transaction Ledger!");

        } catch (Exception e) {
            System.err.println("⚠️ Warning: Money moved, but failed to log transaction. Is Transaction Service running on 8081?");
        }
    }

    // --- MICROSERVICE LOGIC FOR FEIGN CLIENT ---

    public void depositByNumber(String accountNumber, Double amount) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found for deposit: " + accountNumber));

        account.setBalance(account.getBalance().add(BigDecimal.valueOf(amount)));
        accountRepository.save(account);
        System.out.println("✅ Feign Deposit: ₹" + amount + " to " + accountNumber);
    }

    public void withdrawByNumber(String accountNumber, Double amount) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found for withdrawal: " + accountNumber));

        BigDecimal withdrawAmount = BigDecimal.valueOf(amount);
        if (account.getBalance().compareTo(withdrawAmount) < 0) {
            throw new RuntimeException("Insufficient Funds for Account: " + accountNumber);
        }

        account.setBalance(account.getBalance().subtract(withdrawAmount));
        accountRepository.save(account);
        System.out.println("✅ Feign Withdraw: ₹" + amount + " from " + accountNumber);
    }
}