import { useCallback, useMemo, useState } from 'react';
import { Shield, ShieldHalf, Github, Terminal, Activity } from 'lucide-react';
import { LoginForm } from '@/components/LoginForm';
import { ResultsPanel } from '@/components/ResultsPanel';
import { SecurityTips } from '@/components/SecurityTips';
import { analyzeCredentials } from '@/lib/analyzer';
import type { AnalysisResult } from '@/types';

export default function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = useCallback((username: string, password: string) => {
    setIsAnalyzing(true);
    // Brief delay so the analyzing state is perceptible, then run the (instant) analysis.
    window.setTimeout(() => {
      setResult(analyzeCredentials(username, password));
      setIsAnalyzing(false);
    }, 480);
  }, []);

  const handleClear = useCallback(() => setResult(null), []);

  const findingCount = result?.vulnerabilities.length ?? 0;
  const highCount = useMemo(
    () => result?.vulnerabilities.filter((v) => v.severity === 'High').length ?? 0,
    [result],
  );

  return (
    <div className="cyber-bg relative min-h-screen overflow-hidden">
      {/* Animated grid */}
      <div className="pointer-events-none absolute inset-0 cyber-grid animate-grid-move opacity-60" aria-hidden />
      {/* Floating orbs */}
      <div
        className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl animate-float"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 top-1/2 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl animate-float"
        style={{ animationDelay: '2s' }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-10">
        {/* Header */}
        <header className="mb-8 flex flex-col items-center text-center animate-fade-up">
          <div className="mb-4 flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-cyan-400/30 blur-xl animate-glow-pulse" aria-hidden />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyber-800/80 shadow-lg shadow-cyan-500/20">
                <Shield className="h-7 w-7 text-cyan-400" aria-hidden />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">
                Sentinel
              </h1>
              <p className="font-mono text-xs text-cyan-400/80">Vulnerable Login Analyzer</p>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-slate-400">
            An interactive, educational tool that simulates a vulnerable login form and detects SQL
            injection, cross-site scripting, weak passwords, and empty fields — then explains the
            risks and how to prevent them.
          </p>

          {/* Stats */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-cyber-800/60 px-3 py-1.5 font-mono text-slate-300">
              <Terminal className="h-3.5 w-3.5 text-cyan-400" aria-hidden />
              runs locally
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-cyber-800/60 px-3 py-1.5 font-mono text-slate-300">
              <Activity className="h-3.5 w-3.5 text-emerald-400" aria-hidden />
              {findingCount} finding{findingCount === 1 ? '' : 's'}
              {highCount > 0 && <span className="text-red-400">· {highCount} high</span>}
            </span>
          </div>
        </header>

        {/* Main */}
        <main className="flex flex-1 flex-col gap-6">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="space-y-6">
              <LoginForm
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                resultCount={findingCount}
              />
              <SecurityTips />
            </div>

            <div className="lg:sticky lg:top-6">
              {result ? (
                <ResultsPanel result={result} onClear={handleClear} />
              ) : (
                <div className="glass flex h-full min-h-[320px] flex-col items-center justify-center p-8 text-center animate-fade-in">
                  <ShieldHalf className="h-14 w-14 text-slate-600" aria-hidden />
                  <h3 className="mt-4 text-base font-semibold text-slate-300">Awaiting analysis</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
                    Enter credentials and click <span className="text-slate-300">Analyze Login</span> to
                    see detected vulnerabilities, a risk score, and tailored prevention tips.
                  </p>
                </div>
              )}
            </div>
            </div>
        </main>

        {/* Footer */}
        <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-cyan-400/70" aria-hidden />
            For educational use only — do not deploy unsanitized login logic in production.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 font-medium text-slate-400 transition hover:bg-white/10 hover:text-slate-200"
          >
            <Github className="h-3.5 w-3.5" aria-hidden />
            View on GitHub
          </a>
        </footer>
      </div>
    </div>
  );
}
