package com.aliunal.todo_service.service;

import com.aliunal.todo_service.Todo;
import com.aliunal.todo_service.TodoRequest;
import com.aliunal.todo_service.TodoResponse;
import com.aliunal.todo_service.TodoRepository;
import com.aliunal.todo_service.TodoService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TodoServiceTest {

    @Mock
    private TodoRepository repository;

    @InjectMocks
    private TodoService service;

    @Test
    void create_savesEntity_andReturnsResponse() {
        // given
        TodoRequest req = new TodoRequest("Shopping list", "Milk, bread, eggs", false);

        when(repository.save(any(Todo.class))).thenAnswer(inv -> {
            Todo t = inv.getArgument(0);
            t.setId(1L);
            return t;
        });

        // when
        TodoResponse res = service.create(req);

        // then (record accessors: id(), title(), description(), done(), createdAt())
        assertThat(res.id()).isEqualTo(1L);
        assertThat(res.title()).isEqualTo("Shopping list");
        assertThat(res.description()).isEqualTo("Milk, bread, eggs");
        assertThat(res.done()).isFalse();

        ArgumentCaptor<Todo> captor = ArgumentCaptor.forClass(Todo.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().getTitle()).isEqualTo("Shopping list");
        assertThat(captor.getValue().isDone()).isFalse();
    }

    @Test
    void findAll_returnsMappedResponses() {
        when(repository.findAll()).thenReturn(List.of(
                entity(1L, "A", "a", false),
                entity(2L, "B", "b", true)
        ));

        List<TodoResponse> all = service.findAll();

        assertThat(all).hasSize(2);
        assertThat(all.get(0).id()).isEqualTo(1L);
        assertThat(all.get(1).done()).isTrue();
        verify(repository).findAll();
    }

    @Test
    void update_updatesAndReturnsResponse() {
        Long id = 7L;
        when(repository.findById(id)).thenReturn(Optional.of(entity(id, "Old", "old", false)));
        when(repository.save(any(Todo.class))).thenAnswer(inv -> inv.getArgument(0));

        TodoRequest req = new TodoRequest("New", "new", true);

        TodoResponse res = service.update(id, req);

        assertThat(res.id()).isEqualTo(id);
        assertThat(res.title()).isEqualTo("New");
        assertThat(res.done()).isTrue();
        verify(repository).save(any(Todo.class));
    }

    @Test
    void update_whenNotFound_throws() {
        when(repository.findById(999L)).thenReturn(Optional.empty());
        TodoRequest req = new TodoRequest("X", "Y", false);
        // Your service throws IllegalArgumentException on not found:
        assertThrows(IllegalArgumentException.class, () -> service.update(999L, req));
    }

    @Test
    void delete_delegatesToRepository() {
        service.delete(5L);
        verify(repository).deleteById(5L);
    }

    private static Todo entity(Long id, String title, String desc, boolean done) {
        Todo t = new Todo();
        t.setId(id);
        t.setTitle(title);
        t.setDescription(desc);
        t.setDone(done);
        return t;
    }
}