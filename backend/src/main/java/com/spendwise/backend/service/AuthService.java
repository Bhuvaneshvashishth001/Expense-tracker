package com.spendwise.backend.service;

import com.spendwise.backend.dto.AuthDtos.AuthResponse;
import com.spendwise.backend.dto.AuthDtos.LoginRequest;
import com.spendwise.backend.dto.AuthDtos.RegisterRequest;
import com.spendwise.backend.dto.AuthDtos.UserResponse;
import com.spendwise.backend.exception.ApiException;
import com.spendwise.backend.model.User;
import com.spendwise.backend.repository.UserRepository;
import com.spendwise.backend.security.JwtService;
import com.spendwise.backend.security.UserPrincipal;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;
  private final SeedDataService seedDataService;

  public AuthService(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      AuthenticationManager authenticationManager,
      JwtService jwtService,
      SeedDataService seedDataService
  ) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
    this.seedDataService = seedDataService;
  }

  public AuthResponse register(RegisterRequest request) {
    String email = request.email().trim().toLowerCase();
    if (userRepository.existsByEmailIgnoreCase(email)) {
      throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists");
    }

    User user = userRepository.save(User.builder()
        .name(request.name().trim())
        .email(email)
        .passwordHash(passwordEncoder.encode(request.password()))
        .createdAt(Instant.now())
        .updatedAt(Instant.now())
        .build());

    seedDataService.seedStarterTransactions(user);
    return buildAuthResponse(user);
  }

  public AuthResponse login(LoginRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.email().trim().toLowerCase(), request.password())
    );

    User user = userRepository.findByEmailIgnoreCase(request.email().trim().toLowerCase())
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

    return buildAuthResponse(user);
  }

  public UserResponse me(UserPrincipal principal) {
    return toUserResponse(principal.getUser());
  }

  public User getCurrentUser(UserPrincipal principal) {
    return userRepository.findById(principal.getUser().getId())
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
  }

  public UserResponse toUserResponse(User user) {
    return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getPlan(), user.getNotifications());
  }

  private AuthResponse buildAuthResponse(User user) {
    String token = jwtService.generateToken(user.getId(), user.getEmail());
    return new AuthResponse(token, toUserResponse(user));
  }
}
