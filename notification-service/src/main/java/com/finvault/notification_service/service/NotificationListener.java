package com.finvault.notification_service.service;

import com.finvault.notification_service.dto.TransactionEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationListener {

    @KafkaListener(topics = "transaction-updates", groupId = "notification-group")
    public void handleTransactionUpdate(TransactionEvent event) {
        // This method runs AUTOMATICALLY whenever a message arrives!

        System.out.println("--------------------------------------------------");
        System.out.println("📧 RECEIVED NOTIFICATION: Transaction Alert!");
        System.out.println("   Type: " + event.getTransactionType());
        System.out.println("   Amount: $" + event.getAmount());
        System.out.println("   Status: " + event.getStatus());
        System.out.println("   Sending email to user...");
        System.out.println("--------------------------------------------------");
    }
}