package com.aiCareerCoach.AiCareer.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;

public record WorkflowEnvelope(
        boolean success,
        String message,
        WorkflowData data,
        String timestamp,
        @JsonProperty("execution_time") String executionTime
) {}