// Custom Agent types

export type ExecutionMode = 'confirm' | 'auto' | 'skip';

export interface CustomAgent {
  id: string;
  name: string;
  description?: string;
  instruction?: string;
  knowledge?: string;
  config?: AgentConfig;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentConfig {
  scheduleEnabled?: boolean;
  schedulePattern?: string; // cron pattern
  dataRangeEnabled?: boolean;
  dataSourceIds?: string[];
  mcpEnabled?: boolean;
  textReportEnabled?: boolean;
  webReportEnabled?: boolean;

  // Execution settings
  executionPlan?: ExecutionMode;
  executeSql?: ExecutionMode;
  outputReport?: ExecutionMode;
  askDuringProcess?: ExecutionMode;
}

export interface CreateAgentRequest {
  name: string;
  description?: string;
  instruction?: string;
  knowledge?: string;
  config?: AgentConfig;
}

export interface UpdateAgentRequest {
  name?: string;
  description?: string;
  instruction?: string;
  knowledge?: string;
  config?: AgentConfig;
  isPublished?: boolean;
}

export interface AgentExecutionRequest {
  agentId: string;
  sessionId?: string;
  input?: string;
  dataSourceIds?: string[];
}

export interface AgentExecutionStatus {
  status: 'running' | 'completed' | 'error' | 'waiting_confirmation';
  currentStep?: string;
  progress?: number;
  result?: string;
  error?: string;
}
