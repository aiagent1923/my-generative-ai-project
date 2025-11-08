import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"] as const;

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️  Missing required environment variable: ${key}`);
  }
});

export const environment = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parseInt(process.env.PORT ?? "5000", 10),
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "",
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "10", 10),
  socketIoPath: process.env.SOCKET_IO_PATH ?? "/socket.io",
};
