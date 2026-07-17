package com.aiCareerCoach.AiCareer.controller;

import com.aiCareerCoach.AiCareer.entity.RoadmapItem;
import com.aiCareerCoach.AiCareer.repository.RoadmapItemRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roadmap")
public class RoadmapController {

    private final RoadmapItemRepository roadmapItemRepository;

    public RoadmapController(RoadmapItemRepository roadmapItemRepository) {
        this.roadmapItemRepository = roadmapItemRepository;
    }

    @GetMapping("/{analysisReportId}")
    public List<RoadmapItem> getRoadmap(@PathVariable Long analysisReportId) {
        return roadmapItemRepository.findByAnalysisReportId(analysisReportId);
    }

    public record ToggleRequest(boolean isCompleted) {}

    @PutMapping("/items/{id}")
    public RoadmapItem toggleItem(@PathVariable Long id, @RequestBody ToggleRequest req) {
        RoadmapItem item = roadmapItemRepository.findById(id).orElseThrow();
        item.setCompleted(req.isCompleted());
        return roadmapItemRepository.save(item);
    }
}