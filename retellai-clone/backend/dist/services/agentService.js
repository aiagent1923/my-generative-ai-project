"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentService = void 0;
const prisma_1 = require("../config/prisma");
const errors_1 = require("../utils/errors");
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const sanitizePagination = (page, limit) => {
    const safePage = Number.isFinite(page) && page && page > 0 ? Math.floor(page) : DEFAULT_PAGE;
    const safeLimitRaw = Number.isFinite(limit) && limit && limit > 0 ? Math.floor(limit) : DEFAULT_LIMIT;
    const safeLimit = Math.min(safeLimitRaw, MAX_LIMIT);
    return { page: safePage, limit: safeLimit };
};
const findAgentForUser = async (agentId, userId) => {
    const agent = await prisma_1.prisma.agent.findFirst({ where: { id: agentId, userId } });
    if (!agent) {
        throw new errors_1.ServiceError(404, "Agent not found");
    }
    return agent;
};
const sanitizeCreatePayload = ({ name, description, voiceModel }) => {
    if (!name || !name.trim()) {
        throw new errors_1.ServiceError(400, "Agent name is required");
    }
    if (!voiceModel || !voiceModel.trim()) {
        throw new errors_1.ServiceError(400, "voiceModel is required");
    }
    const trimmedDescription = description?.trim();
    return {
        name: name.trim(),
        voiceModel: voiceModel.trim(),
        description: trimmedDescription && trimmedDescription.length > 0 ? trimmedDescription : undefined,
    };
};
const sanitizeUpdatePayload = ({ name, description, voiceModel }) => {
    const data = {};
    if (typeof name !== "undefined") {
        if (!name || !name.trim()) {
            throw new errors_1.ServiceError(400, "Agent name cannot be empty");
        }
        data.name = name.trim();
    }
    if (typeof voiceModel !== "undefined") {
        if (!voiceModel || !voiceModel.trim()) {
            throw new errors_1.ServiceError(400, "voiceModel cannot be empty");
        }
        data.voiceModel = voiceModel.trim();
    }
    if (typeof description !== "undefined") {
        if (description === null) {
            data.description = null;
        }
        else if (typeof description === "string") {
            const trimmed = description.trim();
            data.description = trimmed.length > 0 ? trimmed : null;
        }
    }
    if (!Object.keys(data).length) {
        throw new errors_1.ServiceError(400, "No valid fields to update");
    }
    return data;
};
exports.agentService = {
    async listAgents(userId, page, limit) {
        const { page: safePage, limit: safeLimit } = sanitizePagination(page, limit);
        const skip = (safePage - 1) * safeLimit;
        const [agents, total] = await Promise.all([
            prisma_1.prisma.agent.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                skip,
                take: safeLimit,
            }),
            prisma_1.prisma.agent.count({ where: { userId } }),
        ]);
        return { agents, total, page: safePage, limit: safeLimit };
    },
    async getAgentById(userId, agentId) {
        return findAgentForUser(agentId, userId);
    },
    async createAgent(userId, payload) {
        const data = sanitizeCreatePayload(payload);
        return prisma_1.prisma.agent.create({
            data: {
                ...data,
                description: data.description ?? null,
                userId,
            },
        });
    },
    async updateAgent(userId, agentId, payload) {
        await findAgentForUser(agentId, userId);
        const data = sanitizeUpdatePayload(payload);
        return prisma_1.prisma.agent.update({
            where: { id: agentId },
            data,
        });
    },
    async deleteAgent(userId, agentId) {
        await findAgentForUser(agentId, userId);
        await prisma_1.prisma.agent.delete({ where: { id: agentId } });
    },
};
//# sourceMappingURL=agentService.js.map