# HireStories - From Developers, For Developers

HireStories is a full-stack platform for sharing real interview experiences. Built with Spring Boot Microservices and React + Vite.

## Architecture
- **Backend**: Spring Boot 3.2 (Microservices)
  - `auth-service`: JWT Authentication (Port 8081)
  - `interview-service`: Core Logic (Port 8082)
  - `api-gateway`: Routing & Security (Port 8080)
- **Frontend**: React + Vite (Port 5173 / 80)
- **Database**: PostgreSQL (Port 5432)

## Prerequisites
- Docker & Docker Compose
- Java 17+ (for local dev without Docker)
- Node.js 18+ (for local dev without Docker)

## Quick Start (Docker)
1. Clone the repository.
2. Run database and services:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - Frontend: `http://localhost:5173` (or port 80 if via nginx container, currently compose maps ports for dev)
   - API Gateway: `http://localhost:8080`

## Local Development (Manual)
### Database
Start a PostgreSQL instance on port 5432 with `postgres/password` and create database `hirestories_db`.

### Backend
Navigate to each service directory (`backend/api-gateway`, `backend/auth-service`, `backend/interview-service`) and run:
```bash
mvn spring-boot:run
```

### Frontend
Navigate to `frontend`:
```bash
npm install
npm run dev
```

## Deployment
- **Backend**: Deploy `Dockerfile` of each service to Render/Railway.
- **Frontend**: Deploy to Vercel (link repository, build command `npm run build`, output `dist`).
- **Database**: Use Neon.tech or Supabase. Update `application.yml` or use environment variables `SPRING_DATASOURCE_URL`, etc.

## Features
- Login/Signup with JWT.
- Browse Interview Experiences by Company/Role.
- Submit your own experience.
- Upvote and Comment.
