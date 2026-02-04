package com.collabpro.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo(toEmail);
            message.setSubject("CollabPro – Password Reset OTP");
            
            String body = "Hello,\n\n" +
                          "Your One-Time Password (OTP) for resetting your CollabPro password is:\n\n" +
                          "OTP: " + otp + "\n\n" +
                          "This OTP is valid for 5 minutes only.\n" +
                          "Do not share this OTP with anyone.\n\n" +
                          "If you did not request this, please ignore this email.\n\n" +
                          "Thanks,\n" +
                          "CollabPro Team";
            
            message.setText(body);
            javaMailSender.send(message);
            
        } catch (Exception e) {
            // Log error internally but do not throw to user to prevent enumeration or blocking
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
        }
    }
}
