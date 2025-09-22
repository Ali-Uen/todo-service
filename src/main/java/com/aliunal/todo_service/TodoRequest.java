package com.aliunal.todo_service;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonProperty;

public record TodoRequest(
  @NotBlank String title, String description,
  @JsonProperty("completed") Boolean done) {}