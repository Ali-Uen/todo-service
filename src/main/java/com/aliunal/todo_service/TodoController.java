package com.aliunal.todo_service.controller;

import com.aliunal.todo_service.dto.*;
import com.aliunal.todo_service.service.TodoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/todos")
public class TodoController {
  private final TodoService service;
  public TodoController(TodoService service){ this.service = service; }

  @GetMapping public List<TodoResponse> all(){ return service.findAll(); }
  @GetMapping("/{id}") public TodoResponse one(@PathVariable Long id){ return service.findById(id); }

  @PostMapping
  public ResponseEntity<TodoResponse> create(@RequestBody TodoRequest req){
    var saved = service.create(req);
    return ResponseEntity.created(URI.create("/api/v1/todos/" + saved.id())).body(saved);
  }

  @PutMapping("/{id}") public TodoResponse update(@PathVariable Long id, @RequestBody TodoRequest req){
    return service.update(id, req);
  }

  @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id){
    service.delete(id); return ResponseEntity.noContent().build();
  }
}
