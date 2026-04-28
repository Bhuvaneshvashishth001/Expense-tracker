package com.spendwise.backend.repository;

import com.spendwise.backend.model.Transaction;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
  List<Transaction> findByUserIdOrderByDateDesc(String userId);

  Optional<Transaction> findByIdAndUserId(String id, String userId);
}
