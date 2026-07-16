package com.aiCareerCoach.AiCareer.dto.queue;

public record AiJobPayload(
        Long analysisReportId,
        Long resumeId,
        Long jobDescriptionId,
        String resumeText,
        String jdText
) {}