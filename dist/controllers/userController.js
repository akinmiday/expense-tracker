"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
}
/**
 * Register a new user
 */
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    // Validate request body
    if (!username || !email || !password) {
        res
            .status(400)
            .json({ error: "username, email, and password are required." });
        return;
    }
    try {
        // Check if the user already exists
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: "User already exists." });
            return;
        }
        // Create a new user
        const user = new User_1.default({ username, email, password });
        yield user.save();
        // Generate a JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        // Set the token as an HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true, // Prevent client-side access
            // secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            // sameSite: "strict", // Protect against CSRF attacks
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        // Return the user data
        res.status(201).json({ message: "Registration successful", user });
    }
    catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Failed to register user." });
    }
});
exports.registerUser = registerUser;
/**
 * Login a user
 */
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Validate request body
    if (!email || !password) {
        res.status(400).json({ error: "email and password are required." });
        return;
    }
    try {
        // Find the user by email
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ error: "Invalid email or password." });
            return;
        }
        // Compare the provided password with the hashed password
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            res.status(400).json({ error: "Invalid email or password." });
            return;
        }
        // Generate a JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        // Set the token as an HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true, // Prevent client-side access
            // secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            // sameSite: "strict", // Protect against CSRF attacks
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        // Return the user data
        res.status(200).json({ message: "Login successful", token });
    }
    catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: "Failed to log in user." });
    }
});
exports.loginUser = loginUser;
/**
 * Logout the user
 */
const logoutUser = (req, res) => {
    try {
        // Clear the JWT token cookie
        res.clearCookie("token", {
            httpOnly: true, // Make sure it's cleared as an HTTP-only cookie
            // sameSite: "strict", // SameSite protection
            maxAge: 0, // Set expiration to 0 to immediately clear it
        });
        // Send response
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error("Error logging out user:", error);
        res.status(500).json({ error: "Failed to log out user." });
    }
};
exports.logoutUser = logoutUser;
// check auth
const checkAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ isAuthenticated: false });
        return;
    }
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        res.status(200).json({ isAuthenticated: true, userId: decoded.userId });
    }
    catch (error) {
        res.status(401).json({ isAuthenticated: false });
    }
});
exports.checkAuth = checkAuth;
