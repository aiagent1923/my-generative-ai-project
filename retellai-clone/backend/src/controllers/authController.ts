import { Request, Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth";
import { authService } from "../services/authService";
import { ServiceError } from "../utils/errors";

const handleError = (res: Response, error: unknown, fallbackStatus: number, fallbackMessage: string) => {
  if (error instanceof ServiceError) {
    return res.status(error.status).json({ message: error.message });
  }

  return res.status(fallbackStatus).json({ message: fallbackMessage });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.registerUser({ email, password });
    return res.status(201).json(result);
  } catch (error) {
    return handleError(res, error, 500, "Unable to complete registration");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.authenticateUser({ email, password });
    return res.json(result);
  } catch (error) {
    return handleError(res, error, 401, "Unable to authenticate user");
  }
};

export const logout = (_req: Request, res: Response) => {
  return res.status(200).json({ message: "Logged out successfully" });
};

export const getCurrentUser = (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authorization required" });
  }

  return res.json({ user: req.user });
};
