package com.aliunal.todoservice.domain.todo.service;

import com.aliunal.todoservice.domain.todo.entity.Todo;
import com.aliunal.todoservice.domain.todo.repository.TodoRepository;
import com.aliunal.todoservice.shared.dto.TodoRequest;
import com.aliunal.todoservice.shared.dto.TodoResponse;
import com.aliunal.todoservice.shared.enums.Priority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Todo Domain Service
 * Contains business logic for todo operations
 */
@Service
@Transactional
public class TodoService {
    
    private final TodoRepository todoRepository;
    
    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }
    
    /**
     * Find all todos ordered by creation date
     */
    @Transactional(readOnly = true)
    public List<TodoResponse> findAll() {
        return todoRepository.findAll()
                .stream()
                .map(TodoResponse::from)
                .toList();
    }
    
    /**
     * Find all todos for a specific user
     */
    @Transactional(readOnly = true)
    public List<TodoResponse> findAllForUser(Long userId) {
        return todoRepository.findByUserId(userId)
                .stream()
                .map(TodoResponse::from)
                .toList();
    }
    
    /**
     * Find todo by ID for a specific user
     */
    @Transactional(readOnly = true) 
    public TodoResponse findByIdForUser(Long id, Long userId) {
        Todo todo = todoRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Todo not found or access denied"));
        return TodoResponse.from(todo);
    }
    
    /**
     * Update a todo for a specific user
     */
    public TodoResponse updateForUser(Long id, TodoRequest request, Long userId) {
        validateTodoRequest(request);
        
        Todo todo = todoRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Todo not found or access denied"));
                
        // Update content
        todo.updateContent(request.title(), request.description(), request.priority());
        
        // Update completion status
        if (request.done() != null) {
            if (request.done()) {
                todo.markAsDone();
            } else {
                todo.markAsUndone();
            }
        }
        
        Todo savedTodo = todoRepository.save(todo);
        return TodoResponse.from(savedTodo);
    }
    
    /**
     * Delete a todo for a specific user
     */
    public void deleteForUser(Long id, Long userId) {
        if (!todoRepository.findByIdAndUserId(id, userId).isPresent()) {
            throw new RuntimeException("Todo not found or access denied");
        }
        todoRepository.deleteById(id);
    }
    
    /**
     * Find todo by ID
     */
    @Transactional(readOnly = true)
    public TodoResponse findById(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException("Todo not found with id: " + id));
        return TodoResponse.from(todo);
    }
    
    /**
     * Find todos by completion status
     */
    @Transactional(readOnly = true)
    public List<TodoResponse> findByStatus(boolean done) {
        return todoRepository.findByDone(done)
                .stream()
                .map(TodoResponse::from)
                .toList();
    }
    
    /**
     * Search todos by title
     */
    @Transactional(readOnly = true)
    public List<TodoResponse> searchByTitle(String title) {
        return todoRepository.findByTitleContainingIgnoreCase(title)
                .stream()
                .map(TodoResponse::from)
                .toList();
    }
    
    /**
     * Create a new todo
     */
    public TodoResponse create(TodoRequest request) {
        validateTodoRequest(request);
        
        // For backward compatibility, use default user ID 1
        // This should be updated to use actual user ID from authentication
        Todo todo = new Todo(request.title(), request.description(), 1L);
        
        // Set priority (default to MEDIUM if not provided)
        if (request.priority() != null) {
            todo.updatePriority(request.priority());
        }
        
        if (request.done() != null && request.done()) {
            todo.markAsDone();
        }
        
        Todo savedTodo = todoRepository.save(todo);
        return TodoResponse.from(savedTodo);
    }
    
    /**
     * Create a new todo for a specific user
     */
    public TodoResponse createForUser(TodoRequest request, Long userId) {
        validateTodoRequest(request);
        
        Todo todo = new Todo(request.title(), request.description(), userId);
        
        // Set priority (default to MEDIUM if not provided) 
        if (request.priority() != null) {
            todo.updatePriority(request.priority());
        }
        
        if (request.done() != null && request.done()) {
            todo.markAsDone();
        }
        
        Todo savedTodo = todoRepository.save(todo);
        return TodoResponse.from(savedTodo);
    }
    
    /**
     * Update an existing todo
     */
    public TodoResponse update(Long id, TodoRequest request) {
        validateTodoRequest(request);
        
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException("Todo not found with id: " + id));
        
        // Update content if provided
        if (request.title() != null || request.description() != null) {
            String newTitle = request.title() != null ? request.title() : todo.getTitle();
            String newDescription = request.description() != null ? request.description() : todo.getDescription();
            todo.updateContent(newTitle, newDescription);
        }
        
        // Update priority if provided
        if (request.priority() != null) {
            todo.updatePriority(request.priority());
        }
        
        // Update completion status if provided
        if (request.done() != null) {
            if (request.done()) {
                todo.markAsDone();
            } else {
                todo.markAsUndone();
            }
        }
        
        Todo savedTodo = todoRepository.save(todo);
        return TodoResponse.from(savedTodo);
    }
    
    /**
     * Delete a todo
     */
    public void delete(Long id) {
        if (!todoRepository.existsById(id)) {
            throw new TodoNotFoundException("Todo not found with id: " + id);
        }
        todoRepository.deleteById(id);
    }
    
    /**
     * Toggle todo completion status
     */
    public TodoResponse toggleCompletion(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException("Todo not found with id: " + id));
        
        if (todo.isDone()) {
            todo.markAsUndone();
        } else {
            todo.markAsDone();
        }
        
        Todo savedTodo = todoRepository.save(todo);
        return TodoResponse.from(savedTodo);
    }
    
    /**
     * Find todos by priority
     */
    @Transactional(readOnly = true)
    public List<TodoResponse> findByPriority(Priority priority) {
        return todoRepository.findByPriority(priority)
                .stream()
                .map(TodoResponse::from)
                .toList();
    }
    
    /**
     * Get todo statistics including priority breakdown
     */
    @Transactional(readOnly = true)
    public TodoStatistics getStatistics() {
        long total = todoRepository.count();
        long completed = todoRepository.countByDone(true);
        long pending = total - completed;
        
        return new TodoStatistics(total, completed, pending);
    }
    
    private void validateTodoRequest(TodoRequest request) {
        if (request.title() != null && request.title().trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be empty");
        }
    }
    
    /**
     * Statistics record for todo counts
     */
    public record TodoStatistics(long total, long completed, long pending) {}
}