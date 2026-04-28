package com.spendwise.backend.model;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
  @Id
  private String id;
  private String name;
  private String email;
  private String passwordHash;

  @Builder.Default
  private String plan = "Pro";

  @Builder.Default
  private NotificationSettings notifications = NotificationSettings.builder().build();

  @Builder.Default
  private Instant createdAt = Instant.now();

  @Builder.Default
  private Instant updatedAt = Instant.now();
}
