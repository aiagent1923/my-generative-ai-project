import { Request, Response } from 'express';

import { authService } from '../services/authService';
import { RegisterInput, LoginInput } from '../types';

export const register = async (req: Request, res: Response) => {
  try {
    const payload: RegisterInput = req.body;
    const result = await authService.register(payload);
    res.status(201).json(result);
  } catch (error) {
    console.error('Register error', error);
    res.status(500).json({ message: 'Unable to register user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const payload: LoginInput = req.body;
    const result = await authService.login(payload);
    res.status(200).json(result);
  } catch (error) {
    console.error('Login error', error);
    res.status(401).json({ message: 'Invalid credentials' });
  }
};
