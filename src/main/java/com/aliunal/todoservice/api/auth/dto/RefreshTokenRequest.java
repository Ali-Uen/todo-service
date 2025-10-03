package com.aliunal.todoservice.api.auth.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Refresh Token Request DTO
 * Data Transfer Object for token refresh
 */
public record RefreshTokenRequest(
        
        @NotBlank(message = "Refresh token is required")
        String refreshToken
) {}