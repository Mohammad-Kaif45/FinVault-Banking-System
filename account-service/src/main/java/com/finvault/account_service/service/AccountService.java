package com.finvault.account_service.service;

import com.finvault.account_service.entity.Account;
import com.finvault.account_service.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

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

    public Account deposit(Long id, Double amount) {
        Account account = getAccountById(id);
        BigDecimal newBalance = account.getBalance().add(BigDecimal.valueOf(amount));
        account.setBalance(newBalance);
        System.out.println("✅ Deposited ₹" + amount + " to Account ID: " + id);
        return accountRepository.save(account);
    }

    public Account withdraw(Long id, Double amount) {
        Account account = getAccountById(id);
        BigDecimal currentBalance = account.getBalance();
        BigDecimal amountToWithdraw = BigDecimal.valueOf(amount);

        if (currentBalance.compareTo(amountToWithdraw) < 0) {
            throw new RuntimeException("❌ Insufficient Funds. Current Balance: " + currentBalance);
        }

        account.setBalance(currentBalance.subtract(amountToWithdraw));
        System.out.println("✅ Withdrew ₹" + amount + " from Account ID: " + id);
        return accountRepository.save(account);
    }

    // 👇 FIXED: This now expects a String targetAccountNumber
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
    }
}