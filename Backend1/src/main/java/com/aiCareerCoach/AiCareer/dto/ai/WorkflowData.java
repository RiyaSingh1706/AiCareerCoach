package com.aiCareerCoach.AiCareer.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

public record WorkflowData(
        @JsonProperty("analysis_report_id") Long analysisReportId,
        String status,
        @JsonProperty("completed_steps") List<String> completedSteps,
        @JsonProperty("parsed_resume") Object parsedResume,
        @JsonProperty("parsed_jd") Object parsedJd,
        @JsonProperty("resume_score") Object resumeScore,
        @JsonProperty("ats_result") Map<String, Object> atsResult,
        @JsonProperty("skill_gap") Map<String, Object> skillGap,
        @JsonProperty("career_roles") Object careerRoles,
        Object roadmap,
        Object projects,
        Object courses,
        @JsonProperty("recruiter_decision") String recruiterDecision,
        @JsonProperty("recruiter_reasoning") String recruiterReasoning,
        @JsonProperty("cover_letter") Map<String, Object> coverLetter,
        @JsonProperty("email_draft") String emailDraft,
        List<String> feedback
) {}