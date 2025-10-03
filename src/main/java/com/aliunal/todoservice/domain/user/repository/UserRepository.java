package com.aliunal.todoservice.domain.user.repository;

import com.aliunal.todoservice.domain.user.entity.User;
import java.util.Optional;

/**
 * User Repository Interface - Domain Contract
 * Defines operations for User persistence without infrastructure dependencies
 */
public interface UserRepository {
    
    /**
     * Save a user entity
     */
    User save(User user);
    
    /**
     * Find user by ID
     */
    Optional<User> findById(Long id);
    
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
    
    /**
     * Delete user by ID
     */
    void deleteById(Long id);
    
    /**
     * Count total users
     */
    long count();
}