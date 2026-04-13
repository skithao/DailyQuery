import { Agent, AgentContext } from './types';

export class WeatherAgent implements Agent {
  name = 'WeatherAgent';
  description = 'Handles weather related queries.';

  async handle(query: string, _context?: AgentContext): Promise<string> {
    // In reality, this might use a Skill to fetch real weather data.
    return `[WeatherAgent] Handling query: ${query}`;
  }
}

export class NewsAgent implements Agent {
  name = 'NewsAgent';
  description = 'Handles news related queries.';

  async handle(query: string, _context?: AgentContext): Promise<string> {
    return `[NewsAgent] Handling query: ${query}`;
  }
}

export class GeneralAgent implements Agent {
  name = 'GeneralAgent';
  description = 'Handles general queries.';

  async handle(query: string, _context?: AgentContext): Promise<string> {
    return `[GeneralAgent] Handling query: ${query}`;
  }
}
