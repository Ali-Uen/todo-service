package com.aliunal.todoservice.infrastructure.persistence.jpa.repository;

import com.aliunal.todoservice.domain.todo.entity.Todo;
import com.aliunal.todoservice.shared.enums.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JpaTodoRepository extends JpaRepository<Todo, Long> {
    
    List<Todo> findByUserId(Long userId);
    List<Todo> findByDone(boolean done);
    List<Todo> findByUserIdAndDone(Long userId, boolean done);
    Optional<Todo> findByIdAndUserId(Long id, Long userId);
    List<Todo> findByTitleContainingIgnoreCase(String title);
    List<Todo> findByPriority(Priority priority);
    long countByDone(boolean done);
}