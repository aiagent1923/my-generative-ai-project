"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAgent = exports.updateAgent = exports.createAgent = exports.getAgentById = exports.getAgents = void 0;
const agentService_1 = require("../services/agentService");
const errors_1 = require("../utils/errors");
const normalizeQueryParam = (value) => {
    if (typeof value === "string") {
        return value;
    }
    if (Array.isArray(value) && value.length > 0) {
        const first = value[0];
        if (typeof first === "string") {
            return first;
        }
    }
    return undefined;
};
const parsePositiveInt = (value, fallback) => {
    const normalized = normalizeQueryParam(value);
    const parsed = normalized ? Number(normalized) : Number.NaN;
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return fallback;
    }
    return Math.floor(parsed);
};
const handleError = (res, error, fallbackStatus, fallbackMessage) => {
    if (error instanceof errors_1.ServiceError) {
        return res.status(error.status).json({ message: error.message });
    }
    return res.status(fallbackStatus).json({ message: fallbackMessage });
};
const getAgents = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Authorization required" });
        }
        const page = parsePositiveInt(req.query.page, 1);
        const limit = parsePositiveInt(req.query.limit, 10);
        const result = await agentService_1.agentService.listAgents(userId, page, limit);
        return res.json(result);
    }
    catch (error) {
        return handleError(res, error, 500, "Unable to fetch agents");
    }
};
exports.getAgents = getAgents;
const getAgentById = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id: agentId } = req.params;
        if (!userId) {
            return res.status(401).json({ message: "Authorization required" });
        }
        if (!agentId) {
            return res.status(400).json({ message: "Agent ID is required" });
        }
        const agent = await agentService_1.agentService.getAgentById(userId, agentId);
        return res.json({ agent });
    }
    catch (error) {
        return handleError(res, error, 404, "Agent could not be found");
    }
};
exports.getAgentById = getAgentById;
const createAgent = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Authorization required" });
        }
        const { name, description, voiceModel } = req.body;
        const agent = await agentService_1.agentService.createAgent(userId, {
            name: name ?? "",
            description,
            voiceModel: voiceModel ?? "",
        });
        return res.status(201).json({ agent });
    }
    catch (error) {
        return handleError(res, error, 400, "Unable to create agent");
    }
};
exports.createAgent = createAgent;
const updateAgent = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id: agentId } = req.params;
        if (!userId) {
            return res.status(401).json({ message: "Authorization required" });
        }
        if (!agentId) {
            return res.status(400).json({ message: "Agent ID is required" });
        }
        const { name, description, voiceModel } = req.body;
        const agent = await agentService_1.agentService.updateAgent(userId, agentId, {
            name,
            description,
            voiceModel,
        });
        return res.json({ agent });
    }
    catch (error) {
        return handleError(res, error, 400, "Unable to update agent");
    }
};
exports.updateAgent = updateAgent;
const deleteAgent = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id: agentId } = req.params;
        if (!userId) {
            return res.status(401).json({ message: "Authorization required" });
        }
        if (!agentId) {
            return res.status(400).json({ message: "Agent ID is required" });
        }
        await agentService_1.agentService.deleteAgent(userId, agentId);
        return res.json({ message: "Agent deleted successfully" });
    }
    catch (error) {
        return handleError(res, error, 400, "Unable to delete agent");
    }
};
exports.deleteAgent = deleteAgent;
//# sourceMappingURL=agentController.js.map