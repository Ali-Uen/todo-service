package com.aliunal.todo_service.dto;
import java.time.Instant;
import com.fasterxml.jackson.annotation.JsonProperty;

public record TodoResponse(
  Long id, String title, String description,
  @JsonProperty("completed") boolean done, Instant createdAt) {}