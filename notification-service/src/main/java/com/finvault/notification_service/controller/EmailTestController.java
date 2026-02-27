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

        // 👇 FIX: Calling the new sendHtmlEmail method instead of sendEmail
        emailService.sendHtmlEmail(
                to,
                "FinVault Security Alert 🏦",
                "<h3>Hello!</h3><p>This is a test notification from your FinVault Banking System. Your HTML email logic is working perfectly! ✅</p>"
        );

        return "Email sent to " + to + "! Check your inbox.";
    }
}