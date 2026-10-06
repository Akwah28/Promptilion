import React, { useEffect } from 'react';
import { X, MessageCircle, Gem, ExternalLink, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { usePromptilion } from '../context/PromptilionContext';

interface ForSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForSaleModal: React.FC<ForSaleModalProps> = ({ isOpen, onClose }) => {
  const { trackWhatsAppSalesClick } = usePromptilion();

  const cleanPhone = '2349061439327';
  const automatedMessage = "Hello! I am interested in acquiring Promptilion. I would like to discuss the purchase terms and asking price directly with the owner.";
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(automatedMessage)}`;

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleWhatsAppClick = () => {
    trackWhatsAppSalesClick();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-zinc-950 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden gold-border-glow my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gold shimmer bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-6 border-b border-zinc-900 bg-zinc-950/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  Acquisition Directive
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Cinzel',serif] tracking-tight mt-0.5">
                Promptilion Is For Sale
              </h2>
            </div>
          </div>

          {/* Prominent Exit Button */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-800 hover:border-amber-500/40 transition-all cursor-pointer shadow-sm group"
            title="Exit and close modal"
          >
            <span>Exit</span>
            <X className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 transition-colors" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Main Notice */}
          <div className="text-center max-w-xl mx-auto space-y-3">
            <p className="text-base sm:text-lg text-zinc-200 font-light leading-relaxed">
              If you want to own <span className="text-white font-semibold font-['Cinzel',serif]">Promptilion</span> — the premier Haute Création AI studio, brand, and digital platform — you can acquire it directly from the founder and owner today.
            </p>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
              Skip months of custom development and branding. Take complete ownership of the platform, the curated prompt architecture, and the visual repertory.
            </p>
          </div>

          {/* Direct WhatsApp Contact CTA Box */}
          <div className="bg-gradient-to-br from-emerald-950/40 via-zinc-900/90 to-zinc-950 border border-emerald-500/30 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Direct Founder Contact
                </span>
                <span className="text-xs text-zinc-400 font-mono">WhatsApp Secure Link</span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                  Contact The Owner on WhatsApp
                </h3>
                <p className="text-xs text-zinc-300 font-light">
                  Click the button below to open an immediate chat with the owner with a pre-formatted acquisition inquiry.
                </p>
              </div>

              {/* Automated Message Preview */}
              <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-3.5 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  Pre-Filled WhatsApp Message:
                </span>
                <p className="text-xs font-mono text-emerald-300/90 italic">
                  "{automatedMessage}"
                </p>
              </div>

              {/* WhatsApp Launch Button */}
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Chat With Owner on WhatsApp</span>
                  <ExternalLink className="w-4 h-4 text-emerald-100 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* What Is Included In The Acquisition */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Everything Included In The Ownership Transfer</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Full Codebase & Web Platform</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
                  Production-grade React & Tailwind repository with zero-pill luxury design and responsive mobile support.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Brand Identity & Design System</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
                  Exclusive Promptilion trademark styling, custom typography, luxury gold accents, and digital visual assets.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Gem className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Curated AI Directives Library</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
                  Comprehensive prompt blueprints for ChatGPT, vision models, and before/after transformation engine.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Admin CMS & Lead Pipelines</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
                  Built-in management dashboard, client service request manager, newsletter subscriber list, and CSV export.
                </p>
              </div>
            </div>
          </div>

          {/* Quick FAQ / Note */}
          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-4 text-xs text-zinc-400 font-light flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              Direct founder transaction • Serious acquisition inquiries only
            </span>
            <span className="font-mono text-[11px] text-amber-300 font-semibold shrink-0">
              Immediate Transfer
            </span>
          </div>

          {/* Bottom Exit Action Button */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium text-xs transition-colors border border-zinc-800 hover:border-zinc-700 cursor-pointer flex items-center gap-2"
            >
              <X className="w-4 h-4 text-zinc-400" />
              <span>Exit and Return to Promptilion</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
