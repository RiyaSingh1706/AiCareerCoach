package com.aiCareerCoach.AiCareer.controller;

import com.aiCareerCoach.AiCareer.dto.ai.*;
import com.aiCareerCoach.AiCareer.entity.*;
import com.aiCareerCoach.AiCareer.repository.*;
import com.aiCareerCoach.AiCareer.service.AiServiceClient;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interview")
public class InterviewController {

    private final InterviewSessionRepository sessionRepository;
    private final InterviewSessionAnswerRepository answerRepository;
    private final AiServiceClient aiServiceClient;

    public InterviewController(InterviewSessionRepository sessionRepository,
                               InterviewSessionAnswerRepository answerRepository,
                               AiServiceClient aiServiceClient) {
        this.sessionRepository = sessionRepository;
        this.answerRepository = answerRepository;
        this.aiServiceClient = aiServiceClient;
    }

    public record StartSessionRequest(String category, String difficulty, Integer questionCount) {}
    public record SessionStartResponse(Long sessionId, String question) {}
    public record SubmitAnswerRequest(String answer) {}
    public record AnswerFeedbackResponse(Integer score, String feedbackLabel, String feedbackTip,
                                         String nextQuestion, boolean sessionComplete, Integer finalScore) {}

    @PostMapping("/sessions")
    public SessionStartResponse startSession(@AuthenticationPrincipal User user, @RequestBody StartSessionRequest req) {
        InterviewSession session = InterviewSession.builder()
                .user(user).category(req.category()).difficulty(req.difficulty())
                .questionCount(req.questionCount()).build();
        InterviewSession saved = sessionRepository.save(session);

        InterviewResponse aiResponse = aiServiceClient.runInterview(
                new InterviewRequest("generate", req.category(), req.difficulty(), List.of(), null, null));

        InterviewSessionAnswer firstQ = InterviewSessionAnswer.builder()
                .session(saved).questionText(aiResponse.question()).orderIndex(0).build();
        answerRepository.save(firstQ);

        return new SessionStartResponse(saved.getId(), aiResponse.question());
    }

    @PostMapping("/sessions/{id}/answers")
    public AnswerFeedbackResponse submitAnswer(@PathVariable Long id, @RequestBody SubmitAnswerRequest req) {
        InterviewSession session = sessionRepository.findById(id).orElseThrow();
        List<InterviewSessionAnswer> answers = answerRepository.findBySessionIdOrderByOrderIndexAsc(id);
        InterviewSessionAnswer current = answers.get(answers.size() - 1);
        current.setAnswerText(req.answer());

        InterviewResponse evalResult = aiServiceClient.runInterview(
                new InterviewRequest("evaluate", null, null, null, current.getQuestionText(), req.answer()));

        current.setFeedbackLabel(evalResult.feedbackLabel());
        current.setFeedbackTip(evalResult.feedbackTip());
        answerRepository.save(current);

        boolean isComplete = answers.size() >= session.getQuestionCount();

        if (isComplete) {
            int avgScore = (int) answers.stream()
                    .mapToInt(a -> evalResult.score() != null ? evalResult.score() : 0)
                    .average().orElse(0);
            session.setScore(avgScore);
            sessionRepository.save(session);
            return new AnswerFeedbackResponse(evalResult.score(), evalResult.feedbackLabel(),
                    evalResult.feedbackTip(), null, true, avgScore);
        }

        List<PriorAnswer> history = answers.stream()
                .map(a -> new PriorAnswer(a.getQuestionText(), a.getAnswerText(), evalResult.score()))
                .toList();

        InterviewResponse nextQ = aiServiceClient.runInterview(new InterviewRequest(
                "generate", session.getCategory(), evalResult.suggestedNextDifficulty(), history, null, null));

        InterviewSessionAnswer nextAnswer = InterviewSessionAnswer.builder()
                .session(session).questionText(nextQ.question()).orderIndex(answers.size()).build();
        answerRepository.save(nextAnswer);

        return new AnswerFeedbackResponse(evalResult.score(), evalResult.feedbackLabel(),
                evalResult.feedbackTip(), nextQ.question(), false, null);
    }

    @GetMapping("/sessions")
    public List<InterviewSession> listSessions(@AuthenticationPrincipal User user) {
        return sessionRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @GetMapping("/sessions/{id}")
    public InterviewSession getSession(@PathVariable Long id) {
        return sessionRepository.findById(id).orElseThrow();
    }
}