# Ebooks web application
## Overview
The Ebooks project is a full-stack web application designed to manage and share a collection of ebooks. The application allows users to upload, view, edit, and delete ebooks. It also provides features for searching, filtering, and sorting books based on various criteria such as title, author, genre, and year of publication.
## Features
### Client-Side (Frontend)
- **User Authentication**: Users can sign up, sign in, and log out. Authentication is handled using JWT tokens.
- **Book Management**: Users can create, edit, and delete books. Each book includes details such as title, description, author, year, genres, and associated files (PDF and thumbnail).
- **Search and Filter**: Users can search for books by title, description, and author. They can also filter books by genre, author, and year.
- **Pagination**: Books are displayed with pagination to improve user experience.
- **Responsive Design**: The application is designed to be responsive and works well on both desktop and mobile devices.
- **Theme Switching**: Users can switch between light, dark, and system themes.
### Server-Side (Backend)
- **RESTful API**: The backend provides a RESTful API for managing books and user authentication.
- **File Upload**: Users can upload PDF files for books, and the server generates thumbnails for these files.
- **Database Integration**: The application uses MongoDB to store user and book data.
- **Error Handling**: The backend includes comprehensive error handling to ensure robust operation.
## Stack
### Frontend
- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Material-UI**: A popular React UI framework.
- **React Router**: A library for routing in React applications.
- **Axios**: A promise-based HTTP client for making API requests.
- **Vite**: A build tool that provides a faster and leaner development experience for modern web projects.
### Backend
- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: A minimal and flexible Node.js web application framework.
- **MongoDB**: A NoSQL database for storing user and book data.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **Passport**: An authentication middleware for Node.js.
- **Multer**: A middleware for handling multipart/form-data, used for file uploads.
- **JWT**: JSON Web Tokens for secure user authentication.
# Getting Started
## Prerequisites
- Installed Docker;
# Installation
1. Open the project folder
2. Create .env file with the next structure
```Properties
# SERVER VARIABLES
BACKEND_HOST=backend
BACKEND_PORT=5000

BACKEND_UPLOADED_BOOKS_PATH=uploads/books
BACKEND_UPLOADED_THUMBNAILS_PATH=uploads/thumbnails

BACKEND_JWT_SECRET_KEY=""
BACKEND_JWT_EXPIRES_IN=""

BACKEND_GOOGLE_CLIENT_ID=""
BACKEND_GOOGLE_CLIENT_SECRET=""

# CLIENT VARIABLES
FRONTEND_HOST=client
FRONTEND_PORT=3000

# MONGODB VARIABLES
MONGO_HOST=ebooks-app-mongo
MONGO_PORT=27017
MONGO_DB=ebooks-db
MONGO_USER=""
MONGO_PASS=""
```
4. Run the following command
```bash
docker compose up -d
```
