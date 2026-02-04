package com.collabpro.service;

import com.collabpro.dto.AuthResponse;
import com.collabpro.dto.LoginRequest;
import com.collabpro.dto.RegisterRequest;
import com.collabpro.dto.UserResponse;
import com.collabpro.model.User;
import com.collabpro.repository.UserRepository;
import com.collabpro.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private ProfileService profileService;

    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        String normalizedEmail = loginRequest.getEmail().toLowerCase();

        // 1. Check if user exists
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("User is not registered"));

        // 2. Attempt authentication
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(normalizedEmail, loginRequest.getPassword()));
        } catch (org.springframework.security.core.AuthenticationException e) {
            throw new RuntimeException("Incorrect password");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .token(jwt)
                .user(new UserResponse(user.getId(), user.getName(), user.getEmail()))
                .build();
    }

    public AuthResponse registerUser(RegisterRequest registerRequest) {
        String normalizedEmail = registerRequest.getEmail().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new RuntimeException("User already exists");
        }
        
        // Create Profile first
        com.collabpro.model.Profile profile = profileService.createProfile(registerRequest.getName(), normalizedEmail);

        User user = User.builder()
                .name(registerRequest.getName())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .profileId(profile.getId()) // Link profile
                .build();

        User result = userRepository.save(user);

        // Auto-login after registration
        return authenticateUser(new LoginRequest(normalizedEmail, registerRequest.getPassword()));
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserResponse(user.getId(), user.getName(), user.getEmail());
    }
    @Autowired
    private com.collabpro.repository.PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    public void forgotPassword(String email) {
        String normalizedEmail = email.toLowerCase();
        userRepository.findByEmail(normalizedEmail).ifPresent(user -> {
            String otp = String.format("%06d", new java.util.Random().nextInt(999999));
            
            com.collabpro.model.PasswordResetToken token = tokenRepository.findByUser(user)
                    .orElse(new com.collabpro.model.PasswordResetToken());
            
            token.setUser(user);
            token.setOtp(otp);
            token.setExpiryDate(java.time.LocalDateTime.now().plusMinutes(5));
            token.setVerified(false);
            
            tokenRepository.save(token);
            
            // Send OTP via Email
            emailService.sendOtpEmail(normalizedEmail, otp);
        });
    }

    public void verifyOtp(String email, String otp) {
        String normalizedEmail = email.toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        com.collabpro.model.PasswordResetToken token = tokenRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Invalid OTP"));
        
        if (token.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("OTP Expired");
        }
        
        if (!token.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }
        
        token.setVerified(true);
        tokenRepository.save(token);
    }

    public void resetPassword(String email, String newPassword) {
        String normalizedEmail = email.toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        com.collabpro.model.PasswordResetToken token = tokenRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Invalid request"));
        
        if (!token.isVerified()) {
            throw new RuntimeException("OTP not verified");
        }
        
        if (token.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
             throw new RuntimeException("OTP Session Expired");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        tokenRepository.delete(token);
    }
}
