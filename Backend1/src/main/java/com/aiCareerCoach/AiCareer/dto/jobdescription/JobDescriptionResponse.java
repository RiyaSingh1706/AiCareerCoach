package com.aiCareerCoach.AiCareer.dto.jobdescription;

import java.util.List;

public record JobDescriptionResponse(
        Long id, String company, String jobTitle, String description,
        List<String> skills, String experienceRequired, String source,
        Double matchPercentage, String recruiterDecision // latest linked analysis, nullable
) {}