package com.collabpro.service;

import com.collabpro.model.*;
import com.collabpro.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final TaskRepository taskRepository;
    private final NotificationService notificationService;

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    @Transactional
    public Map<String, Object> createOrder(Long taskId, String managerEmail) throws Exception {
        if (keyId == null || keySecret == null || keyId.startsWith("${") || keySecret.startsWith("${")) {
            throw new RuntimeException(
                    "Razorpay keys not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.");
        }

        if (taskId == null)
            throw new RuntimeException("Task ID cannot be null");

        System.out.println("[PaymentService] Creating order for task: " + taskId + " by manager: " + managerEmail);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));

        if (!task.getProject().getCreatedBy().getEmail().equalsIgnoreCase(managerEmail)) {
            throw new RuntimeException("Unauthorized: Only project manager can initiate payment");
        }

        if (!"Approved".equalsIgnoreCase(task.getStatus())) {
            throw new RuntimeException(
                    "Payment can only be initiated for Approved tasks. Current status: " + task.getStatus());
        }

        if ("Paid".equalsIgnoreCase(task.getPaymentStatus()) || "Received".equalsIgnoreCase(task.getPaymentStatus())) {
            throw new RuntimeException("Task is already paid");
        }

        if (task.getAmount() == null || task.getAmount().trim().isEmpty()) {
            throw new RuntimeException("Task amount is missing");
        }

        if (task.getAssignedTo() == null) {
            throw new RuntimeException("Task must be assigned to a member before payment");
        }

        Double amount;
        try {
            amount = Double.parseDouble(task.getAmount().replaceAll("[^0-9.]", ""));
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid amount format in task: " + task.getAmount());
        }

        System.out.println(
                "[PaymentService] Initializing Razorpay with Key: [" + (keyId != null ? keyId.trim() : "null") + "]");

        System.out.println(
                "[PaymentService] Initializing Razorpay HTTP Request with Key: ["
                        + (keyId != null ? keyId.trim() : "null") + "]");

        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://api.razorpay.com/v1/orders";

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("amount", (int) (amount * 100));
            requestBody.put("currency", "INR");
            requestBody.put("receipt", "task_" + taskId);

            String auth = keyId.trim() + ":" + keySecret.trim();
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Basic " + encodedAuth);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            Map<String, Object> responseBody = response.getBody();

            if (responseBody == null || !response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Failed to create Razorpay order: " + response.getStatusCode());
            }

            String orderId = (String) responseBody.get("id");
            System.out.println("[PaymentService] Razorpay Order created: " + orderId);

            Payment payment = paymentRepository.findByTaskId(taskId).orElse(new Payment());
            payment.setTask(task);
            payment.setProject(task.getProject());
            payment.setManager(task.getProject().getCreatedBy());
            payment.setMember(task.getAssignedTo());
            payment.setAmount(amount);
            payment.setRazorpayOrderId(orderId);
            payment.setStatus(Payment.PaymentStatus.PENDING);
            paymentRepository.save(payment);

            return Map.of(
                    "orderId", orderId,
                    "amount", String.valueOf(responseBody.get("amount")),
                    "currency", String.valueOf(responseBody.get("currency")));

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error communicating with Razorpay: " + e.getMessage());
        }
    }

    @Transactional
    public void verifyPayment(String orderId, String paymentId, String signature) {
        try {
            String secret = keySecret.trim();
            String payload = orderId + "|" + paymentId;
            String generatedSignature = calculateHmacSha256Hex(payload, secret);

            if (!generatedSignature.equals(signature)) {
                throw new RuntimeException("Invalid payment signature");
            }

            Payment payment = paymentRepository.findByRazorpayOrderId(orderId)
                    .orElseThrow(() -> new RuntimeException("Payment record not found for order: " + orderId));

            payment.setRazorpayPaymentId(paymentId);
            payment.setStatus(Payment.PaymentStatus.PAID);
            paymentRepository.save(payment);

            Task task = payment.getTask();
            task.setPaymentStatus("Paid");
            taskRepository.save(task);

            // Notify Manager (Payment Successful)
            notificationService.createNotification(
                    payment.getManager().getId(),
                    "Payment successful for task '" + task.getTitle() + "'",
                    "INFO");

            // Notify Member (Payment Received/Processed - Money on the way)
            notificationService.createNotification(
                    payment.getMember().getId(),
                    "Payment of ₹" + payment.getAmount() + " processed for task '" + task.getTitle() + "'",
                    "INFO");

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Payment verification failed: " + e.getMessage());
        }
    }

    private String calculateHmacSha256Hex(String data, String key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKey);
        byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return bytesToHex(hash);
    }

    private static final char[] HEX_ARRAY = "0123456789abcdef".toCharArray();

    public static String bytesToHex(byte[] bytes) {
        char[] hexChars = new char[bytes.length * 2];
        for (int j = 0; j < bytes.length; j++) {
            int v = bytes[j] & 0xFF;
            hexChars[j * 2] = HEX_ARRAY[v >>> 4];
            hexChars[j * 2 + 1] = HEX_ARRAY[v & 0x0F];
        }
        return new String(hexChars);
    }

    @Transactional
    public void markAsReceived(Long taskId, String memberEmail) {
        Payment payment = paymentRepository.findByTaskId(taskId)
                .orElseThrow(() -> new RuntimeException("Payment record not found for task: " + taskId));

        if (!payment.getMember().getEmail().equals(memberEmail)) {
            throw new RuntimeException("Unauthorized: Only the assigned member can confirm receipt");
        }

        if (payment.getStatus() != Payment.PaymentStatus.PAID) {
            throw new RuntimeException("Cannot mark as received: Payment is not yet PAID");
        }

        payment.setStatus(Payment.PaymentStatus.RECEIVED);
        paymentRepository.save(payment);

        Task task = payment.getTask();
        task.setPaymentStatus("Received");
        taskRepository.save(task);

        // Notify manager
        notificationService.createNotification(
                payment.getManager().getId(),
                payment.getMember().getName() + " has confirmed receipt of ₹" + payment.getAmount() + " for task: "
                        + task.getTitle(),
                "PAYMENT_RECEIVED");
    }

}
