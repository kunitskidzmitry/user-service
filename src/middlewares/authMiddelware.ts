import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Type for the payload inside the JWT token
interface JwtPayload {
  userId: string;
  role: 'ADMIN' | 'USER';
}

// Manual extension of the Request type for this file
interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

/**
 * Middleware to verify and decode JWT token.
 * - Checks for the presence and validity of the token in the Authorization header
 * - Decodes the token and attaches user data to req.user
 * - If the token is invalid or missing, returns an error
 */
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  // Check for token in the header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = decoded; // Attach decoded user info to request
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
