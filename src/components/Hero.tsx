import React from 'react';
import { Sparkles, ArrowRight, Zap, Play, Shield, Compass, Gem } from 'lucide-react';
import { Creation } from '../types';

interface HeroProps {
  onExploreClick: () => void;
  onServiceClick: () => void;
  featuredCreations: Creation[];
  onSelectCreation: (creation: Creation) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onServiceClick,
  featuredCreations,
  onSelectCreation
}) => {
  return (
    <section id="hero" className="relative pt-16 pb-28 overflow-hidden">
      {/* Luxury Cinematic Background: Figure walking towards golden hour beach */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/src/assets/images/hero_beach_luxury_1790489417758.jpg"
          alt="Serene figure walking towards golden beach at twilight"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Layered cinematic overlays: Top darkening, dark gold ambient tint, and seamless bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/75 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-zinc-950/60 to-zinc-950/95" />
        <div className="absolute inset-0 bg-noise opacity-40 mix-blend-soft-light" />
      </div>

      {/* Radial luxury background lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-r from-amber-500/15 via-amber-300/10 to-purple-500/10 blur-[140px] rounded-full pointer-events-none animate-pulse-glow z-0" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          {/* Heritage Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/30 text-xs font-semibold text-amber-200/90 mb-6 shadow-xl shadow-amber-500/5 backdrop-blur-md">
            <Gem className="w-3.5 h-3.5 text-amber-400" />
            <span className="tracking-[0.2em] uppercase font-mono text-[10px]">
              HAUTE CRÉATION INTELLIGENCE • EST. MMXXVI
            </span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.06] mb-6 font-['Cinzel',serif]">
            See what AI <br />
            <span className="gold-gradient-text drop-shadow-[0_2px_20px_rgba(212,175,55,0.35)]">
              can create.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-zinc-300 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
            Discover what AI can create — then make it yourself. Explore ready-to-use AI prompts, inspect the real results, and recreate them yourself in ChatGPT.
          </p>

          {/* Luxury CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-extrabold px-8 py-4 rounded-2xl shadow-2xl shadow-amber-500/25 transition-all duration-300 group cursor-pointer hover:scale-[1.02]"
            >
              <span>Explore Creations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onServiceClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-zinc-950/80 hover:bg-zinc-900 text-zinc-200 font-semibold px-8 py-4 rounded-2xl border border-amber-500/30 hover:border-amber-400/60 transition-all duration-300 cursor-pointer shadow-lg hover:scale-[1.02]"
            >
              <span>Create With Us</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Micro horology status line */}
          <div className="mt-12 flex items-center justify-center gap-6 text-[11px] text-zinc-500 font-mono uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Direct ChatGPT Instructions
            </span>
            <span>•</span>
            <span>Zero Hallucinated Art</span>
            <span>•</span>
            <span>Atelier Commission Ready</span>
          </div>
        </div>

        {/* Hero Visual Showcase with Luxury Framing & Hover Glow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {featuredCreations.slice(0, 3).map((creation, index) => (
            <div
              key={creation.id}
              onClick={() => onSelectCreation(creation)}
              className={`group relative bg-zinc-950/85 backdrop-blur-xl rounded-3xl border border-zinc-800/80 hover:border-amber-500/50 overflow-hidden cursor-pointer transition-all duration-500 shadow-2xl gold-border-glow hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(212,175,55,0.18)] ${
                index === 1 ? 'md:-translate-y-4' : ''
              }`}
            >
              {/* Image preview with smooth zoom */}
              <div className="aspect-[2/3] w-full overflow-hidden relative bg-zinc-950">
                <img
                  src={creation.afterImage}
                  alt={creation.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent opacity-85" />
                
                {/* Category badge */}
                <div className="absolute top-4 left-4 bg-zinc-950/85 backdrop-blur-md border border-amber-500/30 text-amber-200 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 font-mono shadow-lg">
                  {creation.type === 'video' ? (
                    <Play className="w-3 h-3 text-purple-400 fill-current" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-amber-400" />
                  )}
                  <span>{creation.category}</span>
                </div>
              </div>

              {/* Card info */}
              <div className="p-6 relative">
                <h3 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors mb-2 font-['Cinzel',serif]">
                  {creation.title}
                </h3>
                <p className="text-sm text-zinc-400 line-clamp-2 mb-4 leading-relaxed font-light">
                  {creation.description}
                </p>
                <div className="flex items-center justify-between text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
                  <span>View Directive & Prompt</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
