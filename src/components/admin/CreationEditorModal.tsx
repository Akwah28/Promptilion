import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Sparkles, Image, Video, CheckCircle2, AlertCircle } from 'lucide-react';
import { Creation } from '../../types';
import { usePromptilion } from '../../context/PromptilionContext';
import { compressImageFile } from '../../utils/imageCompressor';

interface CreationEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  creationToEdit?: Creation | null;
}

export const CreationEditorModal: React.FC<CreationEditorModalProps> = ({
  isOpen,
  onClose,
  creationToEdit
}) => {
  const { categories, addCategory, addCreation, updateCreation } = usePromptilion();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Products');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'image' | 'video'>('image');
  const [videoUrl, setVideoUrl] = useState('');
  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');
  const [prompt, setPrompt] = useState('');
  const [requirements, setRequirements] = useState<string[]>([
    'A clear, high-resolution photo of your product against a neutral background'
  ]);
  const [instructions, setInstructions] = useState<string[]>([
    'Upload your product photo to ChatGPT.',
    'Copy the prompt above.',
    'Paste the prompt into ChatGPT and run generation.',
    'Refine the result if necessary.'
  ]);
  const [tagsString, setTagsString] = useState('');
  const [featured, setFeatured] = useState(false);
  const [serviceAvailable, setServiceAvailable] = useState(true);

  // Load existing creation if editing
  useEffect(() => {
    if (creationToEdit) {
      setTitle(creationToEdit.title);
      setSlug(creationToEdit.slug);
      setCategory(creationToEdit.category);
      setDescription(creationToEdit.description);
      setType(creationToEdit.type);
      setVideoUrl(creationToEdit.videoUrl || '');
      setBeforeImage(creationToEdit.beforeImage);
      setAfterImage(creationToEdit.afterImage);
      setPrompt(creationToEdit.prompt);
      setRequirements(creationToEdit.requirements || []);
      setInstructions(creationToEdit.instructions || []);
      setTagsString(creationToEdit.tags ? creationToEdit.tags.join(', ') : '');
      setFeatured(creationToEdit.featured);
      setServiceAvailable(creationToEdit.serviceAvailable);
    } else {
      // Default empty state
      setTitle('');
      setSlug('');
      setCategory(categories[0] || 'Products');
      setDescription('');
      setType('image');
      setVideoUrl('');
      setBeforeImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80');
      setAfterImage('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80');
      setPrompt('');
      setRequirements([
        'A clear, high-resolution photo of your product against a neutral background'
      ]);
      setInstructions([
        'Upload your product photo to ChatGPT.',
        'Copy the prompt above.',
        'Paste the prompt into ChatGPT and run generation.',
        'Refine the result if necessary.'
      ]);
      setTagsString('');
      setFeatured(false);
      setServiceAvailable(true);
    }
  }, [creationToEdit, categories, isOpen]);

  if (!isOpen) return null;

  // Auto-generate slug when title changes
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!creationToEdit) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  // Handle image upload from local machine with automatic compression
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedDataUrl = await compressImageFile(file, 1200, 1200, 0.8);
        if (target === 'before') {
          setBeforeImage(compressedDataUrl);
        } else {
          setAfterImage(compressedDataUrl);
        }
      } catch {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (target === 'before') {
            setBeforeImage(result);
          } else {
            setAfterImage(result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setCategory(newCategoryName.trim());
      setNewCategoryName('');
      setShowNewCatInput(false);
    }
  };

  const handleRequirementChange = (index: number, val: string) => {
    const updated = [...requirements];
    updated[index] = val;
    setRequirements(updated);
  };

  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleInstructionChange = (index: number, val: string) => {
    const updated = [...instructions];
    updated[index] = val;
    setInstructions(updated);
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tags = tagsString
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      description,
      type,
      videoUrl: type === 'video' ? videoUrl : undefined,
      beforeImage: beforeImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
      afterImage: afterImage || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      prompt,
      requirements: requirements.filter(r => r.trim().length > 0),
      instructions: instructions.filter(i => i.trim().length > 0),
      tags,
      featured,
      serviceAvailable
    };

    if (creationToEdit) {
      updateCreation(creationToEdit.id, payload);
    } else {
      addCreation(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {creationToEdit ? `Edit Creation: ${creationToEdit.title}` : 'Add New Creation to Library'}
              </h3>
              <p className="text-xs text-zinc-400">
                Populate prompts, before/after imagery, and user instructions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto space-y-6">
          {/* Row 1: Title, Slug, Category, Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Creation Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Holographic Cyberpunk Watch"
                className="w-full bg-zinc-950 text-zinc-100 text-sm rounded-xl px-4 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Slug (URL Identifier) *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. holographic-cyberpunk-watch"
                className="w-full bg-zinc-950 text-zinc-100 text-sm rounded-xl px-4 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500 font-mono transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Category *
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewCatInput(!showNewCatInput)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-medium"
                >
                  {showNewCatInput ? 'Choose existing' : '+ Add New Category'}
                </button>
              </div>

              {showNewCatInput ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name..."
                    className="flex-1 bg-zinc-950 text-zinc-100 text-sm rounded-xl px-3 py-2 border border-amber-500/50 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewCategory}
                    className="px-3 py-2 bg-amber-500 text-zinc-950 rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-950 text-zinc-100 text-sm rounded-xl px-4 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500 transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Creation Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('image')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    type === 'image'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <Image className="w-3.5 h-3.5" />
                  <span>Image Recipe</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('video')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    type === 'video'
                      ? 'bg-purple-500/10 border-purple-500 text-purple-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Video Concept</span>
                </button>
              </div>
            </div>
          </div>

          {/* Video URL if video */}
          {type === 'video' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Video Preview URL (MP4 / WebM)
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://... or sample video file URL"
                className="w-full bg-zinc-950 text-zinc-100 text-sm rounded-xl px-4 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Short Description / Overview *
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this prompt do? Give a 1-2 sentence compelling summary."
              className="w-full bg-zinc-950 text-zinc-100 text-sm rounded-xl px-4 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          {/* Images Section: Before & After with Upload or URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800">
            {/* Before Image */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <span>1. Before Image (Raw Input)</span>
                </label>
              </div>

              {/* Preview */}
              <div className="aspect-[2/3] min-h-[260px] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 relative group flex items-center justify-center">
                {beforeImage ? (
                  <img src={beforeImage} alt="Before preview" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 text-xs">
                    <Image className="w-8 h-8 mb-1" />
                    <span>No image selected</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={beforeImage}
                  onChange={(e) => setBeforeImage(e.target.value)}
                  placeholder="Paste Before Image URL"
                  className="w-full bg-zinc-950 text-zinc-200 text-xs rounded-lg px-3 py-2 border border-zinc-800 focus:outline-none focus:border-amber-500"
                />
                <label className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-900/50 text-xs text-zinc-300 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Upload local image file</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'before')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* After Image */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <span>2. After Image (AI Generated Result)</span>
                </label>
              </div>

              {/* Preview */}
              <div className="aspect-[2/3] min-h-[260px] rounded-2xl overflow-hidden bg-zinc-950 border border-amber-500/30 relative group shadow-md shadow-amber-500/5 flex items-center justify-center">
                {afterImage ? (
                  <img src={afterImage} alt="After preview" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 text-xs">
                    <Sparkles className="w-8 h-8 mb-1 text-amber-500/40" />
                    <span>No result image selected</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={afterImage}
                  onChange={(e) => setAfterImage(e.target.value)}
                  placeholder="Paste After Generated Image URL"
                  className="w-full bg-zinc-950 text-zinc-200 text-xs rounded-lg px-3 py-2 border border-zinc-800 focus:outline-none focus:border-amber-500"
                />
                <label className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-900/50 text-xs text-zinc-300 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Upload local result file</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'after')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Full Prompt */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Master Prompt Instructions (Users copy this) *
              </label>
              <span className="text-[11px] font-mono text-zinc-500">{prompt.length} chars</span>
            </div>
            <textarea
              required
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Act as a master commercial 3D renderer. Place the attached product..."
              className="w-full bg-zinc-950 text-zinc-100 font-mono text-xs rounded-xl p-4 border border-zinc-800 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Requirements & Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Requirements */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  What You Need (Checklist)
                </label>
                <button
                  type="button"
                  onClick={addRequirement}
                  className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3 h-3" /> Add item
                </button>
              </div>
              <div className="space-y-2">
                {requirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-500">{idx + 1}.</span>
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleRequirementChange(idx, e.target.value)}
                      placeholder="e.g. Clean product photo"
                      className="flex-1 bg-zinc-950 text-xs text-zinc-200 rounded-lg px-3 py-2 border border-zinc-800 focus:outline-none focus:border-amber-500"
                    />
                    {requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRequirement(idx)}
                        className="text-zinc-600 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  How To Use (Steps)
                </label>
                <button
                  type="button"
                  onClick={addInstruction}
                  className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3 h-3" /> Add step
                </button>
              </div>
              <div className="space-y-2">
                {instructions.map((inst, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-500">{idx + 1}.</span>
                    <input
                      type="text"
                      value={inst}
                      onChange={(e) => handleInstructionChange(idx, e.target.value)}
                      placeholder="e.g. Upload photo to ChatGPT"
                      className="flex-1 bg-zinc-950 text-xs text-zinc-200 rounded-lg px-3 py-2 border border-zinc-800 focus:outline-none focus:border-amber-500"
                    />
                    {instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstruction(idx)}
                        className="text-zinc-600 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tags and Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-zinc-800/80">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsString}
                onChange={(e) => setTagsString(e.target.value)}
                placeholder="Tech, Exploded View, 3D, Minimal"
                className="w-full bg-zinc-950 text-zinc-100 text-xs rounded-xl px-3 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="featuredCheck"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-zinc-950 border-zinc-800 focus:ring-amber-500"
              />
              <label htmlFor="featuredCheck" className="text-xs font-semibold text-zinc-300 cursor-pointer">
                Feature on Hero Showcase
              </label>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="serviceCheck"
                checked={serviceAvailable}
                onChange={(e) => setServiceAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-zinc-950 border-zinc-800 focus:ring-amber-500"
              />
              <label htmlFor="serviceCheck" className="text-xs font-semibold text-zinc-300 cursor-pointer">
                Allow "Create This For Me" Service
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-sm font-bold shadow-lg shadow-amber-500/20 transition-all"
            >
              {creationToEdit ? 'Save Changes' : 'Publish Creation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
