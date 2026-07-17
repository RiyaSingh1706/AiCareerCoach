package com.aiCareerCoach.AiCareer.queue;

import com.aiCareerCoach.AiCareer.dto.queue.AiJobPayload;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.json.JsonMapper;

@Service
public class AiJobProducer {

    private final StringRedisTemplate redisTemplate;
    private final JsonMapper jsonMapper;

    @Value("${ai.queue.name}")
    private String queueName;

    public AiJobProducer(StringRedisTemplate redisTemplate, JsonMapper jsonMapper) {
        this.redisTemplate = redisTemplate;
        this.jsonMapper = jsonMapper;
    }

    public void enqueue(AiJobPayload payload) {
        String json = jsonMapper.writeValueAsString(payload);
        redisTemplate.opsForList().leftPush(queueName, json);
    }
}