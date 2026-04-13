import { describe, it, expect, beforeEach } from 'vitest';
import { RouterAgent } from '../lib/agents/router';
import { WeatherAgent, NewsAgent, GeneralAgent } from '../lib/agents/mocks';

describe('RouterAgent', () => {
  let router: RouterAgent;

  beforeEach(() => {
    router = new RouterAgent();
    router.registerAgent(new WeatherAgent());
    router.registerAgent(new NewsAgent());
    router.registerAgent(new GeneralAgent());
  });

  it('should route weather queries to WeatherAgent', async () => {
    const result = await router.handle('What is the weather today?');
    expect(result).toContain('[WeatherAgent]');
  });

  it('should route Chinese weather queries to WeatherAgent', async () => {
    const result = await router.handle('今天天气怎么样？');
    expect(result).toContain('[WeatherAgent]');
  });

  it('should route news queries to NewsAgent', async () => {
    const result = await router.handle('Show me the latest news');
    expect(result).toContain('[NewsAgent]');
  });

  it('should route general queries to GeneralAgent', async () => {
    const result = await router.handle('Tell me a joke');
    expect(result).toContain('[GeneralAgent]');
  });

  it('should fallback gracefully when no agent matches', async () => {
    const emptyRouter = new RouterAgent();
    const result = await emptyRouter.handle('What is the weather today?');
    expect(result).toBe("Sorry, I couldn't find an appropriate agent to handle your query.");
  });
});
