package com.aliunal.todoservice.api.rest;

import com.aliunal.todoservice.domain.todo.service.TodoService;
import com.aliunal.todoservice.shared.dto.TodoRequest;
import com.aliunal.todoservice.shared.dto.TodoResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.List;

/**
 * Todo REST Controller - API Layer
 * Handles HTTP requests for todo operations
 */
@RestController
@RequestMapping("/api/v1/todos")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@Tag(name = "Todo", description = "Todo management API")
public class TodoController {
    
    private final TodoService todoService;
    
    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }
    
    /**
     * Get all todos
     */
    @Operation(summary = "Get all todos", description = "Retrieve all todos with optional filtering")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved todos"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    public ResponseEntity<List<TodoResponse>> getAllTodos(
            @Parameter(description = "Filter by completion status")
            @RequestParam(required = false) Boolean completed,
            @Parameter(description = "Search term for title/description")
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
    @Operation(summary = "Get todo by ID", description = "Retrieve a specific todo by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Todo found and returned"),
        @ApiResponse(responseCode = "404", description = "Todo not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/{id}")
    public ResponseEntity<TodoResponse> getTodoById(
            @Parameter(description = "ID of the todo to retrieve")
            @PathVariable Long id) {
        TodoResponse todo = todoService.findById(id);
        return ResponseEntity.ok(todo);
    }
    
    /**
     * Create new todo
     */
    @Operation(summary = "Create new todo", description = "Create a new todo item")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Todo created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping
    public ResponseEntity<TodoResponse> createTodo(
            @Parameter(description = "Todo data to create")
            @Valid @RequestBody TodoRequest request) {
        TodoResponse created = todoService.create(request);
        URI location = URI.create("/api/v1/todos/" + created.id());
        return ResponseEntity.created(location).body(created);
    }
    
    /**
     * Update todo
     */
    @Operation(summary = "Update todo", description = "Update an existing todo item")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Todo updated successfully"),
        @ApiResponse(responseCode = "404", description = "Todo not found"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("/{id}")
    public ResponseEntity<TodoResponse> updateTodo(
            @Parameter(description = "ID of the todo to update")
            @PathVariable Long id,
            @Parameter(description = "Updated todo data")
            @Valid @RequestBody TodoRequest request) {
        TodoResponse updated = todoService.update(id, request);
        return ResponseEntity.ok(updated);
    }
    
    /**
     * Toggle todo completion status
     */
    @Operation(summary = "Toggle todo completion", description = "Toggle the completion status of a todo")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Todo status toggled successfully"),
        @ApiResponse(responseCode = "404", description = "Todo not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TodoResponse> toggleTodo(
            @Parameter(description = "ID of the todo to toggle")
            @PathVariable Long id) {
        TodoResponse toggled = todoService.toggleCompletion(id);
        return ResponseEntity.ok(toggled);
    }
    
    /**
     * Delete todo
     */
    @Operation(summary = "Delete todo", description = "Delete a todo item by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Todo deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Todo not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(
            @Parameter(description = "ID of the todo to delete")
            @PathVariable Long id) {
        todoService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Get todo statistics
     */
    @Operation(summary = "Get todo statistics", description = "Retrieve statistics about todos (total, completed, pending)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/statistics")
    public ResponseEntity<TodoService.TodoStatistics> getStatistics() {
        TodoService.TodoStatistics stats = todoService.getStatistics();
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Health check endpoint
     */
    @Operation(summary = "Health check", description = "Check if the todo API is healthy and running")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "API is healthy"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Todo API is healthy");
    }
}