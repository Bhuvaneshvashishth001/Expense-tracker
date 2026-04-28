package com.spendwise.backend.controller;

import com.spendwise.backend.dto.AuthDtos.UpdateNotificationsRequest;
import com.spendwise.backend.dto.AuthDtos.UpdateProfileRequest;
import com.spendwise.backend.dto.AuthDtos.UserResponse;
import com.spendwise.backend.model.NotificationSettings;
import com.spendwise.backend.model.User;
import com.spendwise.backend.security.UserPrincipal;
import com.spendwise.backend.service.AuthService;
import com.spendwise.backend.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
  private final AuthService authService;
  private final ProfileService profileService;

  public ProfileController(AuthService authService, ProfileService profileService) {
    this.authService = authService;
    this.profileService = profileService;
  }

  @GetMapping
  public UserResponse getProfile(@AuthenticationPrincipal UserPrincipal principal) {
    return authService.toUserResponse(authService.getCurrentUser(principal));
  }

  @PutMapping
  public UserResponse updateProfile(
      @AuthenticationPrincipal UserPrincipal principal,
      @Valid @RequestBody UpdateProfileRequest request
  ) {
    User user = authService.getCurrentUser(principal);
    return profileService.updateProfile(user, request);
  }

  @GetMapping("/notifications")
  public NotificationSettings getNotifications(@AuthenticationPrincipal UserPrincipal principal) {
    return authService.getCurrentUser(principal).getNotifications();
  }

  @PutMapping("/notifications")
  public NotificationSettings updateNotifications(
      @AuthenticationPrincipal UserPrincipal principal,
      @RequestBody UpdateNotificationsRequest request
  ) {
    User user = authService.getCurrentUser(principal);
    return profileService.updateNotifications(user, request);
  }
}
