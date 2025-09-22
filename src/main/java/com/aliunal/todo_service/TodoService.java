package com.aliunal.todo_service;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TodoService {
  private final TodoRepository repo;
  public TodoService(TodoRepository repo){ this.repo = repo; }

  public List<TodoResponse> findAll(){
    return repo.findAll().stream()
      .map(t -> new TodoResponse(t.getId(), t.getTitle(), t.getDescription(), t.isDone(), t.getCreatedAt()))
      .toList();
  }

  public TodoResponse findById(Long id){
    var t = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Todo not found: " + id));
    return new TodoResponse(t.getId(), t.getTitle(), t.getDescription(), t.isDone(), t.getCreatedAt());
  }

  public TodoResponse create(TodoRequest r){
    var t = new Todo();
    t.setTitle(r.title()); t.setDescription(r.description());
    t.setDone(r.done()!=null && r.done());
    var s = repo.save(t);
    return new TodoResponse(s.getId(), s.getTitle(), s.getDescription(), s.isDone(), s.getCreatedAt());
  }

  public TodoResponse update(Long id, TodoRequest r){
    var t = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Todo not found: " + id));
    if(r.title()!=null) t.setTitle(r.title());
    if(r.description()!=null) t.setDescription(r.description());
    if(r.done()!=null) t.setDone(r.done());
    var s = repo.save(t);
    return new TodoResponse(s.getId(), s.getTitle(), s.getDescription(), s.isDone(), s.getCreatedAt());
  }

  public void delete(Long id){ repo.deleteById(id); }
}
