import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { environment } from '../config/environment';

export interface AuthPayload {
  id: string;
  email: string;
  [key: string]: unknown;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Invalid authorization header format' });
  }

  try {
    const decoded = jwt.verify(token, environment.JWT_SECRET) as AuthPayload;
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
