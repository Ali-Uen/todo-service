package com.aliunal.todoservice.shared.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.aliunal.todoservice.domain.todo.entity.Todo;

import java.time.Instant;

/**
 * Todo Response DTO - API Layer
 * Data Transfer Object for returning todo data to clients
 */
public record TodoResponse(
        Long id,
        String title,
        String description,
        
        boolean done,
        
        Todo.Priority priority,
        Instant createdAt,
        Instant updatedAt
) {
    
    /**
     * Factory method to create TodoResponse from Todo entity
     */
    public static TodoResponse from(Todo todo) {
        return new TodoResponse(
                todo.getId(),
                todo.getTitle(),
                todo.getDescription(),
                todo.isDone(),
                todo.getPriority(),
                todo.getCreatedAt(),
                todo.getUpdatedAt()
        );
    }
    
    /**
     * Create response without updatedAt (for backward compatibility)
     */
    public static TodoResponse fromLegacy(Todo todo) {
        return new TodoResponse(
                todo.getId(),
                todo.getTitle(),
                todo.getDescription(),
                todo.isDone(),
                todo.getPriority(),
                todo.getCreatedAt(),
                null
        );
    }
}