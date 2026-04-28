package com.spendwise.backend.service;

import com.spendwise.backend.dto.AnalyticsResponse;
import com.spendwise.backend.model.Transaction;
import com.spendwise.backend.model.TransactionType;
import com.spendwise.backend.model.User;
import com.spendwise.backend.repository.TransactionRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZoneOffset;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {
  private final TransactionRepository transactionRepository;

  public AnalyticsService(TransactionRepository transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  public AnalyticsResponse summary(User user) {
    List<Transaction> transactions = transactionRepository.findByUserIdOrderByDateDesc(user.getId());
    List<Transaction> expenses = transactions.stream().filter(transaction -> transaction.getType() == TransactionType.expense).toList();
    List<Transaction> incomes = transactions.stream().filter(transaction -> transaction.getType() == TransactionType.income).toList();

    BigDecimal totalExpense = sum(expenses);
    BigDecimal totalIncome = sum(incomes);
    BigDecimal balance = totalIncome.subtract(totalExpense);
    BigDecimal averageExpense = expenses.isEmpty()
        ? BigDecimal.ZERO
        : totalExpense.divide(BigDecimal.valueOf(expenses.size()), 2, RoundingMode.HALF_UP);
    double savingsRate = totalIncome.signum() > 0
        ? balance.multiply(BigDecimal.valueOf(100)).divide(totalIncome, 2, RoundingMode.HALF_UP).doubleValue()
        : 0;

    List<AnalyticsResponse.CategorySpend> categories = expenses.stream()
        .collect(java.util.stream.Collectors.groupingBy(
            Transaction::getCategory,
            LinkedHashMap::new,
            java.util.stream.Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
        ))
        .entrySet()
        .stream()
        .sorted(Map.Entry.<String, BigDecimal>comparingByValue(Comparator.reverseOrder()))
        .map(entry -> new AnalyticsResponse.CategorySpend(entry.getKey(), entry.getValue()))
        .toList();

    AnalyticsResponse.CategorySpend topCategory = categories.isEmpty() ? null : categories.get(0);

    List<Map.Entry<String, BigDecimal>> dailyTrend = expenses.stream()
        .collect(java.util.stream.Collectors.groupingBy(
            transaction -> transaction.getDate().atZone(ZoneOffset.UTC).toLocalDate().toString(),
            java.util.stream.Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
        ))
        .entrySet()
        .stream()
        .sorted(Map.Entry.comparingByKey())
        .toList();

    List<AnalyticsResponse.TrendPoint> recentTrend = dailyTrend.stream()
        .skip(Math.max(0, dailyTrend.size() - 30))
        .map(entry -> new AnalyticsResponse.TrendPoint(entry.getKey(), entry.getValue()))
        .toList();

    return new AnalyticsResponse(totalIncome, totalExpense, balance, averageExpense, savingsRate, topCategory, categories, recentTrend);
  }

  private BigDecimal sum(List<Transaction> transactions) {
    return transactions.stream()
        .map(Transaction::getAmount)
        .reduce(BigDecimal.ZERO, BigDecimal::add);
  }
}
