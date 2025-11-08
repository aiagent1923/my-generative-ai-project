import { Request, Response } from "express";
import { authService } from "../services/authService";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.registerUser({ email, password });
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.authenticateUser({ email, password });
    return res.json(result);
  } catch (error) {
    return res.status(401).json({
      message: error instanceof Error ? error.message : "Authentication failed",
    });
  }
};
