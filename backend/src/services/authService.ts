import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { environment } from '../config/environment';
import { AuthPayload } from '../middleware/auth';
import { RegisterInput, LoginInput, AuthTokenResponse } from '../types';

class AuthService {
  async register(input: RegisterInput): Promise<AuthTokenResponse> {
    // Placeholder: replace with persistence logic (e.g., Prisma) later
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const mockUserId = `user_${Date.now()}`;

    const token = this.generateToken({ id: mockUserId, email: input.email });

    return {
      token,
      user: {
        id: mockUserId,
        email: input.email,
        name: input.name,
      },
      metadata: {
        passwordHash: hashedPassword,
      },
    };
  }

  async login(input: LoginInput): Promise<AuthTokenResponse> {
    // Placeholder: replace with credential check logic
    const mockUser: AuthPayload = {
      id: 'user_placeholder',
      email: input.email,
    };

    const token = this.generateToken(mockUser);

    return {
      token,
      user: {
        id: mockUser.id,
        email: mockUser.email,
      },
    };
  }

  private generateToken(payload: AuthPayload) {
    return jwt.sign(payload, environment.JWT_SECRET, { expiresIn: '1h' });
  }
}

export const authService = new AuthService();
