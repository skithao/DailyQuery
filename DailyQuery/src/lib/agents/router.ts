import { Agent, AgentContext } from './types';

export class RouterAgent implements Agent {
  name = 'RouterAgent';
  description = 'Routes user queries to the most appropriate specific agent.';
  
  private agents: Map<string, Agent> = new Map();

  registerAgent(agent: Agent) {
    this.agents.set(agent.name, agent);
  }

  // A very basic keyword-based routing logic (Simulating an LLM intent classifier)
  async routeQuery(query: string): Promise<Agent | null> {
    const q = query.toLowerCase();
    
    // Naive intent routing. In a real-world scenario like HermesAgent, 
    // this would be an LLM API call classifying the intent against agent descriptions.
    if (q.includes('weather') || q.includes('tianqi') || q.includes('天气')) {
      return this.agents.get('WeatherAgent') || null;
    }
    
    if (q.includes('news') || q.includes('xinwen') || q.includes('新闻')) {
      return this.agents.get('NewsAgent') || null;
    }

    // Default to GeneralAgent if available
    return this.agents.get('GeneralAgent') || null;
  }

  async handle(query: string, context?: AgentContext): Promise<string> {
    const targetAgent = await this.routeQuery(query);
    if (!targetAgent) {
      return "Sorry, I couldn't find an appropriate agent to handle your query.";
    }

    // Pass to the routed agent
    return await targetAgent.handle(query, context);
  }
}
