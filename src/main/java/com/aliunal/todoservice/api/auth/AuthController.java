package com.aliunal.todoservice.api.auth;

import com.aliunal.todoservice.api.auth.dto.*;
import com.aliunal.todoservice.domain.user.entity.User;
import com.aliunal.todoservice.domain.user.service.UserAlreadyExistsException;
import com.aliunal.todoservice.domain.user.service.UserService;
import com.aliunal.todoservice.infrastructure.security.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * Authentication REST Controller - API Layer
 * Handles HTTP requests for authentication operations
 */
@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@Tag(name = "Authentication", description = "User authentication and authorization API")
public class AuthController {
    
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    
    public AuthController(UserService userService, JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
    }
    
    /**
     * Register new user with email and password
     */
    @Operation(summary = "Register new user", description = "Register a new user with email and password")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "User registered successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data or user already exists"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.registerEmailUser(
                request.email(), 
                request.username(), 
                request.password()
            );
            
            // Generate tokens
            String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId(), user.getEmail(), user.getUsername());
            String refreshToken = jwtTokenProvider.generateRefreshToken(
                user.getId(), user.getEmail());
            
            AuthResponse response = AuthResponse.create(
                accessToken, refreshToken, 900000L, user); // 15 minutes
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (UserAlreadyExistsException e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("USER_ALREADY_EXISTS", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("REGISTRATION_FAILED", "Registration failed"));
        }
    }
    
    /**
     * Login user with email and password
     */
    @Operation(summary = "Login user", description = "Authenticate user with email and password")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            Optional<User> userOpt = userService.authenticateEmailUser(
                request.email(), request.password());
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("INVALID_CREDENTIALS", "Invalid email or password"));
            }
            
            User user = userOpt.get();
            
            // Generate tokens
            String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId(), user.getEmail(), user.getUsername());
            String refreshToken = jwtTokenProvider.generateRefreshToken(
                user.getId(), user.getEmail());
            
            AuthResponse response = AuthResponse.create(
                accessToken, refreshToken, 900000L, user); // 15 minutes
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("LOGIN_FAILED", "Login failed"));
        }
    }
    
    /**
     * Refresh access token using refresh token
     */
    @Operation(summary = "Refresh token", description = "Get new access token using refresh token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token refreshed successfully"),
        @ApiResponse(responseCode = "401", description = "Invalid refresh token"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        try {
            String refreshToken = request.refreshToken();
            
            if (!jwtTokenProvider.validateRefreshToken(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("INVALID_REFRESH_TOKEN", "Invalid or expired refresh token"));
            }
            
            Long userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
            
            Optional<User> userOpt = userService.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("USER_NOT_FOUND", "User not found"));
            }
            
            User user = userOpt.get();
            
            // Generate new tokens
            String newAccessToken = jwtTokenProvider.generateAccessToken(
                user.getId(), user.getEmail(), user.getUsername());
            String newRefreshToken = jwtTokenProvider.generateRefreshToken(
                user.getId(), user.getEmail());
            
            AuthResponse response = AuthResponse.create(
                newAccessToken, newRefreshToken, 900000L, user); // 15 minutes
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("REFRESH_FAILED", "Token refresh failed"));
        }
    }
    
    /**
     * Get current user information
     */
    @Operation(summary = "Get current user", description = "Get current authenticated user information")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User information retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Not authenticated"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("currentUserId");
            
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("NOT_AUTHENTICATED", "User not authenticated"));
            }
            
            Optional<User> userOpt = userService.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("USER_NOT_FOUND", "User not found"));
            }
            
            User user = userOpt.get();
            AuthResponse.UserInfo userInfo = AuthResponse.UserInfo.from(user);
            
            return ResponseEntity.ok(userInfo);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("USER_INFO_FAILED", "Failed to get user information"));
        }
    }
    
    /**
     * Logout user (client-side token removal)
     */
    @Operation(summary = "Logout user", description = "Logout user (client should remove tokens)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Logout successful")
    })
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // JWT tokens are stateless, so logout is handled on client-side
        // by removing the tokens from storage
        return ResponseEntity.ok(new MessageResponse("Logout successful"));
    }
    
    /**
     * Health check endpoint
     */
    @Operation(summary = "Health check", description = "Check if the authentication API is healthy and running")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "API is healthy")
    })
    @GetMapping("/health")
    public ResponseEntity<MessageResponse> health() {
        return ResponseEntity.ok(new MessageResponse("Authentication API is healthy"));
    }
    
    /**
     * Simple error response record
     */
    public record ErrorResponse(String code, String message) {}
    
    /**
     * Simple message response record
     */
    public record MessageResponse(String message) {}
}