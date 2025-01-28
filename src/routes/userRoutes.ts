import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth,
} from "../controllers/userController";

const router = express.Router();

/**
 * Route to register a new user
 * POST /api/users/register
 * Request Body:
 * {
 *   "username": "john_doe",
 *   "email": "john@example.com",
 *   "password": "password123"
 * }
 */
router.post("/users/register", registerUser);

/**
 * Route to log in a user
 * POST /api/users/login
 * Request Body:
 * {
 *   "email": "john@example.com",
 *   "password": "password123"
 * }
 */
router.post("/users/login", loginUser);

// Logout route
router.post("/logout", logoutUser);

// Route to check if the user is authenticated
router.get("users/check-auth", checkAuth);

export default router;
