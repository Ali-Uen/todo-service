package com.aliunal.todoservice.shared.dto;

import com.aliunal.todoservice.domain.todo.entity.Todo;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Todo Request DTO - API Layer
 * Data Transfer Object for creating and updating todos
 */
public record TodoRequest(
        
        @NotBlank(message = "Title is required")
        @Size(max = 255, message = "Title must not exceed 255 characters")
        String title,
        
        @Size(max = 1000, message = "Description must not exceed 1000 characters")
        String description,
        
        Boolean done,
        
        Todo.Priority priority
) {
    
    /**
     * Constructor with defaults for creation
     */
    public TodoRequest(String title, String description) {
        this(title, description, false, Todo.Priority.MEDIUM);
    }
    
    /**
     * Constructor for title only
     */
    public TodoRequest(String title) {
        this(title, null, false, Todo.Priority.MEDIUM);
    }
}