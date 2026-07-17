package com.aiCareerCoach.AiCareer.controller;

import com.aiCareerCoach.AiCareer.entity.AnalysisReport;
import com.aiCareerCoach.AiCareer.entity.User;
import com.aiCareerCoach.AiCareer.repository.AnalysisReportRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final AnalysisReportRepository analysisReportRepository;

    public HistoryController(AnalysisReportRepository analysisReportRepository) {
        this.analysisReportRepository = analysisReportRepository;
    }

    @GetMapping
    public List<AnalysisReport> list(@AuthenticationPrincipal User user) {
        return analysisReportRepository.findByUserIdOrderByAnalysisTimestampDesc(user.getId());
    }

    @GetMapping("/{id}")
    public AnalysisReport get(@PathVariable Long id) {
        return analysisReportRepository.findById(id).orElseThrow();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        analysisReportRepository.deleteById(id);
    }
}