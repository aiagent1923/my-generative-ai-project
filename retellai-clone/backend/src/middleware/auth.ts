import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { environment } from "../config/environment";

export interface AuthenticatedUser {
  id: string;
  email: string;
  iat: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

const unauthorized = (res: Response, message: string) =>
  res.status(401).json({ message });

const isBearerToken = (value: string) => value.startsWith("Bearer ");

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization?.trim();

  if (!authHeader) {
    return unauthorized(res, "Authorization header is missing");
  }

  if (!isBearerToken(authHeader)) {
    return unauthorized(res, "Authorization header must use Bearer scheme");
  }

  const token = authHeader.substring("Bearer ".length).trim();

  if (!token) {
    return unauthorized(res, "Bearer token is missing");
  }

  if (!environment.jwtSecret) {
    return res.status(500).json({ message: "JWT secret is not configured" });
  }

  try {
    const decoded = jwt.verify(token, environment.jwtSecret);

    if (typeof decoded !== "object" || !decoded) {
      return unauthorized(res, "Invalid authentication token");
    }

    const { id, email, iat, exp } = decoded as jwt.JwtPayload & AuthenticatedUser;

    if (!id || !email || typeof iat !== "number") {
      return unauthorized(res, "Invalid authentication token");
    }

    req.user = { id, email, iat, exp };
    return next();
  } catch (error) {
    return unauthorized(res, "Invalid or expired authentication token");
  }
};
