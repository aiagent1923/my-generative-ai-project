import { Router } from 'express';

import { authenticate } from '../middleware/auth';
import { agentService } from '../services/agentService';

const router = Router();

router.use(authenticate);

router.get('/', async (_req, res) => {
  const agents = await agentService.listAgents();
  res.json({ agents });
});

router.post('/', async (req, res) => {
  const agent = await agentService.createAgent(req.body);
  res.status(201).json({ agent });
});

router.get('/:id', async (req, res) => {
  const agent = await agentService.getAgentById(req.params.id);

  if (!agent) {
    return res.status(404).json({ message: 'Agent not found' });
  }

  res.json({ agent });
});

export default router;
