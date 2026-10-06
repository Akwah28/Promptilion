import React, { useState, useMemo, useEffect } from 'react';
import { PromptilionProvider, usePromptilion } from './context/PromptilionContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PrestigeBar } from './components/PrestigeBar';
import { CategoryFilter } from './components/CategoryFilter';
import { CreationCard } from './components/CreationCard';
import { CreationDetailModal } from './components/CreationDetailModal';
import { ServiceModal } from './components/ServiceModal';
import { BlogSection } from './components/BlogSection';
import { BlogDetailModal } from './components/BlogDetailModal';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { ForSaleModal } from './components/ForSaleModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminSignInModal } from './components/admin/AdminSignInModal';
import { Creation, BlogPost } from './types';
import { LayoutDashboard } from 'lucide-react';

function PromptilionMain() {
  const {
    creations,
    categories,
    adminUser,
    isAdminMode,
    setIsAdminMode,
    logoutAdmin,
    trackCopyClick
  } = usePromptilion();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCreation, setSelectedCreation] = useState<Creation | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [adminSignInOpen, setAdminSignInOpen] = useState(false);
  const [forSaleModalOpen, setForSaleModalOpen] = useState(false);
  const [preselectedCreation, setPreselectedCreation] = useState<string>('Product Explosion');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-open For Sale modal if #for-sale or ?for-sale is in URL
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#for-sale' || window.location.search.includes('for-sale')) {
        setForSaleModalOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Filter creations dynamically based on live store
  const filteredCreations = useMemo(() => {
    return creations.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q)) ||
        item.prompt.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [creations, selectedCategory, searchQuery]);

  const handleCopyPrompt = (_prompt: string) => {
    navigator.clipboard.writeText(_prompt);
    trackCopyClick();
    setToastMessage('Engineered directive copied to clipboard! Ready to paste into ChatGPT.');
  };

  const handleOpenServiceModalWithCreation = (title: string) => {
    setPreselectedCreation(title);
    setServiceModalOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'for-sale') {
      setForSaleModalOpen(true);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If in admin mode and user is logged in, show the full Admin Dashboard
  if (isAdminMode && adminUser) {
    return (
      <AdminDashboard
        onReturnToLiveSite={() => setIsAdminMode(false)}
        onPreviewCreation={(c) => {
          setSelectedCreation(c);
          setIsAdminMode(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Gold Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Admin Floating Quick Access Banner when logged in */}
      {adminUser && !isAdminMode && (
        <aside aria-label="Admin bar" className="bg-gradient-to-r from-amber-500/20 via-zinc-900 to-amber-500/20 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-semibold">Master Admin Session Active</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminMode(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Open Admin Console</span>
            </button>
            <button
              onClick={logoutAdmin}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </aside>
      )}

      {/* Navigation */}
      <Navbar
        onOpenServiceModal={() => setServiceModalOpen(true)}
        onNavigateToSection={scrollToSection}
        onOpenAdminSignIn={() => setAdminSignInOpen(true)}
        onOpenForSaleModal={() => setForSaleModalOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreClick={() => scrollToSection('gallery')}
          onServiceClick={() => setServiceModalOpen(true)}
          featuredCreations={creations.filter(c => c.featured)}
          onSelectCreation={(c) => setSelectedCreation(c)}
        />

        {/* Prestige / Authority Bar */}
        <PrestigeBar />

        {/* Main Gallery Section */}
        <div id="gallery" className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 font-['Cinzel',serif]">
                Curated AI Repertory
              </h2>
              <p className="text-base text-zinc-400 font-light leading-relaxed">
                Browse tested transformations. Click any recipe to inspect the exact before/after comparison and copy the engineered ChatGPT directive.
              </p>
            </div>

            {/* Category Filter Chips */}
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              totalCount={creations.length}
            />
          </div>

          {/* Gallery Grid with Staggered Scroll Animations */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredCreations.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-900">
                <h3 className="text-lg font-bold text-white mb-2 font-['Cinzel',serif]">No creations found</h3>
                <p className="text-sm text-zinc-400 mb-6 font-light">
                  Try searching for another keyword or select a different category filter.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCreations.map((creation) => (
                  <CreationCard
                    key={creation.id}
                    creation={creation}
                    onSelect={(c) => setSelectedCreation(c)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Editorial Articles / Blog Guides */}
        <div id="blog">
          <BlogSection
            onOpenArticle={(post) => setSelectedArticle(post)}
          />
        </div>

        {/* About Promptilion */}
        <AboutSection onOpenServiceModal={() => setServiceModalOpen(true)} />
      </main>

      {/* Footer */}
      <Footer
        onNavigateToSection={scrollToSection}
        onOpenServiceModal={() => setServiceModalOpen(true)}
        onOpenAdminSignIn={() => setAdminSignInOpen(true)}
        onOpenForSaleModal={() => setForSaleModalOpen(true)}
      />

      {/* Modals & Toasts */}
      <CreationDetailModal
        creation={selectedCreation}
        onClose={() => setSelectedCreation(null)}
        onCopyPrompt={handleCopyPrompt}
        onRequestService={handleOpenServiceModalWithCreation}
      />

      <BlogDetailModal
        post={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onRequestService={() => setServiceModalOpen(true)}
      />

      <ServiceModal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        preselectedCreation={preselectedCreation}
      />

      <ForSaleModal
        isOpen={forSaleModalOpen}
        onClose={() => setForSaleModalOpen(false)}
      />

      <AdminSignInModal
        isOpen={adminSignInOpen}
        onClose={() => setAdminSignInOpen(false)}
      />

      <Toast
        message={toastMessage || ''}
        show={Boolean(toastMessage)}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <PromptilionProvider>
      <PromptilionMain />
    </PromptilionProvider>
  );
}
