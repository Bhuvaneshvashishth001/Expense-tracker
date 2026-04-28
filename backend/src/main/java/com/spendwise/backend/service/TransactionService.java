package com.spendwise.backend.service;

import com.spendwise.backend.dto.AuthDtos.TransactionRequest;
import com.spendwise.backend.dto.AuthDtos.TransactionResponse;
import com.spendwise.backend.exception.ApiException;
import com.spendwise.backend.model.Transaction;
import com.spendwise.backend.model.User;
import com.spendwise.backend.repository.TransactionRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {
  private final TransactionRepository transactionRepository;

  public TransactionService(TransactionRepository transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  public List<TransactionResponse> list(User user) {
    return transactionRepository.findByUserIdOrderByDateDesc(user.getId()).stream().map(this::toResponse).toList();
  }

  public TransactionResponse create(User user, TransactionRequest request) {
    Transaction transaction = transactionRepository.save(Transaction.builder()
        .userId(user.getId())
        .title(request.title().trim())
        .amount(request.amount())
        .type(request.type())
        .category(request.category().trim())
        .date(request.date())
        .note(trimToNull(request.note()))
        .createdAt(Instant.now())
        .updatedAt(Instant.now())
        .build());
    return toResponse(transaction);
  }

  public TransactionResponse update(User user, String transactionId, TransactionRequest request) {
    Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, user.getId())
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Transaction not found"));
    transaction.setTitle(request.title().trim());
    transaction.setAmount(request.amount());
    transaction.setType(request.type());
    transaction.setCategory(request.category().trim());
    transaction.setDate(request.date());
    transaction.setNote(trimToNull(request.note()));
    transaction.setUpdatedAt(Instant.now());
    return toResponse(transactionRepository.save(transaction));
  }

  public void delete(User user, String transactionId) {
    Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, user.getId())
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Transaction not found"));
    transactionRepository.delete(transaction);
  }

  private TransactionResponse toResponse(Transaction transaction) {
    return new TransactionResponse(
        transaction.getId(),
        transaction.getTitle(),
        transaction.getAmount(),
        transaction.getType(),
        transaction.getCategory(),
        transaction.getDate(),
        transaction.getNote()
    );
  }

  private String trimToNull(String value) {
    if (value == null) {
      return null;
    }
    String trimmed = value.trim();
    return trimmed.isEmpty() ? null : trimmed;
  }
}
