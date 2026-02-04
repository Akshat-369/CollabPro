package com.collabpro.repository;

import com.collabpro.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTaskId(Long taskId);

    Optional<Payment> findByRazorpayOrderId(String orderId);

    List<Payment> findByProjectId(Long projectId);
}
