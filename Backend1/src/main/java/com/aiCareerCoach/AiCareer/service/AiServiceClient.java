package com.aiCareerCoach.AiCareer.service;

import com.aiCareerCoach.AiCareer.dto.ai.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
public class AiServiceClient {

    private final RestClient aiRestClient;

    public AiServiceClient(RestClient aiRestClient) {
        this.aiRestClient = aiRestClient;
    }

    public WorkflowEnvelope runWorkflow(Long analysisReportId, String resumeText, String jdText, String companyName) {
        try {
            return aiRestClient.post()
                    .uri("/workflow/run")
                    .body(new WorkflowRunRequest(resumeText, jdText, analysisReportId, "MEDIUM", companyName))
                    .retrieve()
                    .body(WorkflowEnvelope.class);
        } catch (RestClientException e) {
            throw new AiServiceException("AI service failed during workflow run", e);
        }
    }

    public InterviewResponse runInterview(InterviewRequest request) {
        try {
            return aiRestClient.post()
                    .uri("/interview")
                    .body(request)
                    .retrieve()
                    .body(InterviewResponse.class);
        } catch (RestClientException e) {
            throw new AiServiceException("AI service failed during interview call", e);
        }
    }
}