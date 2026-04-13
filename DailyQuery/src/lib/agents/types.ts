export interface AgentContext {
  [key: string]: unknown;
}

export interface Agent {
  name: string;
  description: string;
  handle(query: string, context?: AgentContext): Promise<string>;
}
