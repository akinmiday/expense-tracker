"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logEvents_1 = require("./logEvents"); // Import the logEvents function
// Error handling middleware
const errorHandler = (err, req, res, next) => {
    // Log the error to the errLog.txt file
    (0, logEvents_1.logEvents)(`${err.name}: ${err.message}`, "errLog.txt");
    console.error(err.stack);
    // Respond with a generic error message
    res.status(500).send(err.message);
};
exports.errorHandler = errorHandler;
