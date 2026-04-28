package com.spendwise.backend.service;

import com.spendwise.backend.model.Transaction;
import com.spendwise.backend.model.TransactionType;
import com.spendwise.backend.model.User;
import com.spendwise.backend.repository.TransactionRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class SeedDataService {
  private final TransactionRepository transactionRepository;

  public SeedDataService(TransactionRepository transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  public void seedStarterTransactions(User user) {
    Instant now = Instant.now();
    List<Transaction> starterTransactions = List.of(
        transaction(user, "Monthly Salary", "5800", TransactionType.income, "Salary", now.minus(2, ChronoUnit.DAYS), null),
        transaction(user, "Whole Foods", "124.50", TransactionType.expense, "Food & Dining", now.minus(1, ChronoUnit.DAYS), null),
        transaction(user, "Uber rides", "38.20", TransactionType.expense, "Transport", now.minus(1, ChronoUnit.DAYS), null),
        transaction(user, "Netflix", "15.99", TransactionType.expense, "Entertainment", now.minus(3, ChronoUnit.DAYS), null),
        transaction(user, "Freelance project", "1200", TransactionType.income, "Freelance", now.minus(5, ChronoUnit.DAYS), null),
        transaction(user, "Electricity bill", "89.40", TransactionType.expense, "Bills & Utilities", now.minus(6, ChronoUnit.DAYS), null),
        transaction(user, "Amazon order", "78.30", TransactionType.expense, "Shopping", now.minus(20, ChronoUnit.DAYS), "Starter demo data")
    );
    transactionRepository.saveAll(starterTransactions);
  }

  private Transaction transaction(
      User user,
      String title,
      String amount,
      TransactionType type,
      String category,
      Instant date,
      String note
  ) {
    return Transaction.builder()
        .userId(user.getId())
        .title(title)
        .amount(new BigDecimal(amount))
        .type(type)
        .category(category)
        .date(date)
        .note(note)
        .build();
  }
}
