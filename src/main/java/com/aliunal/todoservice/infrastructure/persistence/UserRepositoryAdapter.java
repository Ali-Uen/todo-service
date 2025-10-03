package com.aliunal.todoservice.infrastructure.persistence;

import com.aliunal.todoservice.domain.user.entity.User;
import com.aliunal.todoservice.domain.user.repository.UserRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * User Repository Adapter
 * Adapts Spring Data JPA repository to domain repository interface
 */
@Component
public class UserRepositoryAdapter implements UserRepository {
    
    private final JpaUserRepository jpaRepository;
    
    public UserRepositoryAdapter(JpaUserRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    public User save(User user) {
        return jpaRepository.save(user);
    }
    
    @Override
    public Optional<User> findById(Long id) {
        return jpaRepository.findById(id);
    }
    
    @Override
    public Optional<User> findByEmail(String email) {
        return jpaRepository.findByEmail(email);
    }
    
    @Override
    public Optional<User> findByAuthProviderAndProviderId(User.AuthProvider authProvider, String providerId) {
        return jpaRepository.findByAuthProviderAndProviderId(authProvider, providerId);
    }
    
    @Override
    public boolean existsByEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }
    
    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
    
    @Override
    public long count() {
        return jpaRepository.count();
    }
}