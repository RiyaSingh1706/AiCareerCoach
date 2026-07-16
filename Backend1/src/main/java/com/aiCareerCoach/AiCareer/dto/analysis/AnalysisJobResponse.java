package com.aiCareerCoach.AiCareer.dto.analysis;

public record AnalysisJobResponse(
        Long analysisReportId,
        String status // PENDING — this is what the controller returns IMMEDIATELY, not the full result
) {}