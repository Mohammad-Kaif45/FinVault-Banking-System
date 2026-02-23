package com.finvault.account_service.service;

import com.finvault.account_service.entity.Account;
import com.finvault.account_service.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Added for safety
import java.math.BigDecimal;
import java.util.List; // hello
import java.util.UUID;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    // 1. Create Account
    public Account createAccount(Account account) {

        long first15Digits = (long) (Math.random() * 1000000000000000L);
        String sixteenDigitNumber = String.format("%016d", first15Digits);
        account.setAccountNumber(sixteenDigitNumber);

        if (account.getBalance() == null) {
            account.setBalance(BigDecimal.ZERO);
        }
        return accountRepository.save(account);
    }

    // 2. Get Accounts by User
    public List<Account> getAccountsByUserId(Long userId) {
        return accountRepository.findByUserId(userId);
    }

    // 3. Get Account by ID
    public Account getAccountById(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    // 4. Deposit Money
    public Account deposit(Long id, Double amount) {
        Account account = getAccountById(id);
        BigDecimal newBalance = account.getBalance().add(BigDecimal.valueOf(amount));
        account.setBalance(newBalance);

        System.out.println("✅ Deposited ₹" + amount + " to Account ID: " + id); // Localized
        return accountRepository.save(account);
    }

    // 5. Withdraw Money
    public Account withdraw(Long id, Double amount) {
        Account account = getAccountById(id);
        BigDecimal currentBalance = account.getBalance();
        BigDecimal amountToWithdraw = BigDecimal.valueOf(amount);

        if (currentBalance.compareTo(amountToWithdraw) < 0) {
            throw new RuntimeException("❌ Insufficient Funds. Current Balance: " + currentBalance);
        }

        account.setBalance(currentBalance.subtract(amountToWithdraw));
        System.out.println("✅ Withdrew ₹" + amount + " from Account ID: " + id); // Localized
        return accountRepository.save(account);
    }

    // --- 👇 NEW: TRANSFER METHOD (Fixes IntelliJ Error) 👇 ---
    @Transactional // Ensures both accounts update or neither does
    public void transfer(Long sourceId, Long targetId, Double amount) {
        // 1. Perform Withdrawal from Source
        withdraw(sourceId, amount);

        // 2. Perform Deposit to Target
        deposit(targetId, amount);

        System.out.println("💸 Transfer Complete: ₹" + amount + " from " + sourceId + " to " + targetId);
    }
}