KvizHub – Architecture Overview

This document describes the architecture of the KvizHub platform, data flows, and communication between the frontend, backend, and database.

1. High-Level Overview

	KvizHub is a three-tier application:

	[Frontend (React)]
			|
			| HTTP/REST + JWT
			v
	[Backend (ASP.NET Core Web API)]
			|
			| EF Core / DAO
			v
	[Database (MySQL)]

	The frontend communicates with the backend via REST API and a real-time SignalR Hub for the leaderboard.
	The backend follows a three-layer structure: Controller → Service → DAO.
	The database stores all user, quiz, and result data.

2. Frontend Architecture

	Component-based approach: each page is divided into smaller, functional components.
	HTTP services: all API calls are handled through service classes (Fetch), with URLs stored in the .env file.
	UserContext: stores user data and the JWT token for authentication.
	Models / TypeScript Interfaces: define the data types expected from the backend.

3. Backend Architecture

	Controllers – REST API endpoints
	Services – business logic (dependency injection)
	DAO – database access (EF Core)
	DTO – separated from database models, mapped using AutoMapper
	Models – entity classes representing database objects
	Context – EF Core AppDbContext for database access
	Hubs – SignalR real-time communication
	Profiles – AutoMapper profiles for mapping DTOs and entities
	Migrations – EF Core database migrations, database change history
	AppSettings.json – stores configuration data (connection string, JWT secret)

4. Data Flow

	User clicks “Start Quiz”
	Frontend sends GET /api/quizzes/${quizId}/attempts
	Controller forwards the request to the Service
	Service uses DAO to fetch data from the database
	Model is mapped into DTO and returned to the frontend
	Frontend displays questions and starts the timer
	User finishes the quiz and submits answers via PUT /api/quizzes/attempts/${quizResult.id}
	Service calculates the score and writes it to the database
	Frontend displays new score

5. Diagram

	Offline Quiz Data Flow (ASCII diagram):

	[Frontend (React)]
			|
			| HTTP/REST + JWT
			v
	[Controller] --> [Service] --> [DAO] --> [Database (MySQL)]
			^
			| Response
			v
	[Frontend (React)]

	Online Quiz Data Flow (ASCII diagram):

	[Frontend (React)]
			|
			| HTTP/REST + JWT
			v
	[Controller] --> [Service] --> [DAO] --> [Database (MySQL)]
			^
			| SignalR
			v
	[Frontend (React)]  // real-time rang list

6. Project Structure
	Backend/
	├─ Context/          # EF Core AppDbContext
	├─ Controllers/      # REST API endpoints
	├─ DAO/     	     # Data access layer
	├─ DTO/              # DTO models
	├─ Hubs/             # SignalR hubs
	├─ Migrations/       # EF Core database migrations
	├─ Models/           # Entity models for DB
	├─ Profiles/         # AutoMapper profiles
	├─ Services/         # Business logic
	└─ appsettings.json  # Configuration (DB, JWT secrets)

Frontend/
	├─ components/       # Reusable React components
	├─ config/       	 # Configuration (constants)
	├─ context/          # React Context (UserContext, QuizContext)
	├─ customHooks/      # Custom hooks
	├─ functions/        # Helper functions (formatTime, handleInputChange, filterForQuizzesSearch, filterForQuizzesDropDown)
	├─ models/           # TypeScript interfaces
	├─ pages/            # Page components
	├─ services/         # HTTP requests (Fetch)
	├─ sockets/          # SignalR sockets
	├─ styles/           # CSS style modules
	└─ .env              # API URLs and config

7. Security and Configuration
	JWT token for authentication and authorization
	Passwords stored hashed (PasswordHasher)
	Configuration data (DB, JWT secrets, external services) stored in appsettings.json and .env