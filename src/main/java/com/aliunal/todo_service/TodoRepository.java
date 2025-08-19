package com.aliunal.todo_service.repository;

import com.aliunal.todo_service.domain.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Long> {}
