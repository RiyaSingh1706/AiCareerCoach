package com.aiCareerCoach.AiCareer.queue;

public record AiJobPayload(
        Long analysisReportId,
        Long resumeId,
        Long jobDescriptionId,
        String resumeText,
        String jdText
) {}