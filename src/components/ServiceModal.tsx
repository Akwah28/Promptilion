import React, { useState, useEffect } from 'react';
import { X, Upload, CheckCircle2, Zap, ArrowLeft, Building2, Phone, Sparkles, RefreshCw } from 'lucide-react';
import { usePromptilion } from '../context/PromptilionContext';
import { compressImageFile } from '../utils/imageCompressor';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCreation: string;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  preselectedCreation
}) => {
  const { creations, submitServiceRequest } = usePromptilion();
  const [businessName, setBusinessName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [selectedType, setSelectedType] = useState(preselectedCreation || 'Product Explosion');
  const [instructions, setInstructions] = useState('');
  const [fileName, setFileName] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);
  const [submittedSummary, setSubmittedSummary] = useState<{
    businessName: string;
    whatsappNumber: string;
    selectedType: string;
    hasImage: boolean;
  } | null>(null);

  useEffect(() => {
    if (preselectedCreation) {
      setSelectedType(preselectedCreation);
    }
  }, [preselectedCreation]);

  // Scroll locking: prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Keyboard accessibility: Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleResetAndClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitServiceRequest({
      businessName,
      whatsappNumber,
      selectedCreation: selectedType,
      productImage: imageDataUrl,
      additionalInstructions: instructions
    });

    setSubmittedSummary({
      businessName: businessName.trim(),
      whatsappNumber: whatsappNumber.trim(),
      selectedType,
      hasImage: Boolean(imageDataUrl)
    });
    setSubmitted(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      try {
        const compressed = await compressImageFile(file, 1000, 1000, 0.78);
        setImageDataUrl(compressed);
      } catch {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImageDataUrl(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setSubmittedSummary(null);
    setBusinessName('');
    setWhatsappNumber('');
    setInstructions('');
    setFileName('');
    setImageDataUrl(undefined);
    onClose();
  };

  const handleStartAnother = () => {
    setSubmitted(false);
    setSubmittedSummary(null);
    setBusinessName('');
    setWhatsappNumber('');
    setInstructions('');
    setFileName('');
    setImageDataUrl(undefined);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={handleResetAndClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
      aria-describedby="service-modal-desc"
    >
      <div 
        className="relative w-full max-w-xl bg-zinc-950 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden gold-border-glow my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-zinc-900 bg-zinc-950/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 id="service-modal-title" className="text-base sm:text-lg font-bold text-white font-['Cinzel',serif]">
                Done-For-You Studio Service
              </h2>
              <p className="text-[11px] text-amber-400 font-mono">
                Bespoke Atelier Commission Request
              </p>
            </div>
          </div>

          {/* Prominent Accessible Exit Button */}
          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Exit and close modal"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold border border-zinc-800 hover:border-amber-500/40 transition-all cursor-pointer shadow-sm group focus-visible:ring-2 focus-visible:ring-amber-400 focus:outline-none"
            title="Exit and close modal (Esc)"
          >
            <span>Exit</span>
            <X className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 transition-colors" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto">
          {submitted && submittedSummary ? (
            /* Clear Submission Feedback View */
            <div className="py-4 space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white font-['Cinzel',serif]">
                  Commission Request Received!
                </h3>
                <p id="service-modal-desc" className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto leading-relaxed font-light">
                  Your request has been successfully submitted to Promptilion's creative directors. We will review your materials and contact you directly on WhatsApp.
                </p>
              </div>

              {/* Submitted Details Summary Card */}
              <div className="bg-zinc-900/60 border border-zinc-800/90 rounded-2xl p-4 sm:p-5 text-left space-y-3 shadow-inner">
                <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-2 pb-2 border-b border-zinc-800">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Request Details Registered</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-500 block text-[10px] font-mono uppercase">Brand / Product</span>
                    <span className="font-semibold text-white flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                      {submittedSummary.businessName}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-500 block text-[10px] font-mono uppercase">WhatsApp Number</span>
                    <span className="font-semibold text-white flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      {submittedSummary.whatsappNumber}
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-zinc-500 block text-[10px] font-mono uppercase">Target Aesthetic Directive</span>
                    <span className="font-semibold text-amber-200 mt-0.5 block">
                      {submittedSummary.selectedType}
                    </span>
                  </div>

                  {submittedSummary.hasImage && (
                    <div className="sm:col-span-2 text-[11px] text-zinc-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Product photo attached & ready for atelier synthesis</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Exit & Submit Another */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  aria-label="Exit and return to gallery"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-amber-400 focus:outline-none"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Exit & Return to Gallery</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartAnother}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold text-xs border border-zinc-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Submit Another Request</span>
                </button>
              </div>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 text-xs text-zinc-300 leading-relaxed font-light">
                <span className="font-semibold text-amber-300 font-mono uppercase tracking-wider block mb-1">
                  How Done-For-You Works:
                </span>
                Send us your product photo and brief. Our studio custom-engineers the camera angles, photorealistic lighting, materials, and final commercial renders for your brand.
              </div>

              {/* Product / Business Name */}
              <div>
                <label htmlFor="service-brand-input" className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                  Product / Brand Name *
                </label>
                <input
                  id="service-brand-input"
                  type="text"
                  required
                  placeholder="e.g. Veloce Horology Studios"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-zinc-900/90 text-zinc-100 placeholder-zinc-500 text-sm rounded-xl px-4 py-3 border border-zinc-800 focus:outline-none focus:border-amber-500 focus-visible:ring-1 focus-visible:ring-amber-500 transition-colors font-sans"
                />
              </div>

              {/* WhatsApp Number */}
              <div>
                <label htmlFor="service-phone-input" className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                  WhatsApp Contact Number *
                </label>
                <input
                  id="service-phone-input"
                  type="tel"
                  required
                  placeholder="e.g. +1 (555) 019-2834"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-zinc-900/90 text-zinc-100 placeholder-zinc-500 text-sm rounded-xl px-4 py-3 border border-zinc-800 focus:outline-none focus:border-amber-500 focus-visible:ring-1 focus-visible:ring-amber-500 transition-colors font-sans"
                />
              </div>

              {/* Target Aesthetic */}
              <div>
                <label htmlFor="service-type-select" className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                  Target Aesthetic or Directive *
                </label>
                <select
                  id="service-type-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-zinc-900/90 text-zinc-100 text-sm rounded-xl px-4 py-3 border border-zinc-800 focus:outline-none focus:border-amber-500 focus-visible:ring-1 focus-visible:ring-amber-500 transition-colors font-sans cursor-pointer"
                >
                  {creations.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title} ({c.category})
                    </option>
                  ))}
                  <option value="Other Custom Request">Other Custom Request</option>
                </select>
              </div>

              {/* Upload Your Product Photo */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                  Upload Product Photo (Optional)
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 hover:border-amber-500/50 bg-zinc-900/40 rounded-xl p-4 cursor-pointer transition-colors relative overflow-hidden focus-within:border-amber-500">
                  {imageDataUrl ? (
                    <div className="w-full flex flex-col items-center gap-2">
                      <div className="relative w-full h-40 rounded-lg overflow-hidden bg-zinc-950 flex items-center justify-center p-2 border border-zinc-800">
                        <img src={imageDataUrl} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover blur-xl opacity-20 scale-125 pointer-events-none" />
                        <img src={imageDataUrl} alt="Uploaded product" className="relative z-10 max-w-full max-h-full object-contain rounded" />
                      </div>
                      <span className="text-xs text-amber-400 font-medium">Click to replace photo ({fileName})</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-amber-400 mb-1.5" />
                      <span className="text-sm font-medium text-zinc-300">
                        Click to upload or drag & drop
                      </span>
                      <span className="text-xs text-zinc-500 mt-1 font-mono">PNG, JPG, WEBP (auto-compressed)</span>
                    </>
                  )}
                  <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                </label>
              </div>

              {/* Additional Instructions */}
              <div>
                <label htmlFor="service-instructions-input" className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                  Creative Brief & Instructions (Optional)
                </label>
                <textarea
                  id="service-instructions-input"
                  rows={2}
                  placeholder="Describe your desired mood, color accents, commercial lighting, or timeline..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-zinc-900/90 text-zinc-100 placeholder-zinc-500 text-sm rounded-xl px-4 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500 focus-visible:ring-1 focus-visible:ring-amber-500 transition-colors resize-none font-sans"
                />
              </div>

              {/* Dual Action Buttons: Exit & Submit */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  aria-label="Exit and close form"
                  className="w-1/3 py-3.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold text-sm transition-all border border-zinc-800 hover:border-zinc-700 cursor-pointer flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-400 focus:outline-none"
                >
                  <X className="w-4 h-4 text-zinc-400" />
                  <span>Exit</span>
                </button>
                <button
                  type="submit"
                  aria-label="Send Done-For-You service request"
                  className="w-2/3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-amber-400 focus:outline-none"
                >
                  <span>Send Request</span>
                  <Zap className="w-4 h-4 text-zinc-950" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
