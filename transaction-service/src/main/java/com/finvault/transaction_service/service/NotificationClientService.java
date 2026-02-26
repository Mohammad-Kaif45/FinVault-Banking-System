package com.finvault.transaction_service.service;

import com.finvault.transaction_service.dto.TransactionEvent;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NotificationClientService {

    // Using RestTemplate to act like a client calling port 8084
    private final RestTemplate restTemplate = new RestTemplate();

    // The exact URL of the Notification Service we created earlier
    private final String NOTIFICATION_URL = "http://localhost:8084/notifications/send-receipt";

    public void sendTransactionAlert(TransactionEvent event) {
        try {
            System.out.println("📢 Sending transaction alert to Notification Service via REST...");
            // Make a POST request, sending the event as the JSON body
            restTemplate.postForObject(NOTIFICATION_URL, event, String.class);
            System.out.println("✅ Alert sent to Notification Service successfully.");
        } catch (Exception e) {
            System.err.println("⚠️ Warning: Could not reach Notification Service. Is it running on port 8084? Error: " + e.getMessage());
        }
    }
}