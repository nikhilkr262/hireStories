package com.hirestories.auth.controller;

import com.hirestories.auth.dto.AuthDto;
import com.hirestories.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @CrossOrigin(origins = "*")
    @PostMapping("/register")
    public String register(@RequestBody AuthDto.RegisterRequest request) {
        return authService.saveUser(request);
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/login")
    public AuthDto.AuthResponse login(@RequestBody AuthDto.LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/validate")
    public String validateToken(@RequestParam("token") String token) {
        authService.validateToken(token);
        return "Token is valid";
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody AuthDto.ForgotPasswordRequest request) {
        return authService.forgotPassword(request.getEmail());
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody AuthDto.ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }
}
