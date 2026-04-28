package com.spendwise.backend.controller;

import com.spendwise.backend.dto.AuthDtos.TransactionRequest;
import com.spendwise.backend.dto.AuthDtos.TransactionResponse;
import com.spendwise.backend.security.UserPrincipal;
import com.spendwise.backend.service.AuthService;
import com.spendwise.backend.service.TransactionService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
  private final AuthService authService;
  private final TransactionService transactionService;

  public TransactionController(AuthService authService, TransactionService transactionService) {
    this.authService = authService;
    this.transactionService = transactionService;
  }

  @GetMapping
  public List<TransactionResponse> list(@AuthenticationPrincipal UserPrincipal principal) {
    return transactionService.list(authService.getCurrentUser(principal));
  }

  @PostMapping
  public TransactionResponse create(
      @AuthenticationPrincipal UserPrincipal principal,
      @Valid @RequestBody TransactionRequest request
  ) {
    return transactionService.create(authService.getCurrentUser(principal), request);
  }

  @PutMapping("/{transactionId}")
  public TransactionResponse update(
      @AuthenticationPrincipal UserPrincipal principal,
      @PathVariable String transactionId,
      @Valid @RequestBody TransactionRequest request
  ) {
    return transactionService.update(authService.getCurrentUser(principal), transactionId, request);
  }

  @DeleteMapping("/{transactionId}")
  public Map<String, String> delete(
      @AuthenticationPrincipal UserPrincipal principal,
      @PathVariable String transactionId
  ) {
    transactionService.delete(authService.getCurrentUser(principal), transactionId);
    return Map.of("message", "Transaction deleted");
  }
}
