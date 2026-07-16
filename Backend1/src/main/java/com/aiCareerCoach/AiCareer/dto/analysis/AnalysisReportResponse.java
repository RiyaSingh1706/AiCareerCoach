package com.aiCareerCoach.AiCareer.dto.analysis;

import java.math.BigDecimal;

public record AnalysisReportResponse(
        Long id, BigDecimal atsScore, BigDecimal matchPercentage,
        String recruiterDecision, String feedback, String coverLetter,
        String emailDraft, String status, java.time.LocalDateTime analysisTimestamp
) {}