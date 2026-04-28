package com.spendwise.backend.dto;

import com.spendwise.backend.model.NotificationSettings;
import com.spendwise.backend.model.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;

public final class AuthDtos {
  private AuthDtos() {
  }

  public record RegisterRequest(
      @NotBlank @Size(min = 2, max = 60) String name,
      @NotBlank @Email @Size(max = 80) String email,
      @NotBlank @Size(min = 8, max = 72) String password
  ) {
  }

  public record LoginRequest(
      @NotBlank @Email @Size(max = 80) String email,
      @NotBlank @Size(min = 6, max = 72) String password
  ) {
  }

  public record AuthResponse(
      String token,
      UserResponse user
  ) {
  }

  public record UserResponse(
      String id,
      String name,
      String email,
      String plan,
      NotificationSettings notifications
  ) {
  }

  public record UpdateProfileRequest(
      @NotBlank @Size(min = 2, max = 60) String name,
      @NotBlank @Email @Size(max = 80) String email
  ) {
  }

  public record UpdateNotificationsRequest(
      boolean email,
      boolean push,
      boolean weekly
  ) {
  }

  public record TransactionRequest(
      @NotBlank @Size(max = 80) String title,
      @NotNull @DecimalMin(value = "0.01") BigDecimal amount,
      @NotNull TransactionType type,
      @NotBlank @Size(max = 40) String category,
      @NotNull Instant date,
      @Size(max = 200) String note
  ) {
  }

  public record TransactionResponse(
      String id,
      String title,
      BigDecimal amount,
      TransactionType type,
      String category,
      Instant date,
      String note
  ) {
  }
}
