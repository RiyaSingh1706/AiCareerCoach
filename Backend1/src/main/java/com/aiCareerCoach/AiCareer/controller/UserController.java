package com.aiCareerCoach.AiCareer.controller;

import com.aiCareerCoach.AiCareer.dto.User.UserResponse;
import com.aiCareerCoach.AiCareer.entity.User;
import com.aiCareerCoach.AiCareer.repository.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(@AuthenticationPrincipal User user) {
        return toResponse(user);
    }

    @PutMapping("/me")
    public UserResponse updateCurrentUser(@AuthenticationPrincipal User user,
                                          @RequestBody UpdateUserRequest request) {
        user.setName(request.name());
        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(), user.getName(), user.getEmail(),
                user.getRole().name(), user.getPlan(), user.getPlanRenewsAt()
        );
    }

    public record UpdateUserRequest(String name) {}
}