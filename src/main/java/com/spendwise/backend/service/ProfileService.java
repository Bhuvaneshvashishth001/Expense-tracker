package com.spendwise.backend.service;

import com.spendwise.backend.dto.AuthDtos.UpdateNotificationsRequest;
import com.spendwise.backend.dto.AuthDtos.UpdateProfileRequest;
import com.spendwise.backend.dto.AuthDtos.UserResponse;
import com.spendwise.backend.exception.ApiException;
import com.spendwise.backend.model.NotificationSettings;
import com.spendwise.backend.model.User;
import com.spendwise.backend.repository.UserRepository;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {
  private final UserRepository userRepository;
  private final AuthService authService;

  public ProfileService(UserRepository userRepository, AuthService authService) {
    this.userRepository = userRepository;
    this.authService = authService;
  }

  public UserResponse updateProfile(User user, UpdateProfileRequest request) {
    String email = request.email().trim().toLowerCase();
    userRepository.findByEmailIgnoreCase(email)
        .filter(existing -> !existing.getId().equals(user.getId()))
        .ifPresent(existing -> {
          throw new ApiException(HttpStatus.CONFLICT, "Another account already uses this email");
        });

    user.setName(request.name().trim());
    user.setEmail(email);
    user.setUpdatedAt(Instant.now());
    return authService.toUserResponse(userRepository.save(user));
  }

  public NotificationSettings updateNotifications(User user, UpdateNotificationsRequest request) {
    user.setNotifications(NotificationSettings.builder()
        .email(request.email())
        .push(request.push())
        .weekly(request.weekly())
        .build());
    user.setUpdatedAt(Instant.now());
    return userRepository.save(user).getNotifications();
  }
}
