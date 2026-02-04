# CollabPro Backend

Base Spring Boot 3.x project for the CollabPro application.

## Requirements
- Java 17+
- Maven
- MySQL Database

## Tech Stack
- **Framework**: Spring Boot 3.2.1
- **Database**: MySQL with Spring Data JPA
- **Security**: Spring Security (Configured for JWT & CORS)
- **Utilities**: Lombok

## Getting Started

### 1. Database Setup
Ensure you have MySQL running. The application is configured to connect to:
- **URL**: `jdbc:mysql://localhost:3306/collabpro`
- **Username**: `root`
- **Password**: `password`

The application is set to `createDatabaseIfNotExist=true`, so it should create the database automatically if the credentials are correct.
Modify `src/main/resources/application.yml` if your credentials differ.

### 2. Running the Application
You can run the application using Maven:

```bash
mvn spring-boot:run
```

The server will start on `http://localhost:8080`.

## CORS Configuration
CORS is configured to allow requests from `http://localhost:5173` (Vite default).
You can change this in `src/main/java/com/collabpro/config/SecurityConfig.java`.
