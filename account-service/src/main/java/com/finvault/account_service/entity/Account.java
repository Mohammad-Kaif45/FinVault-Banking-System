package com.finvault.account_service.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String accountNumber;

    @Column(nullable = false)
    private String accountType; // "SAVINGS" or "CURRENT"

    @Column(nullable = false)
    private BigDecimal balance; // Using BigDecimal is safer for money than Double

    @Column(nullable = false)
    private Long userId; // This links to the User ID in the User Service

    // --- CONSTRUCTORS, GETTERS, SETTERS ---

    public Account() {}

    public Account(String accountNumber, String accountType, BigDecimal balance, Long userId) {
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.balance = balance;
        this.userId = userId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}