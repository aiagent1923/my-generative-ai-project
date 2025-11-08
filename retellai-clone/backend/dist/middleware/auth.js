"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../config/environment");
const unauthorized = (res, message) => res.status(401).json({ message });
const isBearerToken = (value) => value.startsWith("Bearer ");
const authMiddleware = (req, res, next) => {
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
    if (!environment_1.environment.jwtSecret) {
        return res.status(500).json({ message: "JWT secret is not configured" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, environment_1.environment.jwtSecret);
        if (typeof decoded !== "object" || !decoded) {
            return unauthorized(res, "Invalid authentication token");
        }
        const { id, email, iat, exp } = decoded;
        if (!id || !email || typeof iat !== "number") {
            return unauthorized(res, "Invalid authentication token");
        }
        req.user = { id, email, iat, exp };
        return next();
    }
    catch (error) {
        return unauthorized(res, "Invalid or expired authentication token");
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map