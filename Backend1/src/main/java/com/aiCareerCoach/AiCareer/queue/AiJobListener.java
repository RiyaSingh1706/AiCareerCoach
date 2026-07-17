package com.aiCareerCoach.AiCareer.queue;

import com.aiCareerCoach.AiCareer.dto.ai.CompleteAnalysisResponse;
import com.aiCareerCoach.AiCareer.dto.queue.AiJobPayload;
import com.aiCareerCoach.AiCareer.entity.AnalysisReport;
import com.aiCareerCoach.AiCareer.enums.AnalysisStatus;
import com.aiCareerCoach.AiCareer.repository.AnalysisReportRepository;
import com.aiCareerCoach.AiCareer.service.AiServiceClient;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import tools.jackson.databind.json.JsonMapper;

import java.math.BigDecimal;
import java.time.Duration;

@Component
public class AiJobListener {

    private final StringRedisTemplate redisTemplate;
    private final JsonMapper jsonMapper;
    private final AiServiceClient aiServiceClient;
    private final AnalysisReportRepository analysisReportRepository;

    @Value("${ai.queue.name}")
    private String queueName;

    public AiJobListener(StringRedisTemplate redisTemplate, JsonMapper jsonMapper,
                         AiServiceClient aiServiceClient, AnalysisReportRepository analysisReportRepository) {
        this.redisTemplate = redisTemplate;
        this.jsonMapper = jsonMapper;
        this.aiServiceClient = aiServiceClient;
        this.analysisReportRepository = analysisReportRepository;
    }

    @PostConstruct
    public void startListening() {
        Thread listenerThread = new Thread(this::listen);
        listenerThread.setDaemon(true);
        listenerThread.start();
    }

    private void listen() {
        while (true) {
            try {
                String json = redisTemplate.opsForList().rightPop(queueName, Duration.ofSeconds(5));
                if (json == null) continue;

                AiJobPayload payload = jsonMapper.readValue(json, AiJobPayload.class);
                processJob(payload);
            } catch (Exception e) {
                System.out.println("AI job processing failed: " + e.getMessage());
            }
        }
    }

    private void processJob(AiJobPayload payload) {
        AnalysisReport report = analysisReportRepository.findById(payload.analysisReportId()).orElseThrow();
        report.setStatus(AnalysisStatus.IN_PROGRESS);
        analysisReportRepository.save(report);

        try {
            CompleteAnalysisResponse result = aiServiceClient.runCompleteAnalysis(
                    payload.analysisReportId(), payload.resumeText(), payload.jdText());

            if (result.atsScore() != null) report.setAtsScore(BigDecimal.valueOf(result.atsScore()));
            if (result.matchPercent() != null) report.setMatchPercentage(BigDecimal.valueOf(result.matchPercent()));
            report.setRecruiterDecision(result.recruiterDecision());
            report.setFeedback(result.feedback());
            report.setCoverLetter(result.coverLetter());
            report.setEmailDraft(result.emailDraft());
            report.setStatus(AnalysisStatus.valueOf(result.status()));

        } catch (Exception e) {
            report.setStatus(AnalysisStatus.FAILED);
        }

        analysisReportRepository.save(report);
    }
}