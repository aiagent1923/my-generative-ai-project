"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agentController_1 = require("../controllers/agentController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get("/", agentController_1.getAgents);
router.post("/", agentController_1.createAgent);
exports.default = router;
//# sourceMappingURL=agents.js.map