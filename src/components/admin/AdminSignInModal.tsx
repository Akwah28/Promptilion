import React, { useState } from 'react';
import { X, Lock, KeyRound, ArrowRight, ShieldAlert } from 'lucide-react';
import { PromptilionLogo } from '../PromptilionLogo';
import { usePromptilion } from '../../context/PromptilionContext';

interface AdminSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSignInModal: React.FC<AdminSignInModalProps> = ({ isOpen, onClose }) => {
  const { loginAdmin } = usePromptilion();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const res = loginAdmin(email, password);
      setIsLoading(false);
      if (res.success) {
        setEmail('');
        setPassword('');
        onClose();
      } else {
        setError(res.error || 'Access Restricted');
      }
    }, 500);
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-md bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-amber-500/30 rounded-3xl shadow-2xl shadow-amber-500/10 overflow-hidden gold-border-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fine gold hair-line top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 sm:p-10">
          {/* Logo & Luxury Vault Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <PromptilionLogo size="lg" className="mb-4" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold tracking-[0.2em] uppercase text-amber-300 mb-2">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Privé / Restricted Gateway</span>
            </div>
            <h3 className="text-xl font-bold font-['Cinzel',serif] tracking-wider text-white">
              Studio Access
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Authorized personnel only
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 font-medium flex items-center gap-2 animate-in fade-in">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Admin Identifier
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="Enter secret email"
                className="w-full bg-zinc-950 text-zinc-100 placeholder-zinc-700 text-sm rounded-xl px-4 py-3 border border-zinc-800 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Master Security Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Enter secret key"
                  className="w-full bg-zinc-950 text-zinc-100 placeholder-zinc-700 text-sm rounded-xl pl-4 pr-10 py-3 border border-zinc-800 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
                <KeyRound className="w-4 h-4 text-zinc-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Authenticating...' : 'Authenticate'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Discreet footer */}
          <div className="mt-8 pt-6 border-t border-zinc-900 text-center">
            <span className="text-[10px] tracking-widest uppercase text-zinc-600 font-mono">
              Promptilion Vault • Confidential
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
