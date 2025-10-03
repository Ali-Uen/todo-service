package com.aliunal.todoservice.domain.user.service;

import com.aliunal.todoservice.domain.user.entity.User;
import com.aliunal.todoservice.domain.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * User Domain Service
 * Contains business logic for user operations
 */
@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    /**
     * Register new user with email and password
     */
    public User registerEmailUser(String email, String username, String rawPassword) {
        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("User with email " + email + " already exists");
        }
        
        String hashedPassword = passwordEncoder.encode(rawPassword);
        User user = new User(email, username, hashedPassword);
        
        return userRepository.save(user);
    }
    
    /**
     * Register or update OAuth user
     */
    public User registerOrUpdateOAuthUser(String email, String username, 
                                         User.AuthProvider provider, String providerId) {
        
        // Check if user exists by provider and providerId
        Optional<User> existingByProvider = userRepository
            .findByAuthProviderAndProviderId(provider, providerId);
            
        if (existingByProvider.isPresent()) {
            // Update existing OAuth user
            User user = existingByProvider.get();
            user.updateProfile(username);
            return userRepository.save(user);
        }
        
        // Check if user exists by email (different provider)
        Optional<User> existingByEmail = userRepository.findByEmail(email);
        if (existingByEmail.isPresent()) {
            throw new UserAlreadyExistsException(
                "User with email " + email + " already exists with different provider");
        }
        
        // Create new OAuth user
        User user = new User(email, username, provider, providerId);
        return userRepository.save(user);
    }
    
    /**
     * Find user by email
     */
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    /**
     * Find user by ID
     */
    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    /**
     * Authenticate email user
     */
    @Transactional(readOnly = true)
    public Optional<User> authenticateEmailUser(String email, String rawPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }
        
        User user = userOpt.get();
        
        // Check if it's an email user
        if (user.getAuthProvider() != User.AuthProvider.EMAIL) {
            return Optional.empty();
        }
        
        // Check if password matches
        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            return Optional.empty();
        }
        
        // Check if user is enabled
        if (!user.isEnabled()) {
            return Optional.empty();
        }
        
        return Optional.of(user);
    }
    
    /**
     * Update user password
     */
    public void updatePassword(Long userId, String newRawPassword) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
            
        String hashedPassword = passwordEncoder.encode(newRawPassword);
        user.updatePassword(hashedPassword);
        
        userRepository.save(user);
    }
    
    /**
     * Update user profile
     */
    public User updateProfile(Long userId, String username) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
            
        user.updateProfile(username);
        return userRepository.save(user);
    }
    
    /**
     * Disable user
     */
    public void disableUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
            
        user.disable();
        userRepository.save(user);
    }
    
    /**
     * Enable user
     */
    public void enableUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
            
        user.enable();
        userRepository.save(user);
    }
}