"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endCallSession = exports.startCallSession = void 0;
const prisma_1 = require("../config/prisma");
const startCallSession = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { agentId } = req.body;
        if (!agentId) {
            return res.status(400).json({ message: "agentId is required" });
        }
        const callSession = await prisma_1.prisma.callSession.create({
            data: {
                agentId,
            },
        });
        return res.status(201).json({ callSession });
    }
    catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : "Failed to start call session",
        });
    }
};
exports.startCallSession = startCallSession;
const endCallSession = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { sessionId, transcript } = req.body;
        if (!sessionId) {
            return res.status(400).json({ message: "sessionId is required" });
        }
        const callSession = await prisma_1.prisma.callSession.update({
            where: { id: sessionId },
            data: {
                endedAt: new Date(),
                transcript,
            },
        });
        return res.json({ callSession });
    }
    catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : "Failed to end call session",
        });
    }
};
exports.endCallSession = endCallSession;
//# sourceMappingURL=callController.js.map