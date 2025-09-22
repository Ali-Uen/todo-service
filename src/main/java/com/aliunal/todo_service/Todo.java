package com.aliunal.todo_service;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
public class Todo {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable=false)
  private String title;

  private String description;

  @Column(nullable=false)
  private boolean done = false;

  @Column(nullable=false, updatable=false)
  private Instant createdAt = Instant.now();

  // Default constructor
  public Todo() {}

  // Getters
  public Long getId() {
    return id;
  }

  public String getTitle() {
    return title;
  }

  public String getDescription() {
    return description;
  }

  public boolean isDone() {
    return done;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  // Setters
  public void setId(Long id) {
    this.id = id;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public void setDone(boolean done) {
    this.done = done;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }
}
