package com.finvault.notification_service.service;

import com.finvault.notification_service.dto.TransactionEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationListener {

    @Autowired
    private EmailService emailService;

    // We keep the listener ready, even if Kafka is paused for now
    @KafkaListener(topics = "transaction-updates", groupId = "notification-group-FINAL-FIX")
    public void handleTransactionUpdate(TransactionEvent event) {
        System.out.println("--------------------------------------------------");
        System.out.println("📧 KAFKA EVENT RECEIVED: Sending Email...");

        // 1. Construct the Email Body
        String subject = "FinVault Alert: " + event.getTransactionType();
        String body = String.format(
                "Transaction Details:\n\nType: %s\nAmount: $%s\nStatus: %s\n\nThank you for banking with FinVault!",
                event.getTransactionType(),
                event.getAmount(),
                event.getStatus()
        );

        // 2. Send the Email (using your hardcoded email for now)
        // In a real app, you would fetch the user's email from User-Service using the AccountID
        emailService.sendEmail("kaifmumtajansari@gmail.com", subject, body);

        System.out.println("--------------------------------------------------");
    }
}