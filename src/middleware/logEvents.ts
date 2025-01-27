import { Request, Response, NextFunction } from "express"; // Add the necessary types
import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";

// Define the log function to accept a message and log name
export const logEvents = async (
  message: string,
  logName: string
): Promise<void> => {
  const dateTime = `${format(new Date(), "ddMMyyyy  \tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);

  try {
    // Ensure logs directory exists
    const logDir = path.join(__dirname, "..", "logs");
    if (!fs.existsSync(logDir)) {
      await fsPromises.mkdir(logDir);
    }

    // Append the log message to the respective log file
    await fsPromises.appendFile(path.join(logDir, logName), logItem);
  } catch (error) {
    console.error("Error logging events:", error);
  }
};

// Define the middleware logger
export const logger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Safely access the origin header
  const origin = req.headers.origin || "unknown"; // If 'origin' doesn't exist, use 'unknown'

  logEvents(`${req.method}\t${origin}\t${req.url}`, "reqLog.txt");
  console.log(`${req.method} ${req.path}`);
  next(); // Move to the next middleware or route handler
};
