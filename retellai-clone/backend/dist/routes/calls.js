"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const callController_1 = require("../controllers/callController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.post("/start", callController_1.startCallSession);
router.post("/end", callController_1.endCallSession);
exports.default = router;
//# sourceMappingURL=calls.js.map