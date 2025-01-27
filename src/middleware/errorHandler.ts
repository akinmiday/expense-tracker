import { Request, Response, NextFunction } from "express";
import { logEvents } from "./logEvents"; // Import the logEvents function

// Error handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error to the errLog.txt file
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  console.error(err.stack);

  // Respond with a generic error message
  res.status(500).send(err.message);
};
