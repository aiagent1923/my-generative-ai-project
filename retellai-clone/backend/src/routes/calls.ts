import { Router } from "express";
import { endCallSession, startCallSession } from "../controllers/callController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.post("/start", startCallSession);
router.post("/end", endCallSession);

export default router;
