// Runtime self-test for the analyzer logic. Not part of the built app.
// Run with: node --experimental-strip-types --no-warnings scripts/selftest.ts
import { analyzeCredentials } from '../src/lib/analyzer.ts';

interface Case {
  name: string;
  u: string;
  p: string;
  expect: 'High' | 'Medium' | 'Low';
  expectCats: string[];
}

const cases: Case[] = [
  { name: 'SQL injection in password', u: 'admin', p: "' OR '1'='1", expect: 'High', expectCats: ['sql-injection'] },
  { name: 'XSS in username', u: "<script>alert('xss')</script>", p: 'Password123!', expect: 'High', expectCats: ['xss'] },
  { name: 'Weak dictionary password', u: 'jordan', p: 'password', expect: 'High', expectCats: ['weak-password'] },
  { name: 'Empty fields', u: '', p: '', expect: 'Low', expectCats: ['empty-field'] },
  { name: 'Clean input', u: 'alex.morgan', p: 'C0rrect-Horse-Battery-9!', expect: 'Low', expectCats: [] },
  { name: 'Short digit-only password', u: 'sam', p: '1234', expect: 'Medium', expectCats: ['weak-password'] },
  { name: 'Stacked query in username', u: "admin';--", p: 'C0rrect-Horse-Battery-9!', expect: 'High', expectCats: ['sql-injection'] },
];

let pass = 0;
let fail = 0;

for (const c of cases) {
  const r = analyzeCredentials(c.u, c.p);
  const cats = Array.from(new Set(r.vulnerabilities.map((v) => v.category)));
  const okRisk = r.riskLevel === c.expect;
  const okCats = cats.length === c.expectCats.length && c.expectCats.every((x) => cats.includes(x));
  if (okRisk && okCats) {
    console.log(`PASS  ${c.name} -> ${r.riskLevel}`);
    pass++;
  } else {
    console.log(`FAIL  ${c.name} -> got ${r.riskLevel} / [${cats.join(', ')}], expected ${c.expect} / [${c.expectCats.join(', ')}]`);
    fail++;
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
