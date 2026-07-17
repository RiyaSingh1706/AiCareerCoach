package com.aiCareerCoach.AiCareer.dto.ai;

public record CompleteAnalysisResponse(
        Long analysisReportId, String status, java.util.List<String> completedSteps,
        Double atsScore, Double matchPercent, String recruiterDecision,
        String feedback, String coverLetter, String emailDraft,
        java.util.List<RoadmapItemDto> roadmapItems
) {}
