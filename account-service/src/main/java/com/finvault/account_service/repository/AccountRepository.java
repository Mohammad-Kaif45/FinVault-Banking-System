package com.finvault.account_service.repository;

import com.finvault.account_service.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {

    // Find account by its unique Account Number
    Optional<Account> findByAccountNumber(String accountNumber);

    // Find all accounts belonging to a specific User ID
    List<Account> findByUserId(Long userId);
}