import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Sparkles, Zap, ShieldCheck, Sliders, Columns } from 'lucide-react';
import { Creation } from '../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';

interface CreationDetailModalProps {
  creation: Creation | null;
  onClose: () => void;
  onCopyPrompt: (prompt: string) => void;
  onRequestService: (creationTitle: string) => void;
}

export const CreationDetailModal: React.FC<CreationDetailModalProps> = ({
  creation,
  onClose,
  onCopyPrompt,
  onRequestService
}) => {
  const [copied, setCopied] = useState(false);
  const [comparisonMode, setComparisonMode] = useState<'slider' | 'sideBySide'>('slider');

  if (!creation) return null;

  const handleCopy = () => {
    onCopyPrompt(creation.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-5xl bg-zinc-950/95 border border-amber-500/30 rounded-3xl shadow-2xl shadow-amber-500/10 overflow-hidden my-6 gold-border-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gold hair-line accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-900 bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
              {creation.category}
            </span>
            <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
              REF: {creation.slug}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-medium">
              <button
                type="button"
                onClick={() => setComparisonMode('slider')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  comparisonMode === 'slider' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Slider</span>
              </button>
              <button
                type="button"
                onClick={() => setComparisonMode('sideBySide')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  comparisonMode === 'sideBySide' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Side by Side</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-10 max-h-[82vh] overflow-y-auto space-y-8">
          {/* Title & Description */}
          <div className="max-w-3xl">
            <div className="text-[11px] font-mono tracking-[0.25em] uppercase text-amber-400 font-semibold mb-2">
              Atelier Creation Directive
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Cinzel',serif] mb-3">
              {creation.title}
            </h2>
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-light">
              {creation.description}
            </p>
          </div>

          {/* Before / After Comparison */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2 font-mono">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Transformation Comparison</span>
              </h3>
            </div>

            {comparisonMode === 'slider' ? (
              <BeforeAfterSlider
                beforeImage={creation.beforeImage}
                afterImage={creation.afterImage}
                title={creation.title}
                type={creation.type}
                videoUrl={creation.videoUrl}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Before */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">1. Original Source</span>
                    <span className="text-[11px] text-zinc-500 font-mono">Unprocessed</span>
                  </div>
                  <div className="aspect-[2/3] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 relative shadow-xl">
                    <img
                      src={creation.beforeImage}
                      alt={`${creation.title} Before`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* After */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">2. Promptilion Result</span>
                    <span className="text-[11px] text-amber-400/80 font-mono">Photorealistic Master</span>
                  </div>
                  <div className="aspect-[2/3] rounded-3xl overflow-hidden border border-amber-500/40 bg-zinc-950 relative shadow-xl shadow-amber-500/10">
                    {creation.type === 'video' && creation.videoUrl ? (
                      <video
                        src={creation.videoUrl}
                        controls
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={creation.afterImage}
                        alt={`${creation.title} After`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* What You Need & Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/50 p-6 sm:p-8 rounded-3xl border border-zinc-800/80">
            {/* What you need */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider font-mono">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Required Inputs</span>
              </h3>
              <ul className="space-y-3">
                {creation.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
                      {i + 1}
                    </div>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How to use */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider font-mono">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Execution Steps</span>
              </h3>
              <ol className="space-y-3">
                {creation.instructions.map((inst, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
                      {i + 1}
                    </div>
                    <span>{inst}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Copy Prompt Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 font-mono">
                <span>The Engineered Prompt Directive</span>
              </h3>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-amber-500/20'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied to Clipboard ✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 font-mono text-xs sm:text-sm text-zinc-300 leading-relaxed selection:bg-amber-500 selection:text-black relative">
              {creation.prompt}
            </div>
          </div>

          {/* Actions: ChatGPT & Done-For-You Service */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-900">
            {/* ChatGPT Action */}
            <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/80 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-white mb-1">Recreate in ChatGPT</h4>
                <p className="text-xs text-zinc-400 mb-4">
                  Copy this prompt directive and paste it with your image into ChatGPT.
                </p>
              </div>
              <a
                href="https://chatgpt.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-5 py-3 rounded-xl transition-colors text-sm"
              >
                <span>Launch ChatGPT</span>
                <ExternalLink className="w-4 h-4 text-zinc-400" />
              </a>
            </div>

            {/* Done-For-You Service */}
            <div className="bg-gradient-to-br from-amber-500/10 via-zinc-950 to-zinc-900 p-6 rounded-2xl border border-amber-500/40 flex flex-col justify-between shadow-xl shadow-amber-500/5">
              <div>
                <h4 className="font-bold text-white mb-1">Haute Done-For-You Service</h4>
                <p className="text-xs text-zinc-400 mb-4">
                  Our private studio engineers the visuals, lighting, and renders directly for your brand.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onRequestService(creation.title);
                }}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 text-sm cursor-pointer hover:scale-[1.02]"
              >
                <span>Done For You — Commission Visual</span>
                <Zap className="w-4 h-4 text-zinc-950" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
