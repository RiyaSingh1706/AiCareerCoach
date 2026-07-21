package com.aiCareerCoach.AiCareer.repository;

import com.aiCareerCoach.AiCareer.entity.EmailOTP;
import com.aiCareerCoach.AiCareer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailOtpRepository extends JpaRepository<EmailOTP, Long> {

    Optional<EmailOTP> findTopByUserOrderByCreatedAtDesc(User user);

    void deleteByUser(User user);
}