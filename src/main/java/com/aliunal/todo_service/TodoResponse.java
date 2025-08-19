package com.aliunal.todo_service.dto;
import java.time.Instant;

public record TodoResponse(Long id, String title, String description, boolean done, Instant createdAt) {}
