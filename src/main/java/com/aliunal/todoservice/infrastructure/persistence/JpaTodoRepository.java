package com.aliunal.todoservice.infrastructure.persistence;

import com.aliunal.todoservice.domain.todo.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * JPA Repository Implementation for Todo
 * Infrastructure layer - Spring Data JPA specific implementation
 */
@Repository
public interface JpaTodoRepository extends JpaRepository<Todo, Long> {
    
    /**
     * Find todos by completion status
     */
    List<Todo> findByDone(boolean done);
    
    /**
     * Find todos containing title (case insensitive)
     */
    List<Todo> findByTitleContainingIgnoreCase(String title);
    
    /**
     * Count todos by completion status
     */
    long countByDone(boolean done);
    
    /**
     * Find todos ordered by creation date descending
     */
    @Query("SELECT t FROM Todo t ORDER BY t.createdAt DESC")
    List<Todo> findAllOrderByCreatedAtDesc();
    
    /**
     * Find pending todos (not done) ordered by creation date
     */
    @Query("SELECT t FROM Todo t WHERE t.done = false ORDER BY t.createdAt ASC")
    List<Todo> findPendingTodosOrderByCreatedAt();
    
    /**
     * Find completed todos ordered by completion date
     */
    @Query("SELECT t FROM Todo t WHERE t.done = true ORDER BY t.updatedAt DESC")
    List<Todo> findCompletedTodosOrderByUpdatedAt();
}