package com.aiCareerCoach.AiCareer.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;

public record WorkflowRunRequest(
        @JsonProperty("resume_text") String resumeText,
        @JsonProperty("jd_text") String jdText,
        @JsonProperty("analysis_report_id") Long analysisReportId,
        String difficulty,
        @JsonProperty("company_name") String companyName
) {}