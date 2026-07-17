package com.aiCareerCoach.AiCareer.service;

import com.aiCareerCoach.AiCareer.dto.Auth.*;
import com.aiCareerCoach.AiCareer.entity.RefreshToken;
import com.aiCareerCoach.AiCareer.entity.User;
import com.aiCareerCoach.AiCareer.enums.Role;
import com.aiCareerCoach.AiCareer.repository.RefreshTokenRepository;
import com.aiCareerCoach.AiCareer.repository.UserRepository;
import com.aiCareerCoach.AiCareer.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private static final long REFRESH_TOKEN_EXPIRY_DAYS = 7;

    public AuthService(UserRepository userRepository, RefreshTokenRepository refreshTokenRepository,
                       PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .name(req.name())
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .role(Role.USER)
                .build();
        User saved = userRepository.save(user);

        return issueTokens(saved);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return issueTokens(user);
    }

    private AuthResponse issueTokens(User user) {
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshTokenValue = jwtService.generateRefreshTokenValue();

        RefreshToken refreshToken = RefreshToken.builder()
                .userId(user.getId())
                .token(refreshTokenValue)
                .expiryDate(LocalDateTime.now().plusDays(REFRESH_TOKEN_EXPIRY_DAYS))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);

        return new AuthResponse(accessToken, refreshTokenValue,
                user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    public AuthResponse refresh(RefreshRequest req) {
        RefreshToken storedToken = refreshTokenRepository.findByToken(req.refreshToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        if (storedToken.isRevoked() || storedToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Refresh token expired or revoked");
        }

        User user = userRepository.findById(storedToken.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User no longer exists"));

        String newAccessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());

        return new AuthResponse(newAccessToken, storedToken.getToken(),
                user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    public void logout(String refreshTokenValue) {
        refreshTokenRepository.findByToken(refreshTokenValue)
                .ifPresent(token -> {
                    token.setRevoked(true);
                    refreshTokenRepository.save(token);
                });
    }


}