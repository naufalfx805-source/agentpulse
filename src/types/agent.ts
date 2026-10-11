export type AgentStatus = 'idle' | 'running' | 'passed' | 'failed' | 'healing';

export interface AgentPipelineStep {
  id: string;
  name: string;
  type: 'prompt' | 'tool_call' | 'code_gen' | 'assertion' | 'verification';
  status: 'pending' | 'running' | 'success' | 'failed';
  durationMs?: number;
  output?: string;
  error?: string;
}

export interface AgentPipeline {
  id: string;
  name: string;
  agentModel: string;
  targetEnv: 'production' | 'staging' | 'local';
  tokenBudget: number;
  timeoutSeconds: number;
  status: AgentStatus;
  lastRunAt: string;
  steps: AgentPipelineStep[];
  successRate: number;
  healingAttempts: number;
}

export interface TestScenario {
  id: string;
  title: string;
  category: 'e2e' | 'api' | 'security' | 'regression' | 'flakiness';
  targetPath: string;
  expectedStatus: number;
  assertions: {
    field: string;
    operator: 'equals' | 'contains' | 'less_than' | 'regex';
    expected: string;
  }[];
  lastStatus: 'passed' | 'failed' | 'flaky';
  durationMs: number;
  flakinessScore: number; // 0 to 100%
  description: string;
}

export interface VerificationEvent {
  id: string;
  timestamp: string;
  pipelineId: string;
  pipelineName: string;
  eventType: 'run_started' | 'assertion_failed' | 'self_healed' | 'run_passed' | 'rate_limited';
  severity: 'info' | 'warning' | 'error' | 'success';
  message: string;
  details?: string;
}

export interface ChaosConfig {
  latencyMs: number;
  failureRate: number; // 0 to 100%
  rateLimitEnabled: boolean;
  simulateFlakyNetwork: boolean;
  injectedErrorCode: number;
}
