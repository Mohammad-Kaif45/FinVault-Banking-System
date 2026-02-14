package com.finvault.notification_service.controller;

import com.finvault.notification_service.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmailTestController {

    @Autowired
    private EmailService emailService;

    // Trigger URL: http://localhost:8084/send-test?to=yourname@gmail.com
    @GetMapping("/send-test")
    public String sendTestEmail(@RequestParam String to) {
        System.out.println("🔥 Manual Trigger: Sending email to " + to);

        emailService.sendEmail(
                to,
                "FinVault Security Alert 🏦",
                "Hello! This is a test notification from your FinVault Banking System. Your email logic is working perfectly! ✅"
        );

        return "Email sent to " + to + "! Check your inbox.";
    }
}