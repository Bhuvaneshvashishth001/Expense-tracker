package com.spendwise.backend.controller;

import com.spendwise.backend.dto.AnalyticsResponse;
import com.spendwise.backend.security.UserPrincipal;
import com.spendwise.backend.service.AnalyticsService;
import com.spendwise.backend.service.AuthService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
  private final AuthService authService;
  private final AnalyticsService analyticsService;

  public AnalyticsController(AuthService authService, AnalyticsService analyticsService) {
    this.authService = authService;
    this.analyticsService = analyticsService;
  }

  @GetMapping("/summary")
  public AnalyticsResponse summary(@AuthenticationPrincipal UserPrincipal principal) {
    return analyticsService.summary(authService.getCurrentUser(principal));
  }
}
