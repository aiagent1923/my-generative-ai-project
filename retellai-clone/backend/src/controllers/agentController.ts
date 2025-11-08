import { Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth";
import { agentService } from "../services/agentService";
import { ServiceError } from "../utils/errors";

const normalizeQueryParam = (value: unknown): string | undefined => {
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

const parsePositiveInt = (value: unknown, fallback: number) => {
  const normalized = normalizeQueryParam(value);
  const parsed = normalized ? Number(normalized) : Number.NaN;

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.floor(parsed);
};

const handleError = (res: Response, error: unknown, fallbackStatus: number, fallbackMessage: string) => {
  if (error instanceof ServiceError) {
    return res.status(error.status).json({ message: error.message });
  }

  return res.status(fallbackStatus).json({ message: fallbackMessage });
};

export const getAgents = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Authorization required" });
    }

    const page = parsePositiveInt(req.query.page, 1);
    const limit = parsePositiveInt(req.query.limit, 10);

    const result = await agentService.listAgents(userId, page, limit);

    return res.json(result);
  } catch (error) {
    return handleError(res, error, 500, "Unable to fetch agents");
  }
};

export const getAgentById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id: agentId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Authorization required" });
    }

    if (!agentId) {
      return res.status(400).json({ message: "Agent ID is required" });
    }

    const agent = await agentService.getAgentById(userId, agentId);

    return res.json({ agent });
  } catch (error) {
    return handleError(res, error, 404, "Agent could not be found");
  }
};

export const createAgent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Authorization required" });
    }

    const { name, description, voiceModel } = req.body as {
      name?: string;
      description?: string;
      voiceModel?: string;
    };

    const agent = await agentService.createAgent(userId, {
      name: name ?? "",
      description,
      voiceModel: voiceModel ?? "",
    });

    return res.status(201).json({ agent });
  } catch (error) {
    return handleError(res, error, 400, "Unable to create agent");
  }
};

export const updateAgent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id: agentId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Authorization required" });
    }

    if (!agentId) {
      return res.status(400).json({ message: "Agent ID is required" });
    }

    const { name, description, voiceModel } = req.body as {
      name?: string;
      description?: string | null;
      voiceModel?: string;
    };

    const agent = await agentService.updateAgent(userId, agentId, {
      name,
      description,
      voiceModel,
    });

    return res.json({ agent });
  } catch (error) {
    return handleError(res, error, 400, "Unable to update agent");
  }
};

export const deleteAgent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id: agentId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Authorization required" });
    }

    if (!agentId) {
      return res.status(400).json({ message: "Agent ID is required" });
    }

    await agentService.deleteAgent(userId, agentId);

    return res.json({ message: "Agent deleted successfully" });
  } catch (error) {
    return handleError(res, error, 400, "Unable to delete agent");
  }
};
