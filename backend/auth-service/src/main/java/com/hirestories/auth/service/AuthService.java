package com.hirestories.auth.service;

import com.hirestories.auth.dto.AuthDto;
import com.hirestories.auth.entity.User;
import com.hirestories.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final org.springframework.mail.javamail.JavaMailSender mailSender;

    public String saveUser(AuthDto.RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        return "User registered successfully";
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        String input = request.getEmail(); // Can be email or username
        User user = userRepository.findByEmailOrUsername(input, input)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getUsername());
        return new AuthDto.AuthResponse(token, user.getUsername());
    }

    public void validateToken(String token) {
        jwtService.extractAllClaims(token); // Will throw exception if invalid
    }

    public String forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with authentication email: " + email));

        // Generate 6 digit OTP
        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
        user.setResetOtp(otp);
        user.setResetOtpExpiry(java.time.LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        // Send Email
        // Send Email (Best Effort)
        try {
            org.springframework.mail.SimpleMailMessage message = new org.springframework.mail.SimpleMailMessage();
            message.setFrom("hirestoriesinfo@gmail.com");
            message.setTo(email);
            message.setSubject("HireStories - Password Reset OTP");
            message.setText("Your OTP for password reset is: " + otp + "\n\nThis OTP is valid for 15 minutes.");
            mailSender.send(message);
        } catch (Exception e) {
            // In local dev without App Password, this will fail.
            // We catch it so the process doesn't stop, and user can use Console OTP.
            System.err.println("FAILED TO SEND EMAIL (Expected in Local Dev without App Password): " + e.getMessage());
        }

        System.out.println("--------------------------------------------------");
        System.out.println("PASSWORD RESET OTP FOR " + email + ": " + otp);
        System.out.println("--------------------------------------------------");

        return "OTP sent to email";
    }

    public String resetPassword(AuthDto.ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getResetOtp() == null || !user.getResetOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getResetOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetOtp(null);
        user.setResetOtpExpiry(null);
        userRepository.save(user);

        return "Password reset successfully";
    }
}
