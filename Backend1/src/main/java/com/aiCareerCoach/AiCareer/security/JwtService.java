package com.aiCareerCoach.AiCareer.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-expiration-ms}")
    private long accessTokenExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateAccessToken(Long userId, String email, String role) {
        return Jwts.builder()
                .subject(String.valueOf(userId))   // subject = userId, not email — filter relies on this
                .claim("email", email)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    public String generateRefreshTokenValue() {
        return UUID.randomUUID().toString();
    }

    public Claims parseAccessToken(String token) {
        return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
    }

    public String extractEmail(String token) {
        return parseAccessToken(token).get("email", String.class);
    }

    public boolean isTokenValid(String token) {
        try {
            parseAccessToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}