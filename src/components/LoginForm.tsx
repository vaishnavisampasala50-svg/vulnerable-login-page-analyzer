import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Lock, AtSign, ShieldX, ShieldCheck, Loader2, RotateCcw } from 'lucide-react';
import { EXAMPLES } from '@/lib/analyzer';
import type { ExamplePayload } from '@/types';

interface LoginFormProps {
  onAnalyze: (username: string, password: string) => void;
  isAnalyzing: boolean;
  resultCount: number;
}

const FIELD_BASE =
  'w-full rounded-xl border bg-cyber-900/60 py-3 pl-11 pr-12 text-sm text-slate-100 placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-cyber-900';

export function LoginForm({ onAnalyze, isAnalyzing, resultCount }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnalyzing) return;
    onAnalyze(username, password);
  };

  const handleExample = (ex: ExamplePayload) => {
    setUsername(ex.username);
    setPassword(ex.password);
    setShake(true);
    window.setTimeout(() => setShake(false), 450);
  };

  const handleReset = () => {
    setUsername('');
    setPassword('');
    usernameRef.current?.focus();
  };

  return (
    <div className="glass relative overflow-hidden p-6 sm:p-8 animate-fade-up">
      {/* Scan line accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
        <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-line" />
      </div>

      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-100">
            <Lock className="h-5 w-5 text-cyan-400" aria-hidden />
            Secure Sign In
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Enter any credentials — every submission is analyzed locally for vulnerabilities.
          </p>
        </div>
        {resultCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Reset
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className={shake ? 'animate-[shake_0.4s]' : ''}>
          <label htmlFor="username" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
            Username
          </label>
          <div className="relative">
            <AtSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
            <input
              id="username"
              ref={usernameRef}
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className={`${FIELD_BASE} border-white/10 focus:border-cyan-400/60 focus:ring-cyan-500/30`}
            />
          </div>
        </div>

        <div className={shake ? 'animate-[shake_0.4s]' : ''}>
          <label htmlFor="password" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className={`${FIELD_BASE} border-white/10 focus:border-cyan-400/60 focus:ring-cyan-500/30`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isAnalyzing}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-sky-500/20 px-4 py-3 text-sm font-semibold text-cyan-100 shadow-lg shadow-cyan-500/10 transition-all duration-200 hover:border-cyan-300/60 hover:from-cyan-500/30 hover:to-sky-500/30 hover:shadow-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Analyzing…
            </>
          ) : (
            <>
              <ShieldX className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden />
              Analyze Login
            </>
          )}
        </button>
      </form>

      {/* Example payloads */}
      <div className="mt-6 border-t border-white/10 pt-4">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" aria-hidden />
          Try an example payload
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => handleExample(ex)}
              title={ex.description}
              className="group inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-cyber-700/50 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-200"
            >
              <span>{ex.label}</span>
              <span className="text-slate-500 group-hover:text-cyan-400/70">›</span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          Tip: the <span className="text-slate-400">SQL Injection</span> and <span className="text-slate-400">XSS</span> examples
          show how the same form behaves when input is not sanitized.
        </p>
      </div>
    </div>
  );
}
