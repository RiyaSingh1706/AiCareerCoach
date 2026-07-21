package com.aiCareerCoach.AiCareer.service;

import com.aiCareerCoach.AiCareer.service.OtpService;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class OtpServiceImpl implements OtpService {

    private final SecureRandom random = new SecureRandom();

    @Override
    public String generateOtp() {
        return String.format("%06d", random.nextInt(1_000_000));
    }
}