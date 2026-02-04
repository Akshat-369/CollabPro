package com.collabpro.controller;

import com.collabpro.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/create-order/{taskId}")
    public ResponseEntity<?> createOrder(@PathVariable Long taskId, Principal principal) {
        System.out.println("[PaymentController] Request to create order for task: " + taskId);
        try {
            return ResponseEntity.ok(paymentService.createOrder(taskId, principal.getName()));
        } catch (Throwable e) {
            e.printStackTrace();
            String errorMsg = e.getMessage() != null ? e.getMessage()
                    : "An unexpected error occurred: " + e.getClass().getName();
            return ResponseEntity.badRequest().body(Map.of("error", errorMsg));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {
        try {
            paymentService.verifyPayment(
                    data.get("razorpay_order_id"),
                    data.get("razorpay_payment_id"),
                    data.get("razorpay_signature"));
            return ResponseEntity.ok(Map.of("message", "Payment verified successfully"));
        } catch (Throwable e) {
            e.printStackTrace();
            String errorMsg = e.getMessage() != null ? e.getMessage()
                    : "Verification failed: " + e.getClass().getName();
            return ResponseEntity.badRequest().body(Map.of("error", errorMsg));
        }
    }

    @PostMapping("/received/{taskId}")
    public ResponseEntity<?> markAsReceived(@PathVariable Long taskId, Principal principal) {
        try {
            paymentService.markAsReceived(taskId, principal.getName());
            return ResponseEntity.ok(Map.of("message", "Payment marked as RECEIVED"));
        } catch (Throwable e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
