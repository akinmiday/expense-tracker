# Expense Tracker & Analyzer With DEEPSEEK AI Integration

## Overview

The **Expense Tracker** API is a RESTful backend service designed to help users track their expenses, gain spending insights, and manage their financial activities. The API is built using Express.js and MongoDB, with JWT-based authentication and **DeepSeek AI integration** for AI-powered automatic expense categorization and financial analysis.

## Features

- User Authentication (Register, Login, Logout, Check Auth)
- Add Expenses
- Retrieve Expenses
- Spending Insights (Total and Category-wise Analysis)
- Secure API with JWT-based Authentication
- MongoDB Database Integration
- DeepSeek AI Integration: Automatically categorize expenses and generate insights.

## Technologies Used

- **DeepSeek AI Processing** For categorization and analysis
- **Node.js** with **Express.js** (Backend Framework)
- **MongoDB** with **Mongoose** (Database & ODM)
- **JWT Authentication** (Secure User Login)
- **dotenv** (Environment Variables Management)
- **cookie-parser** (Handling JWT Authentication via Cookies)
- **CORS** (Cross-Origin Resource Sharing)

## Installation

### Prerequisites

- Deepseek API key

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)
- A MongoDB Database (Local or Cloud, e.g., MongoDB Atlas)

### Clone the Repository

```sh
git clone https://github.com/akinmiday/expense-tracker.git
cd expense-tracker
```

### Install Dependencies

```sh
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_MODEL= the model of deepseek. default is deepseek_chat you can leave empty
```

### Start the Server

```sh
npm start
```

The API will be running on `http://localhost:5000`

---

## API Endpoints

### **User Authentication**

#### Register a New User

**POST** `/api/users/register`

##### Request Body:

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

##### Response Example:

```json
{
  "message": "User registered successfully"
}
```

#### User Login

**POST** `/api/users/login`

##### Request Body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

##### Response Example:

```json
{
  "token": "your_jwt_token",
  "user": {
    "id": "123",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### Logout

**POST** `/api/logout`

##### Response:

```json
{
  "message": "Logged out successfully"
}
```

#### Check User Authentication

**GET** `/api/users/check-auth`

##### Response:

```json
{
  "isAuthenticated": true,
  "user": {
    "id": "123",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

---

## **Expense Management**

#### Add a New Expense

**POST** `/api/expenses`

##### Request Body:

```json
{
  "amount": 20,
  "description": "Lunch at McDonald's",
  "date": "2023-10-05"
}
```

##### Response Example:

```json
{
  "amount": 20,
  "description": "Lunch at McDonald's",
  "category": "Food",
  "date": "2023-10-05",
  "user": "123",
  "_id": "456"
}
```

#### Get User Expenses

**GET** `/api/expenses`

##### Response Example:

```json
[
  {
    "amount": 20,
    "description": "Lunch at McDonald's",
    "category": "Food",
    "date": "2023-10-05",
    "user": "123",
    "_id": "456"
  }
]
```

#### Get Spending Insights

**POST** `/api/expenses/insights`

##### Query Parameters:

- `startDate` (required)
- `endDate` (required)

##### Response Example:

```json
{
  "totalSpending": 200,
  "categorySpending": {
    "Food": 100,
    "Transport": 50,
    "Other": 50
  },
  "insights": "You spent most on Food this month."
}
```

#### Get Previous Spending Insights

**GET** `/api/expenses/insights/previous`

##### Response Example:

```json
{
  "totalSpending": 150,
  "categorySpending": {
    "Entertainment": 60,
    "Shopping": 40,
    "Food": 50
  },
  "insights": "You spent more on entertainment last month."
}
```

---

## **Middleware**

### Authentication Middleware

All protected routes require users to send a JWT token in cookies. The `authMiddleware` verifies the token and extracts the user ID.

---

## **Project Structure**

```
expense-tracker-api/
│── config/
│   ├── database.js        # MongoDB connection
│   ├── corsOptions.js     # CORS configuration
│── controllers/
│   ├── expenseController.js # Expense management logic
│   ├── userController.js    # User authentication logic
│── middleware/
│   ├── authMiddleware.js    # JWT authentication
│   ├── errorHandler.js      # Global error handler
│   ├── logEvents.js         # Logging middleware
│── models/
│   ├── Expense.js           # Mongoose Expense Schema
│   ├── User.js              # Mongoose User Schema
│── routes/
│   ├── expenseRoutes.js     # Expense-related routes
│   ├── userRoutes.js        # User-related routes
│── .env                     # Environment variables
│── app.js                   # Express App Configuration
│── server.js                # Server Entry Point
│── package.json             # Project Dependencies
```

---

## **Contributing**

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit (`git commit -m "Added feature"`).
4. Push to your branch (`git push origin feature-name`).
5. Open a pull request.

---

## **License**

This project is licensed under the **MIT License**.

---

## **Contact**

For any issues, please create a GitHub issue or contact me on [**x**](https://x.com/akinmiday) .

---
