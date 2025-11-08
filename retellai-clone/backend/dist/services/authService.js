"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../config/environment");
const prisma_1 = require("../config/prisma");
const errors_1 = require("../utils/errors");
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const sanitizeUser = (user) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = user;
    return rest;
};
const createToken = (userId, email) => jsonwebtoken_1.default.sign({ id: userId, email }, environment_1.environment.jwtSecret, {
    expiresIn: "7d",
});
const normalizeEmail = (email) => email.trim().toLowerCase();
const resolveSaltRounds = () => {
    const configuredRounds = Number(environment_1.environment.bcryptSaltRounds);
    return Number.isFinite(configuredRounds) ? configuredRounds : 10;
};
exports.authService = {
    async registerUser({ email, password }) {
        if (!email) {
            throw new errors_1.ServiceError(400, "Email is required");
        }
        const normalizedEmail = normalizeEmail(email);
        if (!EMAIL_REGEX.test(normalizedEmail)) {
            throw new errors_1.ServiceError(400, "Invalid email format");
        }
        if (!password || password.length < 8) {
            throw new errors_1.ServiceError(400, "Password must be at least 8 characters long");
        }
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (existingUser) {
            throw new errors_1.ServiceError(400, "A user with this email already exists");
        }
        const saltRounds = resolveSaltRounds();
        const passwordHash = await bcryptjs_1.default.hash(password, saltRounds);
        const user = await prisma_1.prisma.user.create({
            data: {
                email: normalizedEmail,
                passwordHash,
            },
        });
        const token = createToken(user.id, user.email);
        return { user: sanitizeUser(user), token };
    },
    async authenticateUser({ email, password }) {
        if (!email) {
            throw new errors_1.ServiceError(400, "Email is required");
        }
        if (!password) {
            throw new errors_1.ServiceError(400, "Password is required");
        }
        const normalizedEmail = normalizeEmail(email);
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (!user) {
            throw new errors_1.ServiceError(401, "Invalid email or password");
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new errors_1.ServiceError(401, "Invalid email or password");
        }
        const token = createToken(user.id, user.email);
        return { user: sanitizeUser(user), token };
    },
};
//# sourceMappingURL=authService.js.map