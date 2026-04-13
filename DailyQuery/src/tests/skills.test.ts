import { describe, it, expect, beforeEach } from 'vitest';
import { SkillRegistry } from '../lib/skills/registry';
import { evaluateSecurity } from '../lib/skills/security';

describe('Skill Security Evaluation', () => {
  it('should pass safe code', () => {
    const code = `return params.a + params.b;`;
    const result = evaluateSecurity(code);
    expect(result.isSafe).toBe(true);
  });

  it('should block fs keyword', () => {
    const code = `const fs = require('fs'); fs.readFileSync('/etc/passwd');`;
    const result = evaluateSecurity(code);
    expect(result.isSafe).toBe(false);
    expect(result.reason).toContain('fs');
  });

  it('should block child_process keyword', () => {
    const code = `const cp = require('child_process'); cp.exec('rm -rf /');`;
    const result = evaluateSecurity(code);
    expect(result.isSafe).toBe(false);
    expect(result.reason).toContain('child_process');
  });

  it('should block infinite loops', () => {
    const code = `while (true) { console.log("loop"); }`;
    const result = evaluateSecurity(code);
    expect(result.isSafe).toBe(false);
    expect(result.reason).toContain('infinite loop');
  });
});

describe('SkillRegistry', () => {
  let registry: SkillRegistry;

  beforeEach(() => {
    registry = new SkillRegistry();
  });

  it('should register and execute a safe user skill', async () => {
    const skill = registry.registerUserSkill(
      'add',
      'Adds two numbers',
      'return params.a + params.b;'
    );

    expect(skill.isSafe).toBe(true);
    const result = await skill.execute({ a: 5, b: 10 });
    expect(result).toBe(15);
  });

  it('should reject unsafe user skill during registration', () => {
    expect(() => {
      registry.registerUserSkill(
        'hack',
        'Tries to read file',
        'const fs = require("fs"); return fs.readFileSync("secret.txt");'
      );
    }).toThrow(/Security evaluation failed/);
  });

  it('should register standard skill', async () => {
    registry.register({
      name: 'hello',
      description: 'Says hello',
      execute: async (params) => `Hello ${params.name}`
    });

    const skill = registry.getSkill('hello');
    expect(skill).toBeDefined();
    
    if (skill) {
      const result = await skill.execute({ name: 'World' });
      expect(result).toBe('Hello World');
    }
  });
});
