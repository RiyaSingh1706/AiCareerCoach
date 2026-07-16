package com.aiCareerCoach.AiCareer.dto.jobdescription;

import java.util.List;

public record JobDescriptionRequest(
        String company, String jobTitle, String description,
        List<String> skills, String experienceRequired
) {}