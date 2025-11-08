import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { environment } from "../config/environment";

interface Credentials {
  email: string;
  password: string;
}

const createToken = (userId: string, email: string) =>
  jwt.sign({ id: userId, email }, environment.jwtSecret, {
    expiresIn: "7d",
  });

export const authService = {
  async registerUser({ email, password }: Credentials) {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const saltRounds = environment.bcryptSaltRounds;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    const token = createToken(user.id, user.email);

    return { user, token };
  },

  async authenticateUser({ email, password }: Credentials) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = createToken(user.id, user.email);

    return { user, token };
  },
};
