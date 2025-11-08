import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { environment } from "../config/environment";
import { prisma } from "../config/prisma";
import { ServiceError } from "../utils/errors";

interface Credentials {
  email: string;
  password: string;
}

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const sanitizeUser = (user: User) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...rest } = user;
  return rest;
};

const createToken = (userId: string, email: string) =>
  jwt.sign({ id: userId, email }, environment.jwtSecret, {
    expiresIn: "7d",
  });

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const resolveSaltRounds = () => {
  const configuredRounds = Number(environment.bcryptSaltRounds);
  return Number.isFinite(configuredRounds) ? configuredRounds : 10;
};

export const authService = {
  async registerUser({ email, password }: Credentials) {
    if (!email) {
      throw new ServiceError(400, "Email is required");
    }

    const normalizedEmail = normalizeEmail(email);

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      throw new ServiceError(400, "Invalid email format");
    }

    if (!password || password.length < 8) {
      throw new ServiceError(400, "Password must be at least 8 characters long");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ServiceError(400, "A user with this email already exists");
    }

    const saltRounds = resolveSaltRounds();
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
      },
    });

    const token = createToken(user.id, user.email);

    return { user: sanitizeUser(user), token };
  },

  async authenticateUser({ email, password }: Credentials) {
    if (!email) {
      throw new ServiceError(400, "Email is required");
    }

    if (!password) {
      throw new ServiceError(400, "Password is required");
    }

    const normalizedEmail = normalizeEmail(email);

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new ServiceError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new ServiceError(401, "Invalid email or password");
    }

    const token = createToken(user.id, user.email);

    return { user: sanitizeUser(user), token };
  },
};
