package com.finvault.transaction_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionEvent {
    private String transactionType;
    private String sourceAccountId;
    private String targetAccountId;
    private BigDecimal amount;
    private String status;
}