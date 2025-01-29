"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
}
/**
 * Middleware to verify JWT token from cookies
 */
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Get the token from cookies
    if (!token) {
        res.status(401).json({ error: "Access denied. No token provided." });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.userId = decoded.userId; // Attach userId to the request object
        next(); // Pass control to the next middleware or route handler
    }
    catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ error: "Invalid token." });
        return;
    }
};
exports.authMiddleware = authMiddleware;
