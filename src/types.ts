export type RiskLevel = 'Low' | 'Medium' | 'High';

export type VulnCategory =
  | 'sql-injection'
  | 'xss'
  | 'weak-password'
  | 'empty-field';

export type FieldName = 'username' | 'password';

export interface Vulnerability {
  id: string;
  name: string;
  severity: RiskLevel;
  category: VulnCategory;
  field: FieldName;
  description: string;
  prevention: string[];
  matchedPatterns?: string[];
}

export interface AnalysisResult {
  username: string;
  passwordMasked: string;
  riskLevel: RiskLevel;
  vulnerabilities: Vulnerability[];
  summary: string;
  analyzedAt: number;
}

export interface ExamplePayload {
  label: string;
  description: string;
  username: string;
  password: string;
}
