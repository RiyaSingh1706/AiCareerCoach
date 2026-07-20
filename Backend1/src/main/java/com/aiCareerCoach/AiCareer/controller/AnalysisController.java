package com.aiCareerCoach.AiCareer.controller;

import com.aiCareerCoach.AiCareer.dto.analysis.AnalysisJobResponse;
import com.aiCareerCoach.AiCareer.dto.analysis.AnalysisReportResponse;
import com.aiCareerCoach.AiCareer.queue.AiJobPayload;
import com.aiCareerCoach.AiCareer.entity.*;
import com.aiCareerCoach.AiCareer.enums.AnalysisStatus;
import com.aiCareerCoach.AiCareer.queue.AiJobProducer;
import com.aiCareerCoach.AiCareer.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {

    private final ResumeRepository resumeRepository;
    private final JobDescriptionRepository jdRepository;
    private final AnalysisReportRepository analysisReportRepository;
    private final AiJobProducer aiJobProducer;

    public AnalysisController(ResumeRepository resumeRepository, JobDescriptionRepository jdRepository,
                              AnalysisReportRepository analysisReportRepository, AiJobProducer aiJobProducer) {
        this.resumeRepository = resumeRepository;
        this.jdRepository = jdRepository;
        this.analysisReportRepository = analysisReportRepository;
        this.aiJobProducer = aiJobProducer;
    }

    @PostMapping("/complete-analysis")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public AnalysisJobResponse startAnalysis(@AuthenticationPrincipal User user,
                                             @RequestParam Long resumeId, @RequestParam Long jdId) {
        Resume resume = resumeRepository.findById(resumeId).orElseThrow();
        JobDescription jd = jdRepository.findById(jdId).orElseThrow();

        AnalysisReport report = AnalysisReport.builder()
                .user(user).resume(resume).jobDescription(jd)
                .status(AnalysisStatus.PENDING)
                .build();
        AnalysisReport saved = analysisReportRepository.save(report);

        aiJobProducer.enqueue(new AiJobPayload(saved.getId(), resumeId, jdId,
                resume.getParsedText(), jd.getDescription()));

        return new AnalysisJobResponse(saved.getId(), AnalysisStatus.PENDING.name());
    }

    @GetMapping("/{id}")
    public AnalysisReportResponse getReport(@PathVariable Long id) {
        AnalysisReport report = analysisReportRepository.findById(id).orElseThrow();
        return new AnalysisReportResponse(
                report.getId(),
                report.getAtsScore(),
                report.getMatchPercentage(),
                report.getRecruiterDecision(),
                report.getFeedback(),
                report.getCoverLetter(),
                report.getEmailDraft(),
                report.getStatus().name(),
                report.getAnalysisTimestamp()
        );
    }
}