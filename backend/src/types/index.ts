export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
  metadata?: Record<string, unknown>;
}

export interface Agent {
  id: string;
  name: string;
  description?: string;
  voiceProfile: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAgentInput {
  name: string;
  description?: string;
  voiceProfile?: string;
}
