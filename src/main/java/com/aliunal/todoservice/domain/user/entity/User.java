package com.aliunal.todoservice.domain.user.entity;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * User Entity - Domain Object
 * Represents a User in the domain model with support for multiple authentication providers
 */
@Entity
@Table(name = "users")
public class User {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(length = 100)
    private String username;

    @Column(name = "password_hash", length = 255)
    private String passwordHash; // null for OAuth users

    @Enumerated(EnumType.STRING)
    @Column(name = "auth_provider", nullable = false, length = 20)
    private AuthProvider authProvider;

    @Column(name = "provider_id", length = 255)
    private String providerId; // Google user ID, etc.

    @Column(nullable = false)
    private boolean enabled = true;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    /**
     * Authentication Provider enum
     */
    public enum AuthProvider {
        EMAIL("Email"),
        GOOGLE("Google");
        
        private final String displayName;
        
        AuthProvider(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }

    // Default constructor for JPA
    protected User() {}

    // Constructor for email registration
    public User(String email, String username, String passwordHash) {
        this.email = email;
        this.username = username;
        this.passwordHash = passwordHash;
        this.authProvider = AuthProvider.EMAIL;
        this.enabled = true;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    // Constructor for OAuth registration
    public User(String email, String username, AuthProvider authProvider, String providerId) {
        this.email = email;
        this.username = username;
        this.authProvider = authProvider;
        this.providerId = providerId;
        this.passwordHash = null; // OAuth users don't have passwords
        this.enabled = true;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    // Business methods
    public void updateProfile(String username) {
        this.username = username;
        this.updatedAt = Instant.now();
    }

    public void updatePassword(String newPasswordHash) {
        if (this.authProvider != AuthProvider.EMAIL) {
            throw new IllegalStateException("Cannot update password for OAuth users");
        }
        this.passwordHash = newPasswordHash;
        this.updatedAt = Instant.now();
    }

    public void disable() {
        this.enabled = false;
        this.updatedAt = Instant.now();
    }

    public void enable() {
        this.enabled = true;
        this.updatedAt = Instant.now();
    }

    public boolean isOAuthUser() {
        return this.authProvider != AuthProvider.EMAIL;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public AuthProvider getAuthProvider() {
        return authProvider;
    }

    public String getProviderId() {
        return providerId;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    // Package-private setters for JPA
    void setId(Long id) {
        this.id = id;
    }

    void setEmail(String email) {
        this.email = email;
    }

    void setUsername(String username) {
        this.username = username;
    }

    void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    void setAuthProvider(AuthProvider authProvider) {
        this.authProvider = authProvider;
    }

    void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", username='" + username + '\'' +
                ", authProvider=" + authProvider +
                ", enabled=" + enabled +
                ", createdAt=" + createdAt +
                '}';
    }
}