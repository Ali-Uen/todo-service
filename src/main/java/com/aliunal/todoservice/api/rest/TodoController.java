package com.aliunal.todoservice.api.rest;

import com.aliunal.todoservice.domain.todo.service.TodoService;
import com.aliunal.todoservice.shared.dto.TodoRequest;
import com.aliunal.todoservice.shared.dto.TodoResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

/**
 * Todo REST Controller - API Layer
 * Handles HTTP requests for todo operations
 */
@RestController
@RequestMapping("/api/v1/todos")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class TodoController {
    
    private final TodoService todoService;
    
    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }
    
    /**
     * Get all todos
     */
    @GetMapping
    public ResponseEntity<List<TodoResponse>> getAllTodos(
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) String search) {
        
        List<TodoResponse> todos;
        
        if (search != null && !search.trim().isEmpty()) {
            todos = todoService.searchByTitle(search.trim());
        } else if (completed != null) {
            todos = todoService.findByStatus(completed);
        } else {
            todos = todoService.findAll();
        }
        
        return ResponseEntity.ok(todos);
    }
    
    /**
     * Get todo by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<TodoResponse> getTodoById(@PathVariable Long id) {
        TodoResponse todo = todoService.findById(id);
        return ResponseEntity.ok(todo);
    }
    
    /**
     * Create new todo
     */
    @PostMapping
    public ResponseEntity<TodoResponse> createTodo(@Valid @RequestBody TodoRequest request) {
        TodoResponse created = todoService.create(request);
        URI location = URI.create("/api/v1/todos/" + created.id());
        return ResponseEntity.created(location).body(created);
    }
    
    /**
     * Update todo
     */
    @PutMapping("/{id}")
    public ResponseEntity<TodoResponse> updateTodo(
            @PathVariable Long id,
            @Valid @RequestBody TodoRequest request) {
        TodoResponse updated = todoService.update(id, request);
        return ResponseEntity.ok(updated);
    }
    
    /**
     * Toggle todo completion status
     */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TodoResponse> toggleTodo(@PathVariable Long id) {
        TodoResponse toggled = todoService.toggleCompletion(id);
        return ResponseEntity.ok(toggled);
    }
    
    /**
     * Delete todo
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Get todo statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<TodoService.TodoStatistics> getStatistics() {
        TodoService.TodoStatistics stats = todoService.getStatistics();
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Todo API is healthy");
    }
}