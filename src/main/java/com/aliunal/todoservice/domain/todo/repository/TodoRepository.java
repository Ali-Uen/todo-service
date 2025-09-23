package com.aliunal.todoservice.domain.todo.repository;

import com.aliunal.todoservice.domain.todo.entity.Todo;
import java.util.List;
import java.util.Optional;

/**
 * Todo Repository Interface - Domain Contract
 * Defines operations for Todo persistence without Spring Data dependencies
 */
public interface TodoRepository {
    
    /**
     * Save a todo entity
     */
    Todo save(Todo todo);
    
    /**
     * Find todo by ID
     */
    Optional<Todo> findById(Long id);
    
    /**
     * Find all todos
     */
    List<Todo> findAll();
    
    /**
     * Find todos by completion status
     */
    List<Todo> findByDone(boolean done);
    
    /**
     * Find todos containing title
     */
    List<Todo> findByTitleContainingIgnoreCase(String title);
    
    /**
     * Delete todo by ID
     */
    void deleteById(Long id);
    
    /**
     * Check if todo exists by ID
     */
    boolean existsById(Long id);
    
    /**
     * Count all todos
     */
    long count();
    
    /**
     * Count todos by completion status
     */
    long countByDone(boolean done);
}