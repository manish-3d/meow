export type AgentConfigType = {
  id?: number;
  agentId: string;
  name: string;
  description?: string | null;
  agentImage?: string | null;
  userEmail: string;
  daytonaSandboxId?: string | null;
  e2bSandboxId?: string | null;
  vmStatus?: "active" | "paused" | "inactive";
  vmLastActive?: string | Date | null;
  isActive?: boolean;
  createdAt?: string | Date;
};
