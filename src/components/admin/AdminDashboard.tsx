import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  LayoutGrid,
  Tag,
  Mail,
  FileCode,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  Search,
  ArrowUpRight,
  LogOut,
  Eye,
  Download,
  Upload,
  RefreshCw,
  FolderPlus,
  Clock,
  Layers,
  Phone,
  HelpCircle,
  AlertCircle,
  Lock,
  KeyRound,
  ShieldCheck,
  Send,
  Users,
  AtSign,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  MousePointerClick
} from 'lucide-react';
import { PromptilionLogo } from '../PromptilionLogo';
import { usePromptilion } from '../../context/PromptilionContext';
import { Creation, ServiceRequest, NewsletterSubscriber } from '../../types';
import { CreationEditorModal } from './CreationEditorModal';
import { compressImageFile } from '../../utils/imageCompressor';

interface AdminDashboardProps {
  onReturnToLiveSite: () => void;
  onPreviewCreation: (creation: Creation) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onReturnToLiveSite,
  onPreviewCreation
}) => {
  const {
    creations,
    categories,
    serviceRequests,
    mediaAssets,
    subscribers,
    analytics,
    adminUser,
    logoutAdmin,
    deleteCreation,
    deleteCategory,
    addCategory,
    updateServiceRequestStatus,
    deleteServiceRequest,
    addMediaAsset,
    deleteMediaAsset,
    addSubscriber,
    deleteSubscriber,
    exportSubscribersAsCsv,
    resetCreationsToDefault,
    updateAdminCredentials
  } = usePromptilion();

  const [activeTab, setActiveTab] = useState<'creations' | 'categories' | 'contacts' | 'subscribers' | 'prompts' | 'media' | 'analytics' | 'security'>('creations');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  
  // Subscriber states
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [newSubEmail, setNewSubEmail] = useState('');
  const [newSubMsg, setNewSubMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredSubscribers = useMemo(() => {
    const list = (subscribers || [])
      .map((s, idx) => {
        if (typeof s === 'string') {
          return {
            id: `sub-${idx}`,
            email: s,
            subscribedAt: new Date().toISOString(),
            source: 'Website',
            status: 'active' as const
          };
        }
        return s;
      })
      .filter((s): s is NewsletterSubscriber => Boolean(s && typeof s.email === 'string' && s.email.trim().length > 0));

    const q = subscriberSearch.toLowerCase().trim();
    if (!q) return list;
    return list.filter(s =>
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.source && s.source.toLowerCase().includes(q))
    );
  }, [subscribers, subscriberSearch]);

  const handleManualAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubEmail.trim()) return;
    const res = addSubscriber(newSubEmail.trim(), 'Admin Console');
    if (res.success) {
      setNewSubMsg({ type: 'success', text: res.message });
      setNewSubEmail('');
    } else {
      setNewSubMsg({ type: 'error', text: res.message });
    }
    setTimeout(() => setNewSubMsg(null), 3500);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Security credentials state
  const [newAdminEmail, setNewAdminEmail] = useState(adminUser?.email || '');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [credMessage, setCredMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Editor modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [creationToEdit, setCreationToEdit] = useState<Creation | null>(null);

  // Quick prompt copy state
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // New category inline input
  const [newCatInput, setNewCatInput] = useState('');
  const [catError, setCatError] = useState<string | null>(null);

  // Image zoom modal
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // New media upload state
  const [mediaUploadName, setMediaUploadName] = useState('');
  const [mediaUploadUrl, setMediaUploadUrl] = useState('');

  // Contacts stats
  const newRequestsCount = useMemo(() => {
    return serviceRequests.filter(r => r.status === 'new').length;
  }, [serviceRequests]);

  // Filtered creations
  const filteredCreations = useMemo(() => {
    return creations.filter(c => {
      const matchCat = selectedCategoryFilter === 'All' || c.category === selectedCategoryFilter;
      const q = searchFilter.toLowerCase().trim();
      const matchSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.prompt.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [creations, selectedCategoryFilter, searchFilter]);

  const handleCopyPrompt = (id: string, promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;
    const ok = addCategory(newCatInput.trim());
    if (ok) {
      setNewCatInput('');
      setCatError(null);
    } else {
      setCatError('Category already exists or is invalid');
    }
  };

  const handleExportPrompts = () => {
    const exportData = creations.map(c => ({
      title: c.title,
      category: c.category,
      prompt: c.prompt,
      requirements: c.requirements,
      instructions: c.instructions
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptilion-prompts-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleMediaUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 1200, 1200, 0.8);
        addMediaAsset(file.name, compressed, 'Uploads');
      } catch {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          addMediaAsset(file.name, result, 'Uploads');
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAddMediaUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (mediaUploadUrl.trim()) {
      addMediaAsset(mediaUploadName.trim() || 'asset-' + Date.now(), mediaUploadUrl.trim(), 'External');
      setMediaUploadName('');
      setMediaUploadUrl('');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-2xl border-b border-zinc-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <PromptilionLogo size="md" />
            <div className="h-6 w-px bg-zinc-800 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                Admin Console
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {adminUser?.email || 'admin@promptilion.com'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Return to Live Site */}
            <button
              onClick={onReturnToLiveSite}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold transition-all duration-200"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>View Live Website</span>
              <ArrowUpRight className="w-3 h-3 text-zinc-500" />
            </button>

            {/* Logout */}
            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 text-xs font-semibold transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Creations</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{creations.length}</div>
            <div className="text-[11px] text-zinc-500 mt-1">Live in visual library</div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Categories</span>
              <Tag className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{categories.length}</div>
            <div className="text-[11px] text-zinc-500 mt-1">Active filter channels</div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Contacts / Leads</span>
              <Mail className="w-4 h-4 text-pink-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-extrabold text-white">{serviceRequests.length}</div>
              {newRequestsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold">
                  {newRequestsCount} New
                </span>
              )}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">Client service leads</div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Subscribers</span>
              <Send className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{subscribers.length}</div>
            <div className="text-[11px] text-zinc-500 mt-1">Newsletter tip signups</div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Media Assets</span>
              <ImageIcon className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{mediaAssets.length}</div>
            <div className="text-[11px] text-zinc-500 mt-1">Images in local storage</div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('creations')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === 'creations'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Creations ({creations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === 'categories'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer relative shrink-0 ${
              activeTab === 'contacts'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Received Contacts ({serviceRequests.length})</span>
            {newRequestsCount > 0 && (
              <span className={`w-2 h-2 rounded-full ${activeTab === 'contacts' ? 'bg-zinc-950' : 'bg-pink-500'}`} />
            )}
          </button>

          <button
            onClick={() => setActiveTab('subscribers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer relative shrink-0 ${
              activeTab === 'subscribers'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Email Subscribers ({subscribers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('prompts')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === 'prompts'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Prompt Vault ({creations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === 'media'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Media Library ({mediaAssets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics & Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === 'security'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Master Security</span>
          </button>
        </div>

        {/* TAB 1: CREATIONS MANAGEMENT */}
        {activeTab === 'creations' && (
          <div className="space-y-6">
            {/* Sub-header with actions & search */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setCreationToEdit(null);
                    setIsEditorOpen(true);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Creation</span>
                </button>

                <button
                  onClick={resetCreationsToDefault}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs font-semibold transition-colors"
                  title="Restore initial starter gallery"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-zinc-900 text-zinc-200 text-xs rounded-xl px-3 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search creations or prompts..."
                    className="bg-zinc-900 text-zinc-200 placeholder-zinc-500 text-xs rounded-xl pl-9 pr-4 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500 w-48 sm:w-64"
                  />
                </div>
              </div>
            </div>

            {/* Creations Table */}
            <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800/80 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-950/70 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400 font-mono">
                    <tr>
                      <th className="py-3.5 px-4">Preview</th>
                      <th className="py-3.5 px-4">Title & Description</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Format</th>
                      <th className="py-3.5 px-4">Prompt Excerpt</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredCreations.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-zinc-500 text-sm">
                          No creations found matching current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredCreations.map((creation) => (
                        <tr key={creation.id} className="hover:bg-zinc-800/30 transition-colors group">
                          {/* Image preview thumbnail */}
                          <td className="py-3 px-4">
                            <div
                              onClick={() => setZoomedImage(creation.afterImage)}
                              className="w-16 h-14 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800 cursor-zoom-in relative flex items-center justify-center p-1"
                              title="Click to zoom full image"
                            >
                              <img
                                src={creation.afterImage}
                                alt=""
                                aria-hidden="true"
                                className="absolute inset-0 w-full h-full object-cover blur-sm opacity-20"
                              />
                              <img
                                src={creation.afterImage}
                                alt={creation.title}
                                className="relative z-10 max-w-full max-h-full object-contain rounded"
                              />
                            </div>
                          </td>

                          {/* Title */}
                          <td className="py-3 px-4 max-w-xs">
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>{creation.title}</span>
                              {creation.featured && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                                  FEATURED
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-zinc-400 truncate mt-0.5 font-normal">
                              {creation.description}
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-medium text-zinc-300">
                              {creation.category}
                            </span>
                          </td>

                          {/* Format */}
                          <td className="py-3 px-4 text-xs font-mono">
                            <span className={creation.type === 'video' ? 'text-purple-400' : 'text-zinc-400'}>
                              {creation.type === 'video' ? 'Video Concept' : 'Image Prompt'}
                            </span>
                          </td>

                          {/* Prompt preview */}
                          <td className="py-3 px-4 max-w-sm">
                            <p className="font-mono text-xs text-zinc-400 truncate">
                              {creation.prompt}
                            </p>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => onPreviewCreation(creation)}
                                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                                title="Preview on live modal"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setCreationToEdit(creation);
                                  setIsEditorOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors"
                                title="Edit creation"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete "${creation.title}"?`)) {
                                    deleteCreation(creation.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="space-y-8">
            {/* Add Category Form */}
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/80 max-w-xl">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-amber-400" />
                <span>Add New Creation Category</span>
              </h3>
              <p className="text-xs text-zinc-400 mb-4">
                Categories dynamically filter the public library and organize your prompts.
              </p>

              <form onSubmit={handleAddCategorySubmit} className="flex gap-3">
                <input
                  type="text"
                  value={newCatInput}
                  onChange={(e) => {
                    setNewCatInput(e.target.value);
                    setCatError(null);
                  }}
                  placeholder="e.g. Architecture, Fashion, Jewelry..."
                  className="flex-1 bg-zinc-950 text-zinc-100 text-sm rounded-xl px-4 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm rounded-xl transition-all"
                >
                  Create Category
                </button>
              </form>
              {catError && <p className="text-xs text-red-400 mt-2">{catError}</p>}
            </div>

            {/* Categories List */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">
                Active Categories ({categories.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const count = creations.filter(c => c.category === cat).length;
                  return (
                    <div
                      key={cat}
                      className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-between hover:border-zinc-700 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                          <Tag className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{cat}</div>
                          <div className="text-xs text-zinc-400">{count} creation{count === 1 ? '' : 's'}</div>
                        </div>
                      </div>

                      {/* Delete button (prevent deleting if user wants to keep) */}
                      <button
                        onClick={() => {
                          if (confirm(`Delete category "${cat}"? Creations assigned to it will remain.`)) {
                            deleteCategory(cat);
                          }
                        }}
                        className="p-2 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-zinc-800 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONTACTS & SERVICE REQUESTS INBOX */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Client Service Requests & Leads</h3>
                <p className="text-xs text-zinc-400">
                  Submissions from the "Create This For Me" service request modal.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {serviceRequests.length === 0 ? (
                <div className="text-center py-16 bg-zinc-900/30 rounded-2xl border border-zinc-800/60">
                  <Mail className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-white">No inquiries yet</h4>
                  <p className="text-xs text-zinc-400">
                    Incoming submissions from potential clients will appear here in real-time.
                  </p>
                </div>
              ) : (
                serviceRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {/* Uploaded product image if present */}
                      {req.productImage ? (
                        <div
                          onClick={() => setZoomedImage(req.productImage!)}
                          className="w-24 h-24 rounded-xl overflow-hidden bg-zinc-950 border border-amber-500/30 shrink-0 cursor-zoom-in relative flex items-center justify-center p-1.5 group"
                          title="Click to zoom full image"
                        >
                          <img
                            src={req.productImage}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover blur-md opacity-20 scale-125"
                          />
                          <img
                            src={req.productImage}
                            alt="Uploaded product"
                            className="relative z-10 max-w-full max-h-full object-contain rounded"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 text-zinc-600">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}

                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-bold text-white">{req.businessName}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold">
                            {req.selectedCreation}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            req.status === 'new'
                              ? 'bg-pink-500/20 text-pink-300'
                              : req.status === 'contacted'
                              ? 'bg-amber-500/20 text-amber-300'
                              : req.status === 'in_progress'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {req.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-zinc-400">
                          <span className="flex items-center gap-1 font-mono text-amber-400">
                            <Phone className="w-3 h-3" />
                            {req.whatsappNumber}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-zinc-500">
                            <Clock className="w-3 h-3" />
                            {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {req.additionalInstructions && (
                          <p className="text-xs text-zinc-300 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 mt-2">
                            "{req.additionalInstructions}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right action controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                      {/* Direct WhatsApp link */}
                      <a
                        href={`https://wa.me/${req.whatsappNumber.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat on WhatsApp</span>
                      </a>

                      {/* Status Selector */}
                      <select
                        value={req.status}
                        onChange={(e) =>
                          updateServiceRequestStatus(req.id, e.target.value as ServiceRequest['status'])
                        }
                        className="bg-zinc-950 text-zinc-200 text-xs rounded-xl px-3 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500"
                      >
                        <option value="new">Status: New</option>
                        <option value="contacted">Status: Contacted</option>
                        <option value="in_progress">Status: In Progress</option>
                        <option value="completed">Status: Completed</option>
                      </select>

                      <button
                        onClick={() => {
                          if (confirm(`Remove inquiry from ${req.businessName}?`)) {
                            deleteServiceRequest(req.id);
                          }
                        }}
                        className="p-2.5 text-zinc-500 hover:text-red-400 rounded-xl hover:bg-zinc-800 transition-colors"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB: SUBSCRIBERS INBOX */}
        {activeTab === 'subscribers' && (
          <div className="space-y-6">
            {/* Header & Export Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Email Newsletter Subscribers</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
                    {subscribers.length} Total
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Users subscribed via the footer newsletter component to receive new AI prompt engineering tips.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportSubscribersAsCsv}
                  disabled={subscribers.length === 0}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                  title="Export all subscriber emails to CSV file"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Quick Add Subscriber Banner */}
            <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
              <form onSubmit={handleManualAddSubscriber} className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <AtSign className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="Manually add subscriber email (e.g. client@brand.com)..."
                    value={newSubEmail}
                    onChange={(e) => setNewSubEmail(e.target.value)}
                    className="w-full bg-zinc-950 text-zinc-100 text-xs rounded-xl pl-10 pr-4 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Subscriber</span>
                </button>
              </form>
              {newSubMsg && (
                <p className={`text-xs mt-2.5 ${newSubMsg.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {newSubMsg.text}
                </p>
              )}
            </div>

            {/* Filter Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search subscribers by email address or source..."
                value={subscriberSearch}
                onChange={(e) => setSubscriberSearch(e.target.value)}
                className="w-full bg-zinc-900/50 text-zinc-100 text-xs rounded-xl pl-10 pr-4 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Subscribers Table */}
            {filteredSubscribers.length === 0 ? (
              <div className="text-center py-16 bg-zinc-900/30 rounded-2xl border border-zinc-800/60">
                <Send className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white">No subscribers found</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  {subscriberSearch ? 'Try searching for another keyword.' : 'When users enter their email on the site, they will appear here.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-zinc-800/80 bg-zinc-900/40">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-mono">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Subscriber Email</th>
                      <th className="py-3.5 px-4 font-semibold">Subscribed Date</th>
                      <th className="py-3.5 px-4 font-semibold">Source</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredSubscribers.map((sub, idx) => {
                      const emailStr = sub && typeof sub.email === 'string' ? sub.email.trim() : '';
                      const isCopied = copiedEmail === emailStr;
                      const initialLetter = emailStr.length > 0 ? emailStr.charAt(0).toUpperCase() : '?';
                      const formattedDate = sub && sub.subscribedAt
                        ? new Date(sub.subscribedAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Recent';
                      const sourceText = sub && sub.source ? sub.source : 'Footer Gazette';
                      const rowKey = sub.id || `sub-row-${idx}-${emailStr}`;

                      return (
                        <tr key={rowKey} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                                {initialLetter}
                              </div>
                              <div className="font-semibold text-white flex items-center gap-2">
                                <span>{emailStr || 'No email provided'}</span>
                                {emailStr && (
                                  <button
                                    type="button"
                                    onClick={() => handleCopyEmail(emailStr)}
                                    className="text-zinc-500 hover:text-amber-300 transition-colors cursor-pointer p-1"
                                    title="Copy email address"
                                  >
                                    {isCopied ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-zinc-400 font-mono text-[11px]">
                            {formattedDate}
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-mono">
                              {sourceText}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              {sub.status || 'Active'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove subscriber "${emailStr}" from mailing list?`)) {
                                  deleteSubscriber(sub.id);
                                }
                              }}
                              className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                              title="Delete Subscriber"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROMPTS VAULT */}
        {activeTab === 'prompts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Master Prompts Vault</h3>
                <p className="text-xs text-zinc-400">
                  Instant search, one-click copy, and full export of all AI prompt directives.
                </p>
              </div>

              <button
                onClick={handleExportPrompts}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Export Prompts (JSON)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {creations.map((c) => {
                const isCopied = copiedPromptId === c.id;
                return (
                  <div
                    key={c.id}
                    className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white text-base">{c.title}</span>
                        <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-xs">
                          {c.category}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyPrompt(c.id, c.prompt)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy Prompt'}</span>
                      </button>
                    </div>

                    <div className="bg-zinc-950 rounded-xl p-4 font-mono text-xs text-zinc-300 leading-relaxed border border-zinc-800/60 selection:bg-amber-500 selection:text-black">
                      {c.prompt}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500">
                      <span>{c.prompt.split(/\s+/).length} words • {c.prompt.length} characters</span>
                      <button
                        onClick={() => {
                          setCreationToEdit(c);
                          setIsEditorOpen(true);
                        }}
                        className="text-amber-400 hover:text-amber-300"
                      >
                        Edit prompt text →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: MEDIA & IMAGES */}
        {activeTab === 'media' && (
          <div className="space-y-8">
            {/* Upload Box */}
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/80">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Upload or Register Images</span>
              </h3>
              <p className="text-xs text-zinc-400 mb-6">
                Upload local product photos or AI results directly to store and link in your creations.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Local Upload */}
                <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-800 hover:border-amber-500/50 bg-zinc-950 rounded-2xl cursor-pointer transition-colors text-center group">
                  <Upload className="w-8 h-8 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold text-white">Click to upload from computer</span>
                  <span className="text-xs text-zinc-500 mt-1">PNG, JPG, WEBP saved to local asset library</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMediaUploadFile}
                    className="hidden"
                  />
                </label>

                {/* External URL form */}
                <form onSubmit={handleAddMediaUrl} className="flex flex-col justify-between space-y-3 bg-zinc-950 p-5 rounded-2xl border border-zinc-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Or Save Image via URL
                  </span>
                  <input
                    type="text"
                    value={mediaUploadName}
                    onChange={(e) => setMediaUploadName(e.target.value)}
                    placeholder="Asset name (e.g. watch-luxury-dark.jpg)"
                    className="w-full bg-zinc-900 text-zinc-200 text-xs rounded-xl px-3 py-2 border border-zinc-800 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="url"
                    required
                    value={mediaUploadUrl}
                    onChange={(e) => setMediaUploadUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-zinc-900 text-zinc-200 text-xs rounded-xl px-3 py-2 border border-zinc-800 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Add to Library
                  </button>
                </form>
              </div>
            </div>

            {/* Media Assets Gallery */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">
                Media Gallery ({mediaAssets.length} Assets)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {mediaAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="group bg-zinc-900/40 rounded-2xl border border-zinc-800 overflow-hidden relative"
                  >
                    <div
                      onClick={() => setZoomedImage(asset.url)}
                      className="aspect-[16/12] bg-zinc-950 overflow-hidden cursor-zoom-in relative flex items-center justify-center p-2"
                      title="Click to zoom full image"
                    >
                      <img
                        src={asset.url}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-xl opacity-20 scale-125"
                      />
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="relative z-10 max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 rounded drop-shadow"
                      />
                    </div>
                    <div className="p-3">
                      <div className="text-xs font-bold text-white truncate">{asset.name}</div>
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
                        <span>{asset.createdAt}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(asset.url);
                              alert('Image URL copied to clipboard!');
                            }}
                            className="text-amber-400 hover:text-amber-300"
                            title="Copy URL"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteMediaAsset(asset.id)}
                            className="text-zinc-500 hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: ANALYTICS & STATS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Performance & Traffic Analytics</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
                  Live Telemetry
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Real-time tracking of website visitors, prompt copy actions, photo clicks, and WhatsApp acquisition inquiries.
              </p>
            </div>

            {/* Analytics Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Website Visitors</span>
                  <Eye className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-extrabold text-white">{analytics.websiteVisitors}</div>
                <div className="text-[11px] text-zinc-500 mt-1">Unique session visitors</div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Copy Clicks</span>
                  <MousePointerClick className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-extrabold text-white">{analytics.totalCopyClicks}</div>
                <div className="text-[11px] text-zinc-500 mt-1">Prompt directives copied</div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">WhatsApp Sales Clicks</span>
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-white">{analytics.whatsappSalesClicks}</div>
                <div className="text-[11px] text-zinc-500 mt-1">For sale inquiries</div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Photo Clicks</span>
                  <TrendingUp className="w-4 h-4 text-pink-400" />
                </div>
                <div className="text-2xl font-extrabold text-white">
                  {Object.values(analytics.photoClicks || {}).reduce((a, b) => a + b, 0)}
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">Gallery card interactions</div>
              </div>
            </div>

            {/* Photo Clicks Leaderboard Table */}
            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Photo Clicks & Popularity Leaderboard</span>
              </h4>

              <div className="overflow-x-auto rounded-2xl border border-zinc-800/80 bg-zinc-900/40">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-mono">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Creation Photo</th>
                      <th className="py-3.5 px-4 font-semibold">Title</th>
                      <th className="py-3.5 px-4 font-semibold">Category</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Photo Clicks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {creations.map((c) => {
                      const clicks = (analytics.photoClicks || {})[c.id] || 0;
                      return (
                        <tr key={c.id} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="w-12 h-10 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                              <img src={c.afterImage} alt={c.title} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-white">
                            {c.title}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-mono">
                              {c.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-amber-300 text-sm">
                            {clicks}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SECURITY & KEYS */}
        {activeTab === 'security' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Administrative Credentials & Vault Key</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Keep these secret. Only authorized admins can sign into Promptilion. You can change your email and master key here anytime.
              </p>
            </div>

            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 space-y-4">
              {credMessage && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${
                  credMessage.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/10 border border-red-500/30 text-red-300'
                }`}>
                  {credMessage.text}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin@promptilion.com"
                  className="w-full bg-zinc-950 text-zinc-100 text-sm rounded-xl px-4 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  New Master Password (Min 6 characters)
                </label>
                <input
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-zinc-950 text-zinc-100 text-sm rounded-xl px-4 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!newAdminPassword) {
                    setCredMessage({ type: 'error', text: 'Please enter your password to save changes.' });
                    return;
                  }
                  const res = updateAdminCredentials(newAdminEmail, newAdminPassword);
                  if (res.success) {
                    setCredMessage({ type: 'success', text: 'Secret credentials saved successfully.' });
                    setNewAdminPassword('');
                  } else {
                    setCredMessage({ type: 'error', text: res.message || 'Failed to update credentials.' });
                  }
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                Update Secret Credentials
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Creation Editor Modal */}
      <CreationEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setCreationToEdit(null);
        }}
        creationToEdit={creationToEdit}
      />

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in"
        >
          <div 
            className="relative max-w-5xl max-h-[90vh] rounded-3xl border border-amber-500/30 bg-zinc-950/90 p-3 sm:p-4 shadow-2xl flex items-center justify-center gold-border-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-3 -right-3 sm:top-4 sm:right-4 w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center z-10 cursor-pointer shadow-lg"
            >
              ✕
            </button>
            <img src={zoomedImage} alt="Full view" className="max-w-full max-h-[82vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
};
