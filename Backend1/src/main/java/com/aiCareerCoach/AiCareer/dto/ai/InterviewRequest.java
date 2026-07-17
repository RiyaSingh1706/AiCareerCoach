package com.aiCareerCoach.AiCareer.dto.ai;

import java.util.List;

public record InterviewRequest(
        String mode, String category, String difficulty,
        List<PriorAnswer> priorHistory, String question, String answer
) {}