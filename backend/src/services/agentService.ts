import { Agent, CreateAgentInput } from '../types';

class AgentService {
  private agents: Agent[] = [];

  async listAgents(): Promise<Agent[]> {
    return this.agents;
  }

  async createAgent(input: CreateAgentInput): Promise<Agent> {
    const newAgent: Agent = {
      id: `agent_${Date.now()}`,
      name: input.name,
      description: input.description ?? '',
      voiceProfile: input.voiceProfile ?? 'default',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.agents.push(newAgent);
    return newAgent;
  }

  async getAgentById(id: string): Promise<Agent | undefined> {
    return this.agents.find((agent) => agent.id === id);
  }
}

export const agentService = new AgentService();
