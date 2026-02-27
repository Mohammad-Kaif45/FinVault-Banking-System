package com.finvault.notification_service.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    // 👇 NEW: Method to send Beautiful HTML Emails
    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            // "true" enables HTML multipart mode
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // 👈 "true" tells Gmail this is HTML!

            mailSender.send(message);
            System.out.println("✅ Professional HTML Receipt Sent to " + to);
        } catch (Exception e) {
            System.err.println("❌ Error sending HTML email: " + e.getMessage());
        }
    }
}