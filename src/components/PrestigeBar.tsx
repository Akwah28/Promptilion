import React from 'react';
import { Sparkles, Diamond, ShieldCheck, Cpu, Crown } from 'lucide-react';

export const PrestigeBar: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-y border-amber-500/20 py-5 overflow-hidden select-none relative">
      {/* Subtle gold ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-around gap-6 text-center text-xs font-mono uppercase tracking-[0.22em] text-zinc-400">
        <div className="flex items-center gap-2 text-amber-300 font-semibold">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>Haute Création Standard</span>
        </div>

        <div className="hidden sm:inline-block text-zinc-700">•</div>

        <div className="flex items-center gap-2">
          <Diamond className="w-3.5 h-3.5 text-amber-400/80" />
          <span>Master Engineered Directives</span>
        </div>

        <div className="hidden md:inline-block text-zinc-700">•</div>

        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>Pure ChatGPT Compatibility</span>
        </div>

        <div className="hidden lg:inline-block text-zinc-700">•</div>

        <div className="flex items-center gap-2 text-zinc-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Private Commission Atelier</span>
        </div>
      </div>
    </div>
  );
};
