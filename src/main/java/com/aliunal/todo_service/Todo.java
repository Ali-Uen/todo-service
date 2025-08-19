package com.aliunal.todo_service.domain;

import jakarta.persistence.*;
import lombok.Getter; import lombok.NoArgsConstructor; import lombok.Setter;
import java.time.Instant;

@Entity @Getter @Setter @NoArgsConstructor
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
}
