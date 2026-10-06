import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, Send } from 'lucide-react';
import { usePromptilion } from '../context/PromptilionContext';

export const NewsletterSignup: React.FC = () => {
  const { addSubscriber } = usePromptilion();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    const res = addSubscriber(trimmed, 'Footer Gazette');
    if (res.success) {
      setIsSubmitted(true);
      setMessage(res.message);
      setError(null);
      setEmail('');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-zinc-900/60 to-zinc-950/90 border border-amber-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-sm shadow-xl">
      {/* Subtle gold ambient glow in the corner */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono tracking-widest uppercase text-amber-300">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Haute Prompting Intelligence</span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-white font-['Cinzel',serif] tracking-tight">
          Receive Master AI Prompt Engineering Tips
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-lg mx-auto font-light">
          Get weekly curated directives, breakthrough ChatGPT prompt recipes, and visual engineering secrets delivered straight to your inbox.
        </p>

        {/* Form / Success State */}
        {isSubmitted ? (
          <div className="pt-2 flex items-center justify-center gap-2.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 py-3.5 px-6 rounded-2xl max-w-md mx-auto">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">
              {message || "You are subscribed! Next week's prompt directives will arrive in your inbox."}
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pt-2 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              {/* Email Input Field */}
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter your email address..."
                  className="w-full bg-zinc-950/90 text-zinc-100 placeholder-zinc-500 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-3 border border-zinc-800 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 transition-all font-sans"
                />
              </div>

              {/* Subscribe Button with Gold-Gradient Hover Effect */}
              <button
                type="submit"
                className="w-full sm:w-auto flex-shrink-0 px-6 py-3 rounded-xl bg-zinc-900 border border-amber-500/40 text-amber-300 font-bold text-xs sm:text-sm cursor-pointer transition-all duration-300 shadow-md shadow-amber-500/5 hover:bg-gradient-to-r hover:from-amber-400 hover:via-amber-500 hover:to-amber-600 hover:text-zinc-950 hover:shadow-lg hover:shadow-amber-500/25 hover:border-transparent hover:scale-[1.02] flex items-center justify-center gap-2 group"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-xs mt-2 text-left font-medium">{error}</p>
            )}

            <p className="text-[10px] text-zinc-500 mt-2.5 font-mono">
              Zero spam. Unsubscribe at any time with one click.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
