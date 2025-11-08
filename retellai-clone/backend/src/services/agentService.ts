import { prisma } from "../config/prisma";

interface AgentPayload {
  name: string;
  description?: string;
  voiceModel?: string;
}

export const agentService = {
  async listAgents(userId: string) {
    return prisma.agent.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async createAgent(userId: string, payload: AgentPayload) {
    return prisma.agent.create({
      data: {
        ...payload,
        userId,
      },
    });
  },
};
