"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];
requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
        console.warn(`⚠️  Missing required environment variable: ${key}`);
    }
});
exports.environment = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: parseInt(process.env.PORT ?? "5000", 10),
    databaseUrl: process.env.DATABASE_URL ?? "",
    jwtSecret: process.env.JWT_SECRET ?? "",
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "10", 10),
    socketIoPath: process.env.SOCKET_IO_PATH ?? "/socket.io",
};
//# sourceMappingURL=environment.js.map