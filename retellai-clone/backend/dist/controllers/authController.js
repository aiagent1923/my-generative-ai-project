"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.logout = exports.login = exports.register = void 0;
const authService_1 = require("../services/authService");
const errors_1 = require("../utils/errors");
const handleError = (res, error, fallbackStatus, fallbackMessage) => {
    if (error instanceof errors_1.ServiceError) {
        return res.status(error.status).json({ message: error.message });
    }
    return res.status(fallbackStatus).json({ message: fallbackMessage });
};
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService_1.authService.registerUser({ email, password });
        return res.status(201).json(result);
    }
    catch (error) {
        return handleError(res, error, 500, "Unable to complete registration");
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService_1.authService.authenticateUser({ email, password });
        return res.json(result);
    }
    catch (error) {
        return handleError(res, error, 401, "Unable to authenticate user");
    }
};
exports.login = login;
const logout = (_req, res) => {
    return res.status(200).json({ message: "Logged out successfully" });
};
exports.logout = logout;
const getCurrentUser = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authorization required" });
    }
    return res.json({ user: req.user });
};
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=authController.js.map