import type {
  AnalysisResult,
  ExamplePayload,
  FieldName,
  RiskLevel,
  Vulnerability,
} from '@/types';

/* ----------------------------- Detection rules ----------------------------- */

const SQLI_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /\b(or|and)\b\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?/i, label: 'Boolean condition (OR/AND ... = ...)' },
  { re: /['"]\s*(or|and)\b/i, label: 'Quote followed by OR/AND' },
  { re: /\bunion\s+select\b/i, label: 'UNION SELECT' },
  { re: /\bdrop\s+table\b/i, label: 'DROP TABLE' },
  { re: /\binsert\s+into\b/i, label: 'INSERT INTO' },
  { re: /\bdelete\s+from\b/i, label: 'DELETE FROM' },
  { re: /\bselect\b[\s\S]*\bfrom\b/i, label: 'SELECT ... FROM' },
  { re: /\bupdate\b[\s\S]*\bset\b/i, label: 'UPDATE ... SET' },
  { re: /--/, label: 'Line comment (--)' },
  { re: /\/\*[\s\S]*?\*\//, label: 'Block comment (/* */)' },
  { re: /['"]\s*#|#\s*$/, label: 'Hash comment (#)' },
  { re: /;\s*(select|insert|update|delete|drop|union|exec)\b/i, label: 'Stacked query (; ...)' },
  { re: /\bexec\b|\bxp_\w+/i, label: 'Stored-procedure call' },
  { re: /['"]\s*;\s*['"]?/, label: 'Quote-semicolon breakout' },
  { re: /['"]\s*=\s*['"]?/, label: 'Quote-equals comparison' },
];

const XSS_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /<\s*script\b/i, label: '<script> tag' },
  { re: /<\s*\/\s*script\s*>/i, label: '</script> tag' },
  { re: /javascript:\s*/i, label: 'javascript: URI' },
  {
    re: /\bon(error|load|click|mouseover|mouseout|focus|blur|submit|toggle|change|animationstart)\s*=/i,
    label: 'Inline event handler (onerror, onclick, ...)',
  },
  { re: /<\s*(iframe|svg|object|embed|body|details|img|video|audio|marquee)\b/i, label: 'Embeddable HTML element' },
  { re: /\balert\s*\(/i, label: 'alert() call' },
  { re: /\bprompt\s*\(|\bconfirm\s*\(/i, label: 'prompt()/confirm() call' },
  { re: /\b(document\.cookie|document\.location|window\.location|document\.write)\b/i, label: 'Sensitive DOM access' },
  { re: /\beval\s*\(/i, label: 'eval() call' },
  { re: /<\s*img[^>]*\bsrc\s*=/i, label: '<img src=...>' },
];

const COMMON_PASSWORDS = new Set([
  'password', '123456', '12345678', '123456789', 'qwerty', 'admin', 'letmein',
  'welcome', 'monkey', 'dragon', 'iloveyou', 'abc123', '111111', '000000',
  'password1', '1234567', '12345', 'pass', 'root', 'toor', '123123',
  'football', 'baseball', 'master', 'sunshine', 'princess', 'login',
  'starwars', 'trustno1', 'hello', 'freedom', 'whatever', 'shadow', 'superman',
]);

/* ------------------------------- Prevention -------------------------------- */

const SQLI_PREVENTION = [
  'Use parameterized queries / prepared statements instead of string concatenation.',
  'Adopt an ORM or query builder that binds parameters automatically.',
  'Validate input against an allowlist of expected characters and lengths.',
  'Run the database account with least privilege — no DROP/ALTER from the app.',
  'Never rely on client-side validation alone; enforce checks on the server.',
];

const XSS_PREVENTION = [
  'Escape output for its context (HTML body, attribute, JavaScript, or URL).',
  'Prefer textContent over innerHTML when inserting user data into the DOM.',
  'Set a strict Content-Security-Policy header (no unsafe-inline).',
  'Sanitize rich text with a vetted library such as DOMPurify.',
  'Mark session cookies as HttpOnly and Secure so scripts cannot read them.',
];

const WEAK_PREVENTION = [
  'Require at least 12 characters mixing upper, lower, digits, and symbols.',
  'Reject passwords found in breach / common-password dictionaries.',
  'Avoid names, dates, and keyboard sequences.',
  'Use a password manager to generate and store unique credentials.',
  'Enable multi-factor authentication for an extra layer of defense.',
];

const EMPTY_PREVENTION = [
  'Mark required fields and validate them on both client and server.',
  'Return a generic error without revealing which field failed.',
  'Trim whitespace before checking for emptiness.',
];

/* ------------------------------- Utilities --------------------------------- */

const SEVERITY_ORDER: Record<RiskLevel, number> = { Low: 1, Medium: 2, High: 3 };

function maxSeverity(a: RiskLevel, b: RiskLevel): RiskLevel {
  return SEVERITY_ORDER[a] >= SEVERITY_ORDER[b] ? a : b;
}

function computeRisk(vulns: Vulnerability[]): RiskLevel {
  if (vulns.length === 0) return 'Low';
  return vulns.reduce<RiskLevel>((acc, v) => maxSeverity(acc, v.severity), 'Low');
}

export function maskPassword(password: string): string {
  if (password.length === 0) return '';
  if (password.length <= 2) return '•'.repeat(password.length);
  return `${password[0]}${'•'.repeat(Math.min(password.length - 2, 10))}${password[password.length - 1]}`;
}

function joinReasons(reasons: string[]): string {
  if (reasons.length === 1) return reasons[0];
  if (reasons.length === 2) return `${reasons[0]} and ${reasons[1]}`;
  return `${reasons.slice(0, -1).join(', ')}, and ${reasons[reasons.length - 1]}`;
}

/* ------------------------------ Detectors ---------------------------------- */

function detectSqlInjection(input: string, field: FieldName): Vulnerability[] {
  if (input.length === 0) return [];
  const matched = SQLI_PATTERNS.filter((p) => p.re.test(input)).map((p) => p.label);
  if (matched.length === 0) return [];
  return [
    {
      id: `sqli-${field}`,
      name: 'SQL Injection',
      severity: 'High',
      category: 'sql-injection',
      field,
      description: `The ${field} contains SQL syntax (${matched.join(', ')}). Concatenated into a query, this input can bypass authentication, exfiltrate data, or destroy tables.`,
      prevention: SQLI_PREVENTION,
      matchedPatterns: matched,
    },
  ];
}

function detectXss(input: string, field: FieldName): Vulnerability[] {
  if (input.length === 0) return [];
  const matched = XSS_PATTERNS.filter((p) => p.re.test(input)).map((p) => p.label);
  if (matched.length === 0) return [];
  return [
    {
      id: `xss-${field}`,
      name: 'Cross-Site Scripting (XSS)',
      severity: 'High',
      category: 'xss',
      field,
      description: `The ${field} contains markup or JavaScript (${matched.join(', ')}). Reflected into a page unescaped, it can steal sessions or hijack accounts in another user's browser.`,
      prevention: XSS_PREVENTION,
      matchedPatterns: matched,
    },
  ];
}

function detectWeakPassword(password: string): Vulnerability[] {
  if (password.length === 0) return [];
  const reasons: string[] = [];
  let severity: RiskLevel = 'Low';

  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    reasons.push('appears in common-password dictionaries');
    severity = maxSeverity(severity, 'High');
  }
  if (password.length < 8) {
    reasons.push(`only ${password.length} character${password.length === 1 ? '' : 's'} (use 12+)`);
    severity = maxSeverity(severity, 'Medium');
  }
  if (/^\d+$/.test(password)) {
    reasons.push('digits only — no letters or symbols');
    severity = maxSeverity(severity, 'Medium');
  }
  if (/^[a-z]+$/.test(password)) {
    reasons.push('lowercase letters only — no numbers or symbols');
    severity = maxSeverity(severity, 'Medium');
  }
  if (/^[^a-zA-Z0-9]+$/.test(password)) {
    reasons.push('symbols only — no alphanumeric characters');
    severity = maxSeverity(severity, 'Medium');
  }
  if (/^(.)\1+$/.test(password)) {
    reasons.push('a single repeated character');
    severity = maxSeverity(severity, 'High');
  }
  if (/(0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|qwerty|asdf|zxcv)/i.test(password)) {
    reasons.push('contains a common keyboard/number sequence');
    severity = maxSeverity(severity, 'Medium');
  }

  if (reasons.length === 0) return [];
  return [
    {
      id: 'weak-password',
      name: 'Weak Password',
      severity,
      category: 'weak-password',
      field: 'password',
      description: `The password is easy to crack because it ${joinReasons(reasons)}. Automated tooling can guess weak credentials in seconds.`,
      prevention: WEAK_PREVENTION,
      matchedPatterns: reasons,
    },
  ];
}

function detectEmptyFields(username: string, password: string): Vulnerability[] {
  const vulns: Vulnerability[] = [];
  if (username.trim().length === 0) {
    vulns.push({
      id: 'empty-username',
      name: 'Empty Username',
      severity: 'Low',
      category: 'empty-field',
      field: 'username',
      description: 'No username was supplied. A real login must enforce required fields on the server, otherwise attackers can probe the handler with partial or missing data.',
      prevention: EMPTY_PREVENTION,
    });
  }
  if (password.length === 0) {
    vulns.push({
      id: 'empty-password',
      name: 'Empty Password',
      severity: 'Low',
      category: 'empty-field',
      field: 'password',
      description: 'No password was supplied. An empty password should be rejected server-side with a generic message, never a hint about which field was wrong.',
      prevention: EMPTY_PREVENTION,
    });
  }
  return vulns;
}

/* ------------------------------- Summary ----------------------------------- */

function buildSummary(risk: RiskLevel, vulns: Vulnerability[]): string {
  if (vulns.length === 0) {
    return 'No common vulnerabilities detected. The input is clean and the password is reasonably strong. Keep following the best practices below.';
  }
  const high = vulns.filter((v) => v.severity === 'High').length;
  const medium = vulns.filter((v) => v.severity === 'Medium').length;
  const low = vulns.filter((v) => v.severity === 'Low').length;
  const parts: string[] = [];
  if (high) parts.push(`${high} high-severity`);
  if (medium) parts.push(`${medium} medium-severity`);
  if (low) parts.push(`${low} low-severity`);
  const label =
    risk === 'High'
      ? 'Dangerous input that could compromise a real backend.'
      : risk === 'Medium'
        ? 'Input with real weaknesses that should be fixed.'
        : 'Only minor issues found, but worth addressing.';
  return `Detected ${parts.join(', ')} issue${vulns.length === 1 ? '' : 's'}. ${label}`;
}

/* ------------------------------- Public API -------------------------------- */

export function analyzeCredentials(username: string, password: string): AnalysisResult {
  const vulnerabilities: Vulnerability[] = [];
  vulnerabilities.push(...detectEmptyFields(username, password));
  vulnerabilities.push(...detectSqlInjection(username, 'username'));
  vulnerabilities.push(...detectSqlInjection(password, 'password'));
  vulnerabilities.push(...detectXss(username, 'username'));
  vulnerabilities.push(...detectXss(password, 'password'));
  vulnerabilities.push(...detectWeakPassword(password));

  const riskLevel = computeRisk(vulnerabilities);
  return {
    username,
    passwordMasked: maskPassword(password),
    riskLevel,
    vulnerabilities,
    summary: buildSummary(riskLevel, vulnerabilities),
    analyzedAt: Date.now(),
  };
}

export const EXAMPLES: ExamplePayload[] = [
  { label: 'SQL Injection', description: 'Auth-bypass payload', username: 'admin', password: "' OR '1'='1" },
  { label: 'XSS', description: 'Script tag in username', username: "<script>alert('xss')</script>", password: 'Password123!' },
  { label: 'Weak Password', description: 'Dictionary password', username: 'jordan', password: 'password' },
  { label: 'Empty Fields', description: 'Submit with nothing', username: '', password: '' },
  { label: 'Clean Input', description: 'Strong, safe credentials', username: 'alex.morgan', password: 'C0rrect-Horse-Battery-9!' },
];
