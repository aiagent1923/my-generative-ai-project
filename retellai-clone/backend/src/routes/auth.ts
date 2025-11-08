import { Router } from "express";

import { authMiddleware } from "../middleware/auth";
import { getCurrentUser, login, logout, register } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getCurrentUser);

export default router;
