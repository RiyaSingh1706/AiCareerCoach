package com.aiCareerCoach.AiCareer.dto.ai;

public record InterviewResponse(
        String question, String suggestedNextDifficulty,
        Integer score, String feedbackLabel, String feedbackTip
) {}