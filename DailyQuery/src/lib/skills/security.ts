// A simple static analyzer for user-provided JavaScript code
const DANGEROUS_KEYWORDS = [
  'fs', 'child_process', 'os', 'path', 'crypto', 'vm', 'worker_threads',
  'eval', 'Function', 'setTimeout', 'setInterval', 'fetch', 'XMLHttpRequest',
  'process', 'global', 'window', 'document', 'require', 'import'
];

export interface SecurityEvaluationResult {
  isSafe: boolean;
  reason?: string;
}

export function evaluateSecurity(code: string): SecurityEvaluationResult {
  // Basic static analysis to detect forbidden keywords
  // This is a naive implementation; a real-world scenario would use an AST parser like Acorn.
  for (const keyword of DANGEROUS_KEYWORDS) {
    // Check if the keyword exists as a whole word
    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
    if (regex.test(code)) {
      return { isSafe: false, reason: `Code contains forbidden keyword: ${keyword}` };
    }
  }

  // Check for potentially harmful patterns like infinite loops or long iterations
  if (/while\s*\(\s*true\s*\)/.test(code)) {
    return { isSafe: false, reason: 'Code contains potentially infinite loop (while true)' };
  }

  return { isSafe: true };
}
