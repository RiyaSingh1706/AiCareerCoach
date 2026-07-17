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

    public CompleteAnalysisResponse runCompleteAnalysis(Long analysisReportId, String resumeText, String jdText) {
        try {
            return aiRestClient.post()
                    .uri("/complete-analysis")
                    .body(new CompleteAnalysisRequest(analysisReportId, resumeText, jdText))
                    .retrieve()
                    .body(CompleteAnalysisResponse.class);
        } catch (RestClientException e) {
            throw new AiServiceException("AI service failed during complete analysis", e);
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