package com.aliunal.todo_service.dto;
import jakarta.validation.constraints.NotBlank;

public record TodoRequest(@NotBlank String title, String description, Boolean done) {}
