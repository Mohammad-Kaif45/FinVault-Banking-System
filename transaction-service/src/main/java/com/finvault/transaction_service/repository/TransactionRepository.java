
package com.finvault.transaction_service.repository;

import com.finvault.transaction_service.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Find history for a specific account (either as sender OR receiver)
    List<Transaction> findByFromAccountIdOrToAccountId(Long fromAccountId, Long toAccountId);
}