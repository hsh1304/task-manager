# Task Manager Microservices

This is a microservices-based application that allows users to manage tasks.

## Table of Contents

- [Architecture]
- [Technologies-Used]

## Architecture

The application consists of the following microservices:
- User Service: Manages user authentication and authorization.
- Task Service: Manages tasks, including creation, updating, deletion, and retrieval.

Both services communicate with a PostgreSQL database and are containerized using Docker.

## Technologies-Used

- Node.js
- Express
- PostgreSQL
- Sequelize
- Docker
- Docker Compose