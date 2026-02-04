package com.collabpro.repository;

import com.collabpro.model.PasswordResetToken;
import com.collabpro.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByUser(User user);
    Optional<PasswordResetToken> findByOtpAndUser(String otp, User user);
    void deleteByUser(User user);
}
