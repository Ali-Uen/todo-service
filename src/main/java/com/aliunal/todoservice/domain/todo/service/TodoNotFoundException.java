package com.aliunal.todoservice.domain.todo.service;

/**
 * Exception thrown when a todo is not found
 */
public class TodoNotFoundException extends RuntimeException {
    
    public TodoNotFoundException(String message) {
        super(message);
    }
    
    public TodoNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}