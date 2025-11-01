export interface Repo {
  url: string;
  files: string[];
  detectedTech: string[];
}

export interface AISummary {
  overview: string;
  risks: string[];
}

export interface SuggestedTest {
  id: number;
  name: string;
  function: string;
  type: 'unit' | 'integration' | 'negative' | 'edge';
  complexity: 'S' | 'M' | 'L';
  selected: boolean;
}

export interface RunResult {
  id: number;
  name: string;
  status: 'running' | 'pass' | 'fail';
  timeMs: number | null;
  error?: string;
  log: string;
  branch?: string;
  author?: string;
  executedAt?: string;
  aiSuggestion?: AIExplain;
}

export interface Run {
  total: number;
  passed: number;
  failed: number;
  durationMs: number;
  results: RunResult[];
}

export interface AIExplain {
  name: string;
  cause: string;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
}

export interface HistoryItem {
  runId: string;
  tests: number;
  pass: number;
  fail: number;
  duration: string;
  date: string;
}