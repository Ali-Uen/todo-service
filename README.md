# Todo Service

Java 21 • Spring Boot 3.5 • REST API • JPA/H2 • JUnit • Swagger/OpenAPI

A simple microservice for managing **Todos**.\
It serves as a **demo project** for REST APIs, JPA/Hibernate, DTOs,
validation, Swagger documentation, and H2 database usage.

------------------------------------------------------------------------

## Features

-   **REST API** with CRUD operations (`/api/v1/todos`)
-   **Spring Data JPA** for database access
-   **H2** (in-memory or file-based) as database
-   **DTOs** (`TodoRequest`, `TodoResponse`) for clear separation
-   **Swagger UI** for interactive API exploration
-   **JUnit tests** for service and controller layer
-   **Dockerfile** for containerization


## How to Run

### 1. Local with Maven

``` bash
.\mvnw spring-boot:run
```

## API Docs
- Swagger UI: http://localhost:8080/swagger-ui/index.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs


### 3. With Docker

``` bash
docker build -t todo-service .
docker run -p 8080:8080 todo-service
```

## Tests

Run unit and integration tests:

``` bash
.\mvnw test
```
