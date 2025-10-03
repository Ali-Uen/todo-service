package com.aliunal.todoservice.domain.todo.repository;

import com.aliunal.todoservice.domain.todo.entity.Todo;
import com.aliunal.todoservice.shared.enums.Priority;

import java.util.List;
import java.util.Optional;

public interface TodoRepository {
    Todo save(Todo todo);
    List<Todo> findAll();
    List<Todo> findByUserId(Long userId);
    List<Todo> findByDone(boolean done);
    List<Todo> findByUserIdAndDone(Long userId, boolean done);
    Optional<Todo> findById(Long id);
    Optional<Todo> findByIdAndUserId(Long id, Long userId);
    List<Todo> findByTitleContainingIgnoreCase(String title);
    List<Todo> findByPriority(Priority priority);
    boolean existsById(Long id);
    void deleteById(Long id);
    long count();
    long countByDone(boolean done);
}