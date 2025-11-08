import { Router } from "express";
import { createAgent, getAgents } from "../controllers/agentController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", getAgents);
router.post("/", createAgent);

export default router;
