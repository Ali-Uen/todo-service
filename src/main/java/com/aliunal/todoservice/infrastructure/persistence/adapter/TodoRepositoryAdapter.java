package com.aliunal.todoservice.infrastructure.persistence.adapter;

import com.aliunal.todoservice.domain.todo.entity.Todo;
import com.aliunal.todoservice.domain.todo.repository.TodoRepository;
import com.aliunal.todoservice.infrastructure.persistence.jpa.repository.JpaTodoRepository;
import com.aliunal.todoservice.shared.enums.Priority;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class TodoRepositoryAdapter implements TodoRepository {
    
    private final JpaTodoRepository jpaTodoRepository;
    
    public TodoRepositoryAdapter(JpaTodoRepository jpaTodoRepository) {
        this.jpaTodoRepository = jpaTodoRepository;
    }
    
    @Override
    public Todo save(Todo todo) {
        return jpaTodoRepository.save(todo);
    }
    
    @Override
    public List<Todo> findAll() {
        return jpaTodoRepository.findAll();
    }
    
    @Override
    public List<Todo> findByUserId(Long userId) {
        return jpaTodoRepository.findByUserId(userId);
    }
    
    @Override
    public List<Todo> findByDone(boolean done) {
        return jpaTodoRepository.findByDone(done);
    }
    
    @Override
    public List<Todo> findByUserIdAndDone(Long userId, boolean done) {
        return jpaTodoRepository.findByUserIdAndDone(userId, done);
    }
    
    @Override
    public Optional<Todo> findById(Long id) {
        return jpaTodoRepository.findById(id);
    }
    
    @Override  
    public Optional<Todo> findByIdAndUserId(Long id, Long userId) {
        return jpaTodoRepository.findByIdAndUserId(id, userId);
    }
    
    @Override
    public List<Todo> findByTitleContainingIgnoreCase(String title) {
        return jpaTodoRepository.findByTitleContainingIgnoreCase(title);
    }
    
    @Override
    public List<Todo> findByPriority(Priority priority) {
        return jpaTodoRepository.findByPriority(priority);
    }
    
    @Override
    public boolean existsById(Long id) {
        return jpaTodoRepository.existsById(id);
    }
    
    @Override
    public void deleteById(Long id) {
        jpaTodoRepository.deleteById(id);
    }
    
    @Override
    public long count() {
        return jpaTodoRepository.count();
    }
    
    @Override
    public long countByDone(boolean done) {
        return jpaTodoRepository.countByDone(done);
    }
}