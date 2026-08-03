import type { LucideIcon } from 'lucide-react';
import {
  Shield,
  ShieldAlert,
  ShieldX,
  ShieldCheck,
  Database,
  Code2,
  KeyRound,
  CircleSlash,
} from 'lucide-react';
import type { RiskLevel, VulnCategory } from '@/types';

export const riskStyles: Record<
  RiskLevel,
  { text: string; bg: string; border: string; ring: string; icon: LucideIcon; label: string; dot: string }
> = {
  Low: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    ring: 'ring-emerald-500/40',
    icon: ShieldCheck,
    label: 'Low Risk',
    dot: 'bg-emerald-400',
  },
  Medium: {
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    ring: 'ring-amber-500/40',
    icon: ShieldAlert,
    label: 'Medium Risk',
    dot: 'bg-amber-400',
  },
  High: {
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    ring: 'ring-red-500/40',
    icon: ShieldX,
    label: 'High Risk',
    dot: 'bg-red-400',
  },
};

export const categoryIcon: Record<VulnCategory, LucideIcon> = {
  'sql-injection': Database,
  xss: Code2,
  'weak-password': KeyRound,
  'empty-field': CircleSlash,
};

export const shieldIcon = Shield;
