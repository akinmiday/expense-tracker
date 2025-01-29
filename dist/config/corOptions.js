"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
// Configure CORS
exports.corsOptions = {
    origin: true, // Allow requests from this origin
    methods: "GET,POST,PUT,DELETE", // Allow these HTTP methods
    allowedHeaders: "Content-Type,Authorization", // Allow these headers
    credentials: true, // Allow credentials (e.g., cookies)
};
