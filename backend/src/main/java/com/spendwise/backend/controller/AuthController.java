package com.spendwise.backend.controller;

import com.spendwise.backend.dto.AuthDtos.AuthResponse;
import com.spendwise.backend.dto.AuthDtos.LoginRequest;
import com.spendwise.backend.dto.AuthDtos.RegisterRequest;
import com.spendwise.backend.dto.AuthDtos.UserResponse;
import com.spendwise.backend.security.UserPrincipal;
import com.spendwise.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
    return authService.register(request);
  }

  @PostMapping("/login")
  public AuthResponse login(@Valid @RequestBody LoginRequest request) {
    return authService.login(request);
  }

  @GetMapping("/me")
  public UserResponse me(@AuthenticationPrincipal UserPrincipal principal) {
    return authService.me(principal);
  }
}
