export type StagePhase = 1 | 2 | 3 | 4 | 5 | 6;

export interface BotAgent {
  id: string;
  name: string;
  role: string;
  model: string;
  color: string;
  badge: string;
  status: "idle" | "running" | "scheduled";
  runtime: string;
}

export interface VmLogEntry {
  id: string;
  timestamp: string;
  type: "info" | "success" | "warn" | "exec";
  text: string;
}
