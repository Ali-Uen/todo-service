package com.aliunal.todoservice.infrastructure.security;

import com.aliunal.todoservice.domain.user.entity.User;
import com.aliunal.todoservice.domain.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

/**
 * OAuth2 Success Handler
 * Handles successful OAuth2 authentication and redirects with JWT token
 */
@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final String frontendUrl;
    
    public OAuth2SuccessHandler(@Lazy UserService userService,
                               JwtTokenProvider jwtTokenProvider,
                               @Value("${app.frontend.url:http://localhost:3000}") String frontendUrl) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.frontendUrl = frontendUrl;
    }
    
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, 
                                      HttpServletResponse response,
                                      Authentication authentication) throws IOException {
        
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        try {
            // Extract user information from OAuth2 provider
            String email = oAuth2User.getAttribute("email");
            String name = oAuth2User.getAttribute("name");
            String providerId = oAuth2User.getAttribute("sub"); // Google user ID
            
            // Register or update user
            User user = userService.registerOrUpdateOAuthUser(
                email, name, User.AuthProvider.GOOGLE, providerId);
            
            // Generate JWT tokens
            String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId(), user.getEmail(), user.getUsername());
            String refreshToken = jwtTokenProvider.generateRefreshToken(
                user.getId(), user.getEmail());
            
            // Redirect to frontend with tokens
            String redirectUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/auth/callback")
                .queryParam("accessToken", accessToken)
                .queryParam("refreshToken", refreshToken)
                .queryParam("user", user.getUsername())
                .build().toUriString();
            
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
            
        } catch (Exception e) {
            logger.error("OAuth2 authentication success handling failed", e);
            
            // Redirect to frontend with error
            String errorRedirectUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/login")
                .queryParam("error", "oauth_processing_failed")
                .build().toUriString();
            
            getRedirectStrategy().sendRedirect(request, response, errorRedirectUrl);
        }
    }
}