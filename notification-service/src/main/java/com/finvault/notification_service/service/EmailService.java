package com.finvault.notification_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // 👇 Dynamically injects the email from your environment variables!
    @Value("${spring.mail.username}")
    private String senderEmail;

    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail); // 👈 No more hardcoded email
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);
            System.out.println("✅ Email Sent Successfully to " + to);
        } catch (Exception e) {
            System.err.println("❌ Error sending email: " + e.getMessage());
        }
    }
}