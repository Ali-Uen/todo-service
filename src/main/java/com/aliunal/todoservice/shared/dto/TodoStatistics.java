package com.aliunal.todoservice.shared.dto;

/**
 * Todo Statistics DTO - API Layer
 * Data Transfer Object for todo statistics
 */
public record TodoStatistics(
        long total,
        long completed,
        long pending
) {
}