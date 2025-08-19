package com.aliunal.todo_service.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(OrderAnnotation.class)
class TodoControllerIT {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper om;

    static Long createdId;

    @Test @Order(1)
    void create_returns201_or200_andBody() throws Exception {
        String json = """
            {
              "title": "Shopping list",
              "description": "Milk, bread, eggs",
              "completed": false
            }
            """;

        MvcResult res = mockMvc.perform(
                post("/api/v1/todos")
                        .contentType(APPLICATION_JSON)
                        .content(json)
        ).andReturn();

        assertThat(res.getResponse().getStatus()).isIn(200, 201);

        JsonNode body = om.readTree(res.getResponse().getContentAsString());
        createdId = body.get("id").asLong();
        assertThat(createdId).isNotNull();
    }

    @Test @Order(2)
    void list_returnsOk_andContainsItem() throws Exception {
        mockMvc.perform(get("/api/v1/todos"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").exists());
    }

    @Test @Order(3)
    void update_returnsOk_andUpdatedFields() throws Exception {
        String json = """
            {
              "title": "Shopping list",
              "description": "Milk, bread, eggs, butter",
              "completed": true
            }
            """;

        MvcResult res = mockMvc.perform(
                put("/api/v1/todos/{id}", createdId)
                        .contentType(APPLICATION_JSON)
                        .content(json)
        ).andExpect(status().isOk()).andReturn();

        JsonNode updated = om.readTree(res.getResponse().getContentAsString());
        assertThat(updated.get("completed").asBoolean()).isTrue();
        assertThat(updated.get("description").asText()).contains("butter");
    }

    @Test @Order(4)
    void delete_returns204_or200() throws Exception {
        MvcResult res = mockMvc.perform(delete("/api/v1/todos/{id}", createdId))
                .andReturn();
        assertThat(res.getResponse().getStatus()).isIn(200, 204);
    }

    // Enable only if you have validation on title
    // @Test
    void post_withEmptyTitle_returns400() throws Exception {
        String invalid = """
            { "title": " ", "description": "x", "completed": false }
            """;
        mockMvc.perform(post("/api/v1/todos")
                .contentType(APPLICATION_JSON)
                .content(invalid))
                .andExpect(status().isBadRequest());
    }
}