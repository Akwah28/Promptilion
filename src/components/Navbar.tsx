import React, { useState } from 'react';
import { Menu, X, ArrowUpRight, Lock, LayoutDashboard, Gem } from 'lucide-react';
import { PromptilionLogo } from './PromptilionLogo';
import { usePromptilion } from '../context/PromptilionContext';

interface NavbarProps {
  onOpenServiceModal: () => void;
  onNavigateToSection: (sectionId: string) => void;
  onOpenAdminSignIn: () => void;
  onOpenForSaleModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenServiceModal,
  onNavigateToSection,
  onOpenAdminSignIn,
  onOpenForSaleModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { adminUser, setIsAdminMode } = usePromptilion();

  const handleNavClick = (sectionId: string) => {
    onNavigateToSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('hero')} 
          className="cursor-pointer group flex items-center"
        >
          <PromptilionLogo size="md" />
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          <button 
            onClick={() => handleNavClick('gallery')} 
            className="hover:text-amber-200 transition-colors cursor-pointer"
          >
            Explore
          </button>
          <button 
            onClick={() => handleNavClick('gallery')} 
            className="hover:text-amber-200 transition-colors cursor-pointer"
          >
            Categories
          </button>
          <button 
            onClick={() => handleNavClick('blog')} 
            className="hover:text-amber-200 transition-colors cursor-pointer"
          >
            Articles
          </button>
          <button 
            onClick={() => handleNavClick('about')} 
            className="hover:text-amber-200 transition-colors cursor-pointer"
          >
            About
          </button>
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* For Sale Acquisition Button */}
          <button
            onClick={onOpenForSaleModal}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/15 hover:from-amber-500/25 hover:to-amber-500/25 text-amber-300 border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer shadow-sm shadow-amber-500/5 group"
            title="Promptilion is available for acquisition"
          >
            <Gem className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>For Sale</span>
          </button>

          {/* Admin shortcut button */}
          {adminUser ? (
            <button
              onClick={() => setIsAdminMode(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminSignIn}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-300 border border-zinc-800 hover:border-amber-500/30 transition-all cursor-pointer"
              title="Admin Portal Sign In"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onOpenServiceModal}
            className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/10 transition-all duration-200 cursor-pointer"
          >
            <span>Create With Us</span>
            <ArrowUpRight className="w-4 h-4 text-zinc-950" />
          </button>
        </div>

        {/* Mobile menu button (Hamburger Icon) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-zinc-900 text-zinc-300 border border-zinc-800 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown (Hamburger Menu) */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-zinc-950/95 border-b border-zinc-900 backdrop-blur-2xl p-6 flex flex-col gap-3.5 animate-in slide-in-from-top-4 duration-200 shadow-2xl">
          {/* Prominent For Sale Button in Hamburger Menu */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenForSaleModal();
            }}
            className="w-full text-left text-sm font-bold text-amber-300 hover:text-amber-200 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-between shadow-lg shadow-amber-500/5 transition-all"
          >
            <span className="flex items-center gap-2.5">
              <Gem className="w-4 h-4 text-amber-400" />
              <span>Promptilion Is For Sale</span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Acquire Brand
            </span>
          </button>

          <button
            onClick={() => handleNavClick('gallery')}
            className="text-left text-base font-medium text-zinc-300 hover:text-amber-200 py-2 border-b border-zinc-900/50"
          >
            Explore Creations
          </button>
          <button
            onClick={() => handleNavClick('blog')}
            className="text-left text-base font-medium text-zinc-300 hover:text-amber-200 py-2 border-b border-zinc-900/50"
          >
            Articles & Guides
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="text-left text-base font-medium text-zinc-300 hover:text-amber-200 py-2 border-b border-zinc-900/50"
          >
            About Promptilion
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (adminUser) {
                setIsAdminMode(true);
              } else {
                onOpenAdminSignIn();
              }
            }}
            className="text-left text-base font-medium text-amber-300 hover:text-amber-200 py-2 border-b border-zinc-900/50 flex items-center justify-between"
          >
            <span>Admin Console</span>
            <Lock className="w-4 h-4 text-amber-400" />
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenServiceModal();
            }}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all"
          >
            <span>Create With Us</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};
