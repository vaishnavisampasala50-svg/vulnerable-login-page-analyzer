import { Database, Code2, KeyRound, CircleSlash, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Tip {
  icon: LucideIcon;
  title: string;
  accent: string;
  points: string[];
}

const TIPS: Tip[] = [
  {
    icon: Database,
    title: 'Stop SQL Injection',
    accent: 'text-cyan-400',
    points: [
      'Always use parameterized queries or prepared statements.',
      'Use an ORM or query builder that binds values automatically.',
      'Validate input server-side against an allowlist of characters.',
    ],
  },
  {
    icon: Code2,
    title: 'Prevent XSS',
    accent: 'text-sky-400',
    points: [
      'Escape output for its context (HTML, attribute, JS, or URL).',
      'Prefer textContent over innerHTML for user data.',
      'Set a strict Content-Security-Policy header.',
    ],
  },
  {
    icon: KeyRound,
    title: 'Enforce Strong Passwords',
    accent: 'text-emerald-400',
    points: [
      'Require 12+ characters mixing upper, lower, digits, symbols.',
      'Reject passwords from common / breach dictionaries.',
      'Offer multi-factor authentication wherever possible.',
    ],
  },
  {
    icon: CircleSlash,
    title: 'Handle Empty Input',
    accent: 'text-amber-400',
    points: [
      'Mark required fields and validate on both client and server.',
      'Return a generic error — never reveal which field failed.',
      'Trim whitespace before any emptiness check.',
    ],
  },
];

export function SecurityTips() {
  return (
    <section className="glass animate-fade-up p-6 sm:p-8" aria-labelledby="tips-heading">
      <div className="mb-5 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-cyan-400" aria-hidden />
        <h3 id="tips-heading" className="text-base font-semibold text-slate-100">
          Security Tips &amp; Prevention
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {TIPS.map((tip, i) => {
          const Icon = tip.icon;
          return (
            <div
              key={tip.title}
              className="group rounded-xl border border-white/10 bg-cyber-700/30 p-4 transition-all duration-200 hover:border-white/20 hover:bg-cyber-700/50 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 ${tip.accent}`}>
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <h4 className="text-sm font-semibold text-slate-100">{tip.title}</h4>
              </div>
              <ul className="space-y-2">
                {tip.points.map((point) => (
                  <li key={point} className="flex gap-2 text-xs leading-relaxed text-slate-300">
                    <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${tip.accent.replace('text-', 'bg-')}`} aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="mt-5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed text-amber-200/80">
        <strong className="font-semibold text-amber-300">Educational notice:</strong> This tool intentionally
        simulates a vulnerable login form for learning purposes only. Never deploy login logic that trusts
        unsanitized user input in production.
      </p>
    </section>
  );
}
