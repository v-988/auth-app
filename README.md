# 🔐 Auth App API

A secure authentication API built with Node.js, Express, and MongoDB. This project provides user registration, login, password hashing, JWT-based authentication, and protected routes.

## 🚀 Features

* User Registration
* User Login
* Password Hashing with bcrypt
* JWT Authentication
* Protected Routes
* Input Validation
* Error Handling Middleware
* MongoDB Database Integration
* RESTful API Design

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT (JSON Web Token)
* bcryptjs
* dotenv

## 📂 Project Structure

```text
src/
├── controllers/
├── middleware/
├── models/
├── routes/
├── app.js
├── server.js
└── db.js
```

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/v-988/auth-app.git
cd auth-app
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Run the Application

```bash
npm run dev
```

or

```bash
npm start
```

## 🔑 API Endpoints

### Register User

```http
POST /api/auth/register
```

Request Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login User

```http
POST /api/auth/login
```

Request Body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Protected Route

```http
GET /api/auth/profile
```

Headers:

```http
Authorization: Bearer <token>
```

## 📮 Testing

Use Postman or Thunder Client to test the API endpoints.

## 🔒 Security Features

* Password hashing using bcrypt
* JWT token authentication
* Protected routes middleware
* Environment variable protection
* Input validation

## 🌟 Future Improvements

* Password Reset
* Email Verification
* Refresh Tokens
* Role-Based Access Control (RBAC)
* OAuth Authentication (Google/GitHub)

## 👨‍💻 Author

Developed by **Vishal**

GitHub: https://github.com/v-988
