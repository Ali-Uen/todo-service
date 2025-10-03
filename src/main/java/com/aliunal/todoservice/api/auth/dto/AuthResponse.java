package com.aliunal.todoservice.api.auth.dto;

import com.aliunal.todoservice.domain.user.entity.User;
import java.time.Instant;

/**
 * Authentication Response DTO
 * Data Transfer Object for authentication responses
 */
public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        Long expiresIn,
        UserInfo user
) {
    
    /**
     * User information nested DTO
     */
    public record UserInfo(
            Long id,
            String email,
            String username,
            User.AuthProvider authProvider,
            Instant createdAt
    ) {
        
        /**
         * Factory method to create UserInfo from User entity
         */
        public static UserInfo from(User user) {
            return new UserInfo(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getAuthProvider(),
                user.getCreatedAt()
            );
        }
    }
    
    /**
     * Factory method to create AuthResponse
     */
    public static AuthResponse create(String accessToken, String refreshToken, 
                                    Long expiresIn, User user) {
        return new AuthResponse(
            accessToken,
            refreshToken,
            "Bearer",
            expiresIn,
            UserInfo.from(user)
        );
    }
}