package com.spendwise.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public record AnalyticsResponse(
    BigDecimal totalIncome,
    BigDecimal totalExpense,
    BigDecimal balance,
    BigDecimal averageExpense,
    double savingsRate,
    CategorySpend topCategory,
    List<CategorySpend> categories,
    List<TrendPoint> dailyTrend
) {
  public record CategorySpend(
      String category,
      BigDecimal amount
  ) {
  }

  public record TrendPoint(
      String date,
      BigDecimal amount
  ) {
  }
}
