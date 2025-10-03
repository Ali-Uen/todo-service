package com.aliunal.todoservice.domain.todo.entity;

import jakarta.persistence.*;
import java.time.Instant;
import com.aliunal.todoservice.shared.enums.Priority;

/**
 * Todo Entity - Domain Object
 * Represents a Todo item in the domain model
 */
@Entity
@Table(name = "todos")
public class Todo {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private boolean done = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;

    @Column(name = "user_id", nullable = true)  // Temporarily nullable for migration
    private Long userId;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    // Default constructor for JPA
    protected Todo() {}

    // Constructor for creating new todos
    public Todo(String title, String description, Long userId) {
        this(title, description, Priority.MEDIUM, userId);
    }

    // Constructor with priority
    public Todo(String title, String description, Priority priority, Long userId) {
        this.title = title;
        this.description = description;
        this.priority = priority != null ? priority : Priority.MEDIUM;
        this.userId = userId;
        this.done = false;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    // Business methods
    public void markAsDone() {
        this.done = true;
        this.updatedAt = Instant.now();
    }

    public void markAsUndone() {
        this.done = false;
        this.updatedAt = Instant.now();
    }

    public void updateContent(String title, String description) {
        this.title = title;
        this.description = description;
        this.updatedAt = Instant.now();
    }

    public void updateContent(String title, String description, Priority priority) {
        this.title = title;
        this.description = description;
        this.priority = priority != null ? priority : this.priority;
        this.updatedAt = Instant.now();
    }

    public void updatePriority(Priority priority) {
        this.priority = priority != null ? priority : Priority.MEDIUM;
        this.updatedAt = Instant.now();
    }

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

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public Priority getPriority() {
        return priority;
    }

    public Long getUserId() {
        return userId;
    }

    // Setters (package-private for JPA)
    void setId(Long id) {
        this.id = id;
    }

    void setTitle(String title) {
        this.title = title;
    }

    void setDescription(String description) {
        this.description = description;
    }

    void setDone(boolean done) {
        this.done = done;
    }

    void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    void setPriority(Priority priority) {
        this.priority = priority;
    }

    void setUserId(Long userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "Todo{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", done=" + done +
                ", userId=" + userId +
                ", createdAt=" + createdAt +
                '}';
    }
}