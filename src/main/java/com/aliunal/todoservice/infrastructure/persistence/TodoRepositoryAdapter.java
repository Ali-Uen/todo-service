package com.aliunal.todoservice.infrastructure.persistence;

import com.aliunal.todoservice.domain.todo.entity.Todo;
import com.aliunal.todoservice.domain.todo.repository.TodoRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Todo Repository Adapter
 * Adapts Spring Data JPA repository to domain repository interface
 */
@Component
public class TodoRepositoryAdapter implements TodoRepository {
    
    private final JpaTodoRepository jpaRepository;
    
    public TodoRepositoryAdapter(JpaTodoRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    public Todo save(Todo todo) {
        return jpaRepository.save(todo);
    }
    
    @Override
    public Optional<Todo> findById(Long id) {
        return jpaRepository.findById(id);
    }
    
    @Override
    public List<Todo> findAll() {
        return jpaRepository.findAllOrderByCreatedAtDesc();
    }
    
    @Override
    public List<Todo> findByDone(boolean done) {
        return jpaRepository.findByDone(done);
    }
    
    @Override
    public List<Todo> findByTitleContainingIgnoreCase(String title) {
        return jpaRepository.findByTitleContainingIgnoreCase(title);
    }
    
    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
    
    @Override
    public boolean existsById(Long id) {
        return jpaRepository.existsById(id);
    }
    
    @Override
    public long count() {
        return jpaRepository.count();
    }
    
    @Override
    public long countByDone(boolean done) {
        return jpaRepository.countByDone(done);
    }
}