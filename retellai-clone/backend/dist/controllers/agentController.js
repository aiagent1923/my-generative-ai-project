"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAgent = exports.getAgents = void 0;
const agentService_1 = require("../services/agentService");
const getAgents = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const agents = await agentService_1.agentService.listAgents(userId);
        return res.json({ agents });
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to fetch agents" });
    }
};
exports.getAgents = getAgents;
const createAgent = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const agent = await agentService_1.agentService.createAgent(userId, req.body);
        return res.status(201).json({ agent });
    }
    catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : "Failed to create agent",
        });
    }
};
exports.createAgent = createAgent;
//# sourceMappingURL=agentController.js.map