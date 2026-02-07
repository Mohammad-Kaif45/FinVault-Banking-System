//package com.finvault.account_service.service;
//
//import com.finvault.account_service.entity.Account;
//import com.finvault.account_service.repository.AccountRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import java.util.List;
//
//@Service // Marks a class as holding business logic
//public class AccountService {
//
//    @Autowired // Inject dependencies (Beans) automatically
//    private AccountRepository accountRepository;
//
//    // 1. Create a new account
//    public Account createAccount(Account account) {
//        // 1. Auto-generate a random Account Number (UUID)
//        // If you don't do this, the database throws the "Not Null" error!
//        account.setAccountNumber(java.util.UUID.randomUUID().toString());
//
//        // 2. Save to Database
//        return accountRepository.save(account);
//    }
//
//    // 2. Get accounts for a specific user
//    public List<Account> getAccountsByUserId(Long userId) {
//        return accountRepository.findByUserId(userId);
//    }
//
//    // 3. Deposit Money
//    public Account deposit(Long id, Double amount) {
//        Account account = accountRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Account not found"));
//
//        // Add amount to existing balance
//        // Note: In real banking, we use BigDecimal.add(), but for now Double is fine for learning
//        account.setBalance(account.getBalance().add(java.math.BigDecimal.valueOf(amount)));
//
//        return accountRepository.save(account);
//    }
//
//    // 4. Withdraw Money
//    public Account withdraw(Long id, Double amount) {
//        Account account = accountRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Account not found"));
//
//        if (account.getBalance().doubleValue() < amount) {
//            throw new RuntimeException("Insufficient Funds");
//        }
//
//        // Subtract amount
//        account.setBalance(account.getBalance().subtract(java.math.BigDecimal.valueOf(amount)));
//
//        return accountRepository.save(account);
//    }
//
//    public Account getAccountById(Long id) {
//        return accountRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Account not found"));
//    }
//
//
//}


package com.finvault.account_service.service;

import com.finvault.account_service.entity.Account;
import com.finvault.account_service.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    // 1. Create Account
    public Account createAccount(Account account) {
        // Auto-generate a random Account Number
        account.setAccountNumber(UUID.randomUUID().toString());

        // Default balance to 0 if null
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

    // 4. Deposit Money (Used by Transaction Service)
    public Account deposit(Long id, Double amount) {
        Account account = getAccountById(id);

        // Add amount to existing balance
        BigDecimal currentBalance = account.getBalance();
        BigDecimal newBalance = currentBalance.add(BigDecimal.valueOf(amount));

        account.setBalance(newBalance);

        System.out.println("✅ Deposited $" + amount + " to Account ID: " + id);
        return accountRepository.save(account);
    }

    // 5. Withdraw Money (Used by Transaction Service)
    public Account withdraw(Long id, Double amount) {
        Account account = getAccountById(id);

        BigDecimal currentBalance = account.getBalance();
        BigDecimal amountToWithdraw = BigDecimal.valueOf(amount);

        // Check for sufficient funds
        if (currentBalance.compareTo(amountToWithdraw) < 0) {
            throw new RuntimeException("❌ Insufficient Funds. Current Balance: " + currentBalance);
        }

        // Subtract amount
        BigDecimal newBalance = currentBalance.subtract(amountToWithdraw);

        account.setBalance(newBalance);

        System.out.println("✅ Withdrew $" + amount + " from Account ID: " + id);
        return accountRepository.save(account);
    }
}