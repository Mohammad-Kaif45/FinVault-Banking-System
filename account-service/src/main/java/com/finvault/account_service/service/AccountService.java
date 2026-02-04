package com.finvault.account_service.service;

import com.finvault.account_service.entity.Account;
import com.finvault.account_service.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service // Marks a class as holding business logic
public class AccountService {

    @Autowired // Inject dependencies (Beans) automatically
    private AccountRepository accountRepository;

    // 1. Create a new account
    public Account createAccount(Account account) {
        // 1. Auto-generate a random Account Number (UUID)
        // If you don't do this, the database throws the "Not Null" error!
        account.setAccountNumber(java.util.UUID.randomUUID().toString());

        // 2. Save to Database
        return accountRepository.save(account);
    }

    // 2. Get accounts for a specific user
    public List<Account> getAccountsByUserId(Long userId) {
        return accountRepository.findByUserId(userId);
    }

    // 3. Deposit Money
    public Account deposit(Long id, Double amount) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Add amount to existing balance
        // Note: In real banking, we use BigDecimal.add(), but for now Double is fine for learning
        account.setBalance(account.getBalance().add(java.math.BigDecimal.valueOf(amount)));

        return accountRepository.save(account);
    }

    // 4. Withdraw Money
    public Account withdraw(Long id, Double amount) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getBalance().doubleValue() < amount) {
            throw new RuntimeException("Insufficient Funds");
        }

        // Subtract amount
        account.setBalance(account.getBalance().subtract(java.math.BigDecimal.valueOf(amount)));

        return accountRepository.save(account);
    }

    public Account getAccountById(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }


}