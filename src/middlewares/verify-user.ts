import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ExtendedError, Socket } from "socket.io";

// Secret key for signing JWTs, should be stored securely (e.g., in environment variables)
const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key"; // Replace with your actual secret key

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
    res.statusCode = 401;
    throw new Error("Authentication required");
  }

  // console.log(token, "from REST");

  try {
    // Verify the token using JWT secret key
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number }; // Assuming the token contains user ID
    // Attach the user information to the request object
    res.locals.user = decoded;
    
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    // If token is invalid or expired, respond with an error
    res.statusCode = 401;
    throw new Error("Invalid or expired token");
  }
};

export const verifyUserWS = async (socket: Socket, next: (err?: ExtendedError | undefined | any) => void) => {

  // Get the token from Authorization header (e.g., 'Bearer token')
  const token = socket.handshake.auth.token;  

  // If no token is found, respond with an error
  if (!token || typeof token !== "string" || token.length === 0) {
    next(new Error("Authentication required"));
  }

  try {
    // Verify the token using JWT secret key
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number }; // Assuming the token contains user ID
    // Attach the user information to the request object
    socket.data.user = decoded;
    
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    // If token is invalid or expired, respond with an error
    next(new Error("Invalid or expired token"));
  }
  }
