import type { Agent } from "@prisma/client";

import { prisma } from "../config/prisma";
import { ServiceError } from "../utils/errors";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const sanitizePagination = (page?: number, limit?: number) => {
  const safePage = Number.isFinite(page) && page && page > 0 ? Math.floor(page) : DEFAULT_PAGE;
  const safeLimitRaw = Number.isFinite(limit) && limit && limit > 0 ? Math.floor(limit) : DEFAULT_LIMIT;
  const safeLimit = Math.min(safeLimitRaw, MAX_LIMIT);

  return { page: safePage, limit: safeLimit };
};

interface CreateAgentInput {
  name: string;
  description?: string;
  voiceModel: string;
}

interface UpdateAgentInput {
  name?: string;
  description?: string | null;
  voiceModel?: string;
}

const findAgentForUser = async (agentId: string, userId: string) => {
  const agent = await prisma.agent.findFirst({ where: { id: agentId, userId } });

  if (!agent) {
    throw new ServiceError(404, "Agent not found");
  }

  return agent;
};

const sanitizeCreatePayload = ({ name, description, voiceModel }: CreateAgentInput) => {
  if (!name || !name.trim()) {
    throw new ServiceError(400, "Agent name is required");
  }

  if (!voiceModel || !voiceModel.trim()) {
    throw new ServiceError(400, "voiceModel is required");
  }

  const trimmedDescription = description?.trim();

  return {
    name: name.trim(),
    voiceModel: voiceModel.trim(),
    description: trimmedDescription && trimmedDescription.length > 0 ? trimmedDescription : undefined,
  };
};

const sanitizeUpdatePayload = ({ name, description, voiceModel }: UpdateAgentInput) => {
  const data: UpdateAgentInput = {};

  if (typeof name !== "undefined") {
    if (!name || !name.trim()) {
      throw new ServiceError(400, "Agent name cannot be empty");
    }
    data.name = name.trim();
  }

  if (typeof voiceModel !== "undefined") {
    if (!voiceModel || !voiceModel.trim()) {
      throw new ServiceError(400, "voiceModel cannot be empty");
    }
    data.voiceModel = voiceModel.trim();
  }

  if (typeof description !== "undefined") {
    if (description === null) {
      data.description = null;
    } else if (typeof description === "string") {
      const trimmed = description.trim();
      data.description = trimmed.length > 0 ? trimmed : null;
    }
  }

  if (!Object.keys(data).length) {
    throw new ServiceError(400, "No valid fields to update");
  }

  return data;
};

export const agentService = {
  async listAgents(userId: string, page?: number, limit?: number) {
    const { page: safePage, limit: safeLimit } = sanitizePagination(page, limit);
    const skip = (safePage - 1) * safeLimit;

    const [agents, total] = await Promise.all([
      prisma.agent.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: safeLimit,
      }),
      prisma.agent.count({ where: { userId } }),
    ]);

    return { agents, total, page: safePage, limit: safeLimit };
  },

  async getAgentById(userId: string, agentId: string): Promise<Agent> {
    return findAgentForUser(agentId, userId);
  },

  async createAgent(userId: string, payload: CreateAgentInput): Promise<Agent> {
    const data = sanitizeCreatePayload(payload);

    return prisma.agent.create({
      data: {
        ...data,
        description: data.description ?? null,
        userId,
      },
    });
  },

  async updateAgent(userId: string, agentId: string, payload: UpdateAgentInput): Promise<Agent> {
    await findAgentForUser(agentId, userId);
    const data = sanitizeUpdatePayload(payload);

    return prisma.agent.update({
      where: { id: agentId },
      data,
    });
  },

  async deleteAgent(userId: string, agentId: string) {
    await findAgentForUser(agentId, userId);

    await prisma.agent.delete({ where: { id: agentId } });
  },
};
