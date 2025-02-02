import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Secret key for signing JWTs, should be stored securely (e.g., in environment variables)
const JWT_SECRET = "your-secret-key"; // Replace with your actual secret key

// Middleware to check if user is authenticated
export const verifyUserRest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Get the token from Authorization header (e.g., 'Bearer token')
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // If no token is found, respond with an error
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    // Verify the token using JWT secret key
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number }; // Assuming the token contains user ID
    // Attach the user information to the request object
    res.locals.user = decoded;
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    // If token is invalid or expired, respond with an error
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
