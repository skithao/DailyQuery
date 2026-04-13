export interface SkillContext {
  [key: string]: unknown;
}

export interface Skill {
  name: string;
  description: string;
  execute(params: Record<string, unknown>, context?: SkillContext): Promise<unknown>;
}

export interface UserSkill extends Skill {
  code: string;
  isSafe: boolean;
}
