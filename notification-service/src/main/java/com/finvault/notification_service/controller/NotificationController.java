package com.finvault.notification_service.controller;

import com.finvault.notification_service.dto.TransactionEvent;
import com.finvault.notification_service.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NotificationController {

    @Autowired
    private EmailService emailService;

    // The endpoint the Transaction Service will hit
    @PostMapping("/notifications/send-receipt")
    public String sendTransactionReceipt(@RequestBody TransactionEvent event) {
        System.out.println("📧 REST EVENT RECEIVED: Preparing Email...");

        String subject = "FinVault Alert: " + event.getTransactionType();
        String body = String.format(
                "Transaction Details:\n\nType: %s\nAmount: ₹%s\nStatus: %s\n\nThank you for banking with FinVault Enterprise!",
                event.getTransactionType(),
                event.getAmount(),
                event.getStatus()
        );

        // Sending the email (Using your configured email for testing)
        emailService.sendEmail("kaifmumtajansari@gmail.com", subject, body);

        return "Receipt sent successfully!";
    }
}