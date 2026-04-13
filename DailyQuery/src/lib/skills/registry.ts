import { Skill, UserSkill } from './types';
import { evaluateSecurity } from './security';

export class SkillRegistry {
  private skills: Map<string, Skill> = new Map();

  register(skill: Skill) {
    if (this.skills.has(skill.name)) {
      throw new Error(`Skill with name ${skill.name} is already registered.`);
    }
    this.skills.set(skill.name, skill);
  }

  registerUserSkill(name: string, description: string, code: string): UserSkill {
    if (this.skills.has(name)) {
      throw new Error(`Skill with name ${name} is already registered.`);
    }

    const securityCheck = evaluateSecurity(code);
    if (!securityCheck.isSafe) {
      throw new Error(`Security evaluation failed: ${securityCheck.reason}`);
    }

    const userSkill: UserSkill = {
      name,
      description,
      code,
      isSafe: true,
      execute: async (params: Record<string, unknown>) => {
        // Execute the code in a constrained environment
        // For actual production use, an AST parser (like acorn) + interpreter (like JS-Interpreter)
        // or a real sandbox like Node's vm or QuickJS is recommended.
        // We wrap the user code inside an async IIFE and pass `params` as a local variable.
        
        try {
          const fn = new Function('params', `
            "use strict";
            return (async () => {
              ${code}
            })();
          `);
          return await fn(params);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`Error executing user skill ${name}: ${errorMessage}`);
        }
      }
    };

    this.skills.set(name, userSkill);
    return userSkill;
  }

  getSkill(name: string): Skill | undefined {
    return this.skills.get(name);
  }

  getAllSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  removeSkill(name: string) {
    this.skills.delete(name);
  }
}
