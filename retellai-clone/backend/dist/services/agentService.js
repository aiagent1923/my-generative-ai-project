"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentService = void 0;
const prisma_1 = require("../config/prisma");
exports.agentService = {
    async listAgents(userId) {
        return prisma_1.prisma.agent.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    },
    async createAgent(userId, payload) {
        return prisma_1.prisma.agent.create({
            data: {
                ...payload,
                userId,
            },
        });
    },
};
//# sourceMappingURL=agentService.js.map