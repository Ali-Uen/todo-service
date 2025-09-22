package com.aliunal.todo_service.repository;

import com.aliunal.todo_service.Todo;
import com.aliunal.todo_service.TodoRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class TodoRepositoryTest {

    @Autowired
    private TodoRepository repository;

    @Test
    void save_and_findAll() {
        Todo t = new Todo();
        t.setTitle("T1");
        t.setDescription("D1");
        t.setDone(false);

        Todo saved = repository.save(t);
        assertThat(saved.getId()).isNotNull();

        assertThat(repository.findAll()).hasSize(1);
    }
}
