package com.aliunal.todoservice.api.rest;

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

/**
 * Integration tests for TodoController
 * Tests the complete API flow with real database
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(OrderAnnotation.class)
class TodoControllerIT {

    @Autowired 
    MockMvc mockMvc;
    
    @Autowired 
    ObjectMapper objectMapper;

    static Long createdTodoId;

    @Test 
    @Order(1)
    @DisplayName("POST /api/v1/todos - Create new todo")
    void createTodo_ShouldReturn201_AndReturnCreatedTodo() throws Exception {
        String requestJson = """
            {
              "title": "Learn Spring Boot",
              "description": "Complete modular monolith tutorial",
              "completed": false
            }
            """;

        MvcResult result = mockMvc.perform(
                post("/api/v1/todos")
                        .contentType(APPLICATION_JSON)
                        .content(requestJson)
        )
        .andExpect(status().isCreated())
        .andExpect(content().contentTypeCompatibleWith(APPLICATION_JSON))
        .andExpect(jsonPath("$.id").exists())
        .andExpect(jsonPath("$.title").value("Learn Spring Boot"))
        .andExpect(jsonPath("$.description").value("Complete modular monolith tutorial"))
        .andExpect(jsonPath("$.completed").value(false))
        .andExpect(jsonPath("$.createdAt").exists())
        .andExpect(jsonPath("$.updatedAt").exists())
        .andReturn();

        JsonNode responseBody = objectMapper.readTree(result.getResponse().getContentAsString());
        createdTodoId = responseBody.get("id").asLong();
        assertThat(createdTodoId).isNotNull().isPositive();
    }

    @Test 
    @Order(2)
    @DisplayName("GET /api/v1/todos - Get all todos")
    void getAllTodos_ShouldReturnOk_AndContainCreatedTodo() throws Exception {
        mockMvc.perform(get("/api/v1/todos"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].title").exists());
    }

    @Test 
    @Order(3)
    @DisplayName("GET /api/v1/todos/{id} - Get todo by ID")
    void getTodoById_ShouldReturnOk_AndReturnCorrectTodo() throws Exception {
        mockMvc.perform(get("/api/v1/todos/{id}", createdTodoId))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(createdTodoId))
                .andExpect(jsonPath("$.title").value("Learn Spring Boot"));
    }

    @Test 
    @Order(4)
    @DisplayName("PUT /api/v1/todos/{id} - Update todo")
    void updateTodo_ShouldReturnOk_AndReturnUpdatedTodo() throws Exception {
        String updateJson = """
            {
              "title": "Learn Spring Boot",
              "description": "Complete modular monolith tutorial with tests",
              "completed": true
            }
            """;

        MvcResult result = mockMvc.perform(
                put("/api/v1/todos/{id}", createdTodoId)
                        .contentType(APPLICATION_JSON)
                        .content(updateJson)
        )
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(APPLICATION_JSON))
        .andExpect(jsonPath("$.id").value(createdTodoId))
        .andExpect(jsonPath("$.completed").value(true))
        .andExpect(jsonPath("$.description").value("Complete modular monolith tutorial with tests"))
        .andReturn();

        JsonNode updatedTodo = objectMapper.readTree(result.getResponse().getContentAsString());
        assertThat(updatedTodo.get("completed").asBoolean()).isTrue();
        assertThat(updatedTodo.get("description").asText()).contains("with tests");
    }

    @Test 
    @Order(5)
    @DisplayName("PATCH /api/v1/todos/{id}/toggle - Toggle todo completion")
    void toggleTodo_ShouldReturnOk_AndToggleStatus() throws Exception {
        // First, toggle to incomplete
        mockMvc.perform(patch("/api/v1/todos/{id}/toggle", createdTodoId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(false));

        // Then toggle back to complete
        mockMvc.perform(patch("/api/v1/todos/{id}/toggle", createdTodoId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(true));
    }

    @Test 
    @Order(6)
    @DisplayName("GET /api/v1/todos/statistics - Get statistics")
    void getStatistics_ShouldReturnOk_AndCorrectCounts() throws Exception {
        mockMvc.perform(get("/api/v1/todos/statistics"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(APPLICATION_JSON))
                .andExpect(jsonPath("$.total").exists())
                .andExpect(jsonPath("$.completed").exists())
                .andExpect(jsonPath("$.pending").exists());
    }

    @Test 
    @Order(7)
    @DisplayName("DELETE /api/v1/todos/{id} - Delete todo")
    void deleteTodo_ShouldReturnNoContent() throws Exception {
        mockMvc.perform(delete("/api/v1/todos/{id}", createdTodoId))
                .andExpect(status().isNoContent());

        // Verify todo is deleted
        mockMvc.perform(get("/api/v1/todos/{id}", createdTodoId))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/v1/todos - Validation should work")
    void createTodo_WithInvalidData_ShouldReturn400() throws Exception {
        String invalidJson = """
            { 
              "title": "", 
              "description": "x", 
              "completed": false 
            }
            """;
        
        mockMvc.perform(post("/api/v1/todos")
                .contentType(APPLICATION_JSON)
                .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.fieldErrors").exists());
    }

    @Test
    @DisplayName("GET /api/v1/todos/{id} - Non-existent ID should return 404")
    void getTodoById_WithNonExistentId_ShouldReturn404() throws Exception {
        mockMvc.perform(get("/api/v1/todos/{id}", 99999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    @DisplayName("GET /api/v1/todos/health - Health check should work")
    void healthCheck_ShouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/v1/todos/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("Todo API is healthy"));
    }
}