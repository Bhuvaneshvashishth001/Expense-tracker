package com.spendwise.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationSettings {
  @Builder.Default
  private boolean email = true;

  @Builder.Default
  private boolean push = false;

  @Builder.Default
  private boolean weekly = true;
}
