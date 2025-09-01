KvizHub – Knowledge testing platform with ranking list

KvizHub is a web application that allows users to solve quizzes from various fields, track their results in real time, and compare themselves with other users through a global leaderboard.

Technologies:
- Frontend: React(TypeScript), CSS
- Backend: ASP.NET Core Web API (C#)
- Base: MySQL
- Authentication: JWT (JSON Web Token)
- Migrations: Entity Framework Core

Functionalities:
- User:
	Registration and login (JWT authentication, hashed passwords)
	Browsing and filtering quizzes by category, difficulty, and search
	Solving quizzes with time limits
	Viewing personal results and quiz history
	Global leaderboard with user ranking

- Admin: 
	CRUD operations on quizzes and questions
	Categorization of quizzes
	Viewing results of all users
	Creating quizzes with different difficulty levels
	
Architecture:
- Frontend:
	Component-based approach (each page divided into smaller functional components)
	Services for HTTP requests, URLs stored in the .env file
	UserContext for user session management
	Models defined on the frontend for typing
	
- Backend (three-layer architecture):
	Controllers – REST API endpoints
	Services – business logic (dependency injection)
	DAO – database access (EF Core)
	DTO models – separated from database models, mapped using AutoMapper
	AppSettings.json – stores configuration data (connection string, JWT secret)
	
Project structure:
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

UML and System Architecture:
	The UML diagram and system architecture are located in the /backend folder.

Testing:
	Register a user via the frontend form or POST /api/users/register
	Log in and obtain a JWT token
	Start a quiz, check results, and the leaderboard

Security:
	Passwords are stored hashed (PasswordHasher)
	JWT token validation (signature + expiration)
	Configuration stored in appsettings.json and .env files

Final delivery includes:
	Frontend and backend code
	SQL migrations
	UML diagram
	README.md (this guide)