import React from 'react';
import { Sparkles, Shield, Zap, ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  onOpenServiceModal?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenServiceModal }) => {
  return (
    <section id="about" className="py-24 bg-zinc-950 border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-amber-500/20 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Why Promptilion</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            AI creation shouldn't feel complicated.
          </h2>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-light">
            Promptilion makes it effortless to discover what AI models can truly create. Instead of guessing cryptic keywords, you can see real finished results first, understand how each aesthetic was engineered, copy the exact instructions, and recreate them yourself in ChatGPT.
          </p>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-light">
            And if you'd rather have our creative studio produce the final assets for your business, Promptilion offers a dedicated done-for-you service.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 text-left">
            <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/80 hover:border-amber-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white mb-2">See It First</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Clear before and after examples so you know exactly what is possible before generating.
              </p>
            </div>

            <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/80 hover:border-amber-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white mb-2">Copy & Recreate</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Instant one-click prompt copying designed to work seamlessly in ChatGPT and cutting-edge vision models.
              </p>
            </div>

            {/* Done-For-You Card */}
            <div 
              onClick={() => onOpenServiceModal?.()}
              className="bg-zinc-900/40 p-6 rounded-2xl border border-amber-500/30 hover:border-amber-500/70 transition-all hover:bg-zinc-900/70 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white mb-2 group-hover:text-amber-200 transition-colors">
                  Done-For-You
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Prefer to leave creation to our studio? Send us your product and we'll craft bespoke commercial assets.
                </p>
              </div>
              
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 font-mono uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                <span>Commission Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
