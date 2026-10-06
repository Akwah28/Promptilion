import React from 'react';
import { Lock, Gem, MessageCircle, ArrowRight } from 'lucide-react';
import { PromptilionLogo } from './PromptilionLogo';
import { NewsletterSignup } from './NewsletterSignup';
import { usePromptilion } from '../context/PromptilionContext';

interface FooterProps {
  onNavigateToSection: (sectionId: string) => void;
  onOpenServiceModal: () => void;
  onOpenAdminSignIn: () => void;
  onOpenForSaleModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateToSection,
  onOpenServiceModal,
  onOpenAdminSignIn,
  onOpenForSaleModal
}) => {
  const { trackWhatsAppSalesClick } = usePromptilion();
  const automatedMessage = "Hello! I am interested in acquiring Promptilion. I would like to discuss the purchase terms and asking price directly with the owner.";
  const whatsappUrl = `https://wa.me/2349061439327?text=${encodeURIComponent(automatedMessage)}`;

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Newsletter Signup in the footer area */}
        <NewsletterSignup />

        {/* Down Below: Promptilion Is For Sale Acquisition Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-zinc-900/90 to-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <Gem className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                Brand & Platform Acquisition
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-['Cinzel',serif]">
              Promptilion Is For Sale — Own The Studio
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              If you want to own Promptilion, contact the owner directly. Take full ownership of the platform, codebase, brand, and curated prompt blueprints.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={onOpenForSaleModal}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <span>Acquisition Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackWhatsAppSalesClick}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 hover:scale-[1.02]"
              title="Chat directly with owner on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Owner</span>
            </a>
          </div>
        </div>

        {/* Navigation & Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pt-2">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <PromptilionLogo size="md" />
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed font-light">
              See it. Copy it. Create it. Discover what AI can create — then make it yourself in ChatGPT or let our studio engineer the final assets for you.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">Navigation</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <button onClick={() => onNavigateToSection('gallery')} className="hover:text-amber-200 transition-colors cursor-pointer">
                  Explore Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToSection('blog')} className="hover:text-amber-200 transition-colors cursor-pointer">
                  Articles & Guides
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToSection('about')} className="hover:text-amber-200 transition-colors cursor-pointer">
                  About Promptilion
                </button>
              </li>
              <li>
                <button onClick={onOpenServiceModal} className="hover:text-amber-200 transition-colors cursor-pointer">
                  Create With Us
                </button>
              </li>
            </ul>
          </div>

          {/* Connect & Owner */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">Studio & Owner</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <button
                  onClick={onOpenForSaleModal}
                  className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-bold transition-colors cursor-pointer"
                >
                  <Gem className="w-3.5 h-3.5 text-amber-400" />
                  <span>Promptilion Is For Sale</span>
                </button>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackWhatsAppSalesClick}
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Owner WhatsApp</span>
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenAdminSignIn}
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Dashboard Portal</span>
                </button>
              </li>
              <li>
                <a href="#instagram" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">
                  Instagram Studio
                </a>
              </li>
              <li>
                <a href="#twitter" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">
                  Twitter / X
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 Promptilion. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={onOpenForSaleModal}
              className="text-amber-400/80 hover:text-amber-300 transition-colors font-mono cursor-pointer"
            >
              Acquisition Available • Contact Owner
            </button>
            <span>•</span>
            <span>The Premier AI Creation Repertory</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
