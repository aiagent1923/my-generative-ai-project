export interface Agent {
  id: string;
  name: string;
  description?: string | null;
  voiceModel?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CallSession {
  id: string;
  agentId: string;
  startedAt: Date;
  endedAt?: Date | null;
  transcript?: string | null;
}
