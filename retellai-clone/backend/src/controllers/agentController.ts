import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { agentService } from "../services/agentService";

export const getAgents = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const agents = await agentService.listAgents(userId);
    return res.json({ agents });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch agents" });
  }
};

export const createAgent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const agent = await agentService.createAgent(userId, req.body);
    return res.status(201).json({ agent });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to create agent",
    });
  }
};
