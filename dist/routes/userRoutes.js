"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
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
router.post("/users/register", userController_1.registerUser);
/**
 * Route to log in a user
 * POST /api/users/login
 * Request Body:
 * {
 *   "email": "john@example.com",
 *   "password": "password123"
 * }
 */
router.post("/users/login", userController_1.loginUser);
// Logout route
router.post("/logout", userController_1.logoutUser);
// Route to check if the user is authenticated
router.get("users/check-auth", userController_1.checkAuth);
exports.default = router;
