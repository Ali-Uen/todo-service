package com.aliunal.todoservice.infrastructure.persistence;

import com.aliunal.todoservice.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * JPA Repository Implementation for User
 * Infrastructure layer - Spring Data JPA specific implementation
 */
@Repository
public interface JpaUserRepository extends JpaRepository<User, Long> {
    
    /**
     * Find user by email (unique identifier)
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Find user by provider and provider ID (for OAuth)
     */
    Optional<User> findByAuthProviderAndProviderId(User.AuthProvider authProvider, String providerId);
    
    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);
}