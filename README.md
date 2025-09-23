# 🚀 Todo Service

> **Full-Stack Todo Application with React Frontend and Spring Boot Backend**

![Java](https://img.shields.io/badge/Java-21-orange) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.4-green) ![React](https://img.shields.io/badge/React-19.1-blue) ![Docker](https://img.shields.io/badge/Docker-Ready-blue)

Modern todo management application featuring a **React frontend** with **Spring Boot microservice backend**, demonstrating clean architecture, REST API design, and containerized deployment.

---

## 🏗️ Architecture

### **Backend (Spring Boot)**
```
src/main/java/com/aliunal/todoservice/
├── api/rest/           # REST Controllers & Exception Handling
├── domain/todo/        # Business Logic & Entities
│   ├── entity/         # JPA Entities
│   ├── repository/     # Domain Repository Interfaces
│   └── service/        # Business Services
├── infrastructure/     # External Dependencies
│   └── persistence/    # JPA Repository Implementations
└── shared/dto/         # Data Transfer Objects
```

### **Frontend (React + Vite)**
```
frontend/src/
├── components/         # React Components (AddTodoForm, TodoItem, TodoList)
├── hooks/              # Custom React Hooks (useTodos, useToast)
├── services/           # API Communication (todoApi)
└── App.jsx             # Main Application
```

### **Technology Stack**
- **Backend**: Java 21, Spring Boot 3.5.4, Spring Data JPA, H2 Database
- **Frontend**: React 19.1, Vite 7, Modern ES6+, CSS Modules
- **API**: RESTful API with OpenAPI/Swagger documentation
- **Database**: H2 (file-based persistence)
- **Container**: Docker with multi-stage build

---

## 🚀 Quick Start

### Prerequisites
- **Java 21+**
- **Node.js 18.17+** (for frontend development)
- **Docker** (for containerized deployment)

### Local Development
```bash
# Start Spring Boot application
./mvnw spring-boot:run

# For frontend development (separate terminal)
cd frontend && npm install && npm run dev
```

### Production Build
```bash
# Build integrated application (React + Spring Boot)
./mvnw clean package

# Run integrated application
java -jar target/todo-service-0.0.1-SNAPSHOT.jar
```

### Docker Deployment
```bash
# Build and run
docker build -t todo-app . && docker run -d --name todo-app -p 8080:8080 todo-app:latest
```

---

## 🎯 Features

### **Frontend**
- ✅ Modern React UI with responsive design
- ✅ Edit-in-Place functionality (double-click to edit)
- ✅ Toast notifications for user feedback
- ✅ Priority system (HIGH/MEDIUM/LOW) with color coding
- ✅ Real-time updates with optimistic UI
- ✅ Form validation with error handling

### **Backend**
- ✅ REST API (`/api/v1/todos`) with full CRUD operations
- ✅ Domain-Driven Design with clean architecture
- ✅ JPA entities with proper relationships
- ✅ DTO pattern for API contracts
- ✅ Bean validation and global exception handling
- ✅ Swagger documentation for API exploration

---

## 📚 API Documentation

- **Application**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui/index.html
- **OpenAPI Spec**: http://localhost:8080/v3/api-docs
- **H2 Console**: http://localhost:8080/h2-console (dev only)

---

## 🗺️ Roadmap

### **Phase 1: Core Features** 
- [x] Basic CRUD operations
- [x] React frontend integration
- [x] Docker deployment
- [x] Edit-in-place functionality
- [x] Priority system
- [x] Toast notifications

### **Phase 2: Enhanced UX** 
- [ ] **User Authentication** (Spring Security + JWT)
- [ ] **Categories/Tags** for todos
- [ ] **Due Dates** with calendar integration
- [ ] **Search & Filtering** functionality
- [ ] **Drag & Drop** reordering
- [ ] **Dark/Light Theme** toggle

### **Phase 3: Advanced Features** 
- [ ] **Real-time Collaboration** (WebSockets)
- [ ] **File Attachments** support
- [ ] **Email Notifications** for due dates
- [ ] **Mobile App** (React Native)
- [ ] **Offline Support** (PWA)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

