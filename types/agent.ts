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
  browserMode?: "browserbase" | "local";
  isActive?: boolean;
  createdAt?: string | Date;
};

export type RoutineType = {
  id?: number;
  routineId: string;
  agentId: string;
  userEmail: string;
  title: string;
  prompt: string;
  frequency: string;
  scheduledTime: string;
  timezone: string;
  runType: "recurring" | "once";
  maxRuns?: number | null;
  currentRunCount?: number;
  daysOfWeek?: string | null;
  targetDate?: string | null;
  isActive: boolean;
  lastRunAt?: string | Date | null;
  createdAt?: string | Date;
};
