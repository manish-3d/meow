export type AgentConfigType = {
  id?: number;
  agentId: string;
  name: string;
  description?: string | null;
  agentImage?: string | null;
  userEmail: string;
  createdAt?: string | Date;
};
