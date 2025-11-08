import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../middleware/auth";

export const startCallSession = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({ message: "agentId is required" });
    }

    const callSession = await prisma.callSession.create({
      data: {
        agentId,
      },
    });

    return res.status(201).json({ callSession });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to start call session",
    });
  }
};

export const endCallSession = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { sessionId, transcript } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "sessionId is required" });
    }

    const callSession = await prisma.callSession.update({
      where: { id: sessionId },
      data: {
        endedAt: new Date(),
        transcript,
      },
    });

    return res.json({ callSession });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Failed to end call session",
    });
  }
};
