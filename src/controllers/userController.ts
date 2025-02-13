import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

/**
 * Register a new user
 */
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "User already exists." });
      return;
    }

    // Create a new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the token as an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent client-side access
      secure: true, // Use secure cookies in production
      sameSite: "strict", // Protect against CSRF attacks
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Return the user data
    res.status(201).json({ message: "Registration successful", user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user." });
  }
};

/**
 * Login a user
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Validate request body
  if (!email || !password) {
    res.status(400).json({ error: "email and password are required." });
    return;
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "Invalid email or password." });
      return;
    }

    // Compare the provided password with the hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid email or password." });
      return;
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the token as an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent client-side access
      // secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Protect against CSRF attacks
      secure: true,
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Return the user data
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Failed to log in user." });
  }
};

/**
 * Logout the user
 */
export const logoutUser = (req: Request, res: Response): void => {
  try {
    // Clear the JWT token cookie
    res.clearCookie("token", {
      httpOnly: true, // Make sure it's cleared as an HTTP-only cookie
      sameSite: "strict", // SameSite protection
      maxAge: 0, // Set expiration to 0 to immediately clear it
    });

    // Send response
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ error: "Failed to log out user." });
  }
};

// check auth

export const checkAuth = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ isAuthenticated: false });
    return;
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    res.status(200).json({ isAuthenticated: true, userId: decoded.userId });
  } catch (error) {
    res.status(401).json({ isAuthenticated: false });
  }
};
