import { useEffect, useState } from 'react';
import { ChevronDown, ShieldX, ShieldCheck, ShieldAlert, Lightbulb, X } from 'lucide-react';
import type { AnalysisResult, Vulnerability } from '@/types';
import { riskStyles, categoryIcon } from '@/lib/theme';

interface ResultsPanelProps {
  result: AnalysisResult;
  onClear: () => void;
}

const riskGaugeColor: Record<string, string> = {
  Low: 'from-emerald-500 to-emerald-400',
  Medium: 'from-amber-500 to-amber-400',
  High: 'from-red-500 to-red-400',
};

const riskIcon: Record<string, typeof ShieldX> = {
  Low: ShieldCheck,
  Medium: ShieldAlert,
  High: ShieldX,
};

function VulnerabilityCard({ vuln, index }: { vuln: Vulnerability; index: number }) {
  const [open, setOpen] = useState(false);
  const styles = riskStyles[vuln.severity];
  const Icon = categoryIcon[vuln.category];

  return (
    <div
      className={`glass animate-fade-up overflow-hidden border ${styles.border} ${styles.bg}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-white/5"
      >
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${styles.bg} ${styles.text}`}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-semibold text-slate-100">{vuln.name}</h4>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles.bg} ${styles.text}`}>
              {vuln.severity}
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs text-slate-400">
            in <span className="font-mono text-slate-300">{vuln.field}</span>
            {vuln.matchedPatterns && vuln.matchedPatterns.length > 0 && (
              <> · {vuln.matchedPatterns[0]}</>
            )}
          </p>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <div className="border-t border-white/10 p-4 animate-fade-in">
          <p className="text-sm leading-relaxed text-slate-300">{vuln.description}</p>

          {vuln.matchedPatterns && vuln.matchedPatterns.length > 0 && (
            <div className="mt-3">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Matched patterns</p>
              <div className="flex flex-wrap gap-1.5">
                {vuln.matchedPatterns.map((p) => (
                  <code
                    key={p}
                    className="rounded bg-cyber-950/80 px-2 py-0.5 font-mono text-[11px] text-cyan-300 ring-1 ring-white/10"
                  >
                    {p}
                  </code>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
            <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-cyan-300">
              <Lightbulb className="h-3.5 w-3.5" aria-hidden />
              Prevention
            </p>
            <ul className="space-y-1.5">
              {vuln.prevention.map((tip) => (
                <li key={tip} className="flex gap-2 text-xs leading-relaxed text-slate-300">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-400" aria-hidden />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function Gauge({ level, value }: { level: string; value: number }) {
  const Icon = riskIcon[level];
  return (
    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120" aria-hidden>
        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className={`stroke-current ${riskStyles[level as keyof typeof riskStyles].text}`}
          style={{
            strokeDasharray: 2 * Math.PI * 52,
            strokeDashoffset: 2 * Math.PI * 52 * (1 - value / 100),
            transition: 'stroke-dashoffset 0.9s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </svg>
      <div className="flex flex-col items-center">
        <Icon className={`h-7 w-7 ${riskStyles[level as keyof typeof riskStyles].text}`} aria-hidden />
        <span className={`mt-1 text-xl font-bold ${riskStyles[level as keyof typeof riskStyles].text}`}>{level}</span>
        <span className="text-[10px] uppercase tracking-wider text-slate-500">Risk</span>
      </div>
    </div>
  );
}

export function ResultsPanel({ result, onClear }: ResultsPanelProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const riskPercent = result.riskLevel === 'High' ? 88 : result.riskLevel === 'Medium' ? 55 : 18;
  const styles = riskStyles[result.riskLevel];

  return (
    <section
      ref={(el) => {
        if (el && mounted) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }}
      className="glass animate-fade-up overflow-hidden"
      aria-live="polite"
    >
      <div className="relative border-b border-white/10 p-5 sm:p-6">
        <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${riskGaugeColor[result.riskLevel]}`} />
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-1 items-center gap-5">
            <Gauge level={result.riskLevel} value={riskPercent} />
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-slate-100">Analysis Result</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{result.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-md bg-cyber-700/60 px-2 py-1 font-mono text-slate-300">
                  user: <span className="text-slate-100">{result.username || '—'}</span>
                </span>
                <span className="rounded-md bg-cyber-700/60 px-2 py-1 font-mono text-slate-300">
                  pass: <span className="text-slate-100">{result.passwordMasked || '—'}</span>
                </span>
                <span className={`rounded-md px-2 py-1 font-mono ${styles.bg} ${styles.text}`}>
                  {result.vulnerabilities.length} finding{result.vulnerabilities.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClear}
            aria-label="Dismiss result"
            className="shrink-0 rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <div className="max-h-[520px] space-y-3 overflow-y-auto p-5 sm:p-6">
        {result.vulnerabilities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
            <ShieldCheck className="h-12 w-12 text-emerald-400" aria-hidden />
            <h4 className="mt-3 text-base font-semibold text-slate-100">No vulnerabilities detected</h4>
            <p className="mt-1 max-w-sm text-sm text-slate-400">
              The input is clean and the password is reasonably strong. Keep following the best practices in the Security Tips below.
            </p>
          </div>
        ) : (
          result.vulnerabilities.map((v, i) => <VulnerabilityCard key={v.id} vuln={v} index={i} />)
        )}
      </div>
    </section>
  );
}
