# Angular + Spring Boot Weather App

A full-stack weather application built with Angular (frontend) and Spring Boot (backend). This project provides real-time weather forecasts and location search, with a focus on code quality, testing, and developer experience.

---

## Project Structure

- `frontend/` — Angular app (UI)
- `backend/` — Spring Boot app (API)

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/download/) (for Angular)
- [npm](https://www.npmjs.com/get-npm) or [pnpm](https://pnpm.io/installation) (for Angular dependencies)
- [Java 17+](https://adoptopenjdk.net/) (for Spring Boot)
- [Maven](https://maven.apache.org/download.cgi) (for backend dependencies & tests)

---

## Setup Instructions

### 1. Install Angular Frontend Dependencies

```sh
cd frontend
npm install # or pnpm install
```

### 2. Install Spring Boot Backend Dependencies

```sh
cd ../backend
mvn clean install
```

---

## Running the App

### 1. Start the Spring Boot Backend

```sh
cd backend
mvn spring-boot:run
```
- The API will be available at `http://localhost:8080/`

### 2. Start the Angular Frontend

Open a new terminal window:

```sh
cd frontend
npm start # or ng serve
```
- The UI will be available at `http://localhost:4200/`

---

## Running Tests

### Spring Boot Backend Tests

```sh
cd backend
mvn clean test
```

### Angular Frontend Tests

```sh
cd frontend
npm test # or ng test
```

---

## Additional Notes
- Ensure the backend is running before using the frontend for full functionality.
- For E2E tests, refer to the `frontend` and `backend` documentation or scripts.
