import React from 'react';
import { X, Calendar, Clock, ArrowRight } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogDetailModalProps {
  post: BlogPost | null;
  onClose: () => void;
  onRequestService: () => void;
}

export const BlogDetailModal: React.FC<BlogDetailModalProps> = ({
  post,
  onClose,
  onRequestService
}) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {post.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10 max-h-[80vh] overflow-y-auto space-y-6">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {post.title}
          </h1>

          <div className="space-y-4 text-zinc-300 text-base leading-relaxed pt-4 border-t border-zinc-800">
            {post.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* CTA Box */}
          <div className="mt-10 p-6 bg-gradient-to-r from-amber-500/10 via-zinc-950 to-zinc-900 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-white mb-1">Want us to handle your visuals?</h4>
              <p className="text-xs text-zinc-400">Let Promptilion's studio produce professional campaign images for your business.</p>
            </div>
            <button
              onClick={() => {
                onClose();
                onRequestService();
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold px-6 py-3 rounded-xl transition-all text-sm shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10"
            >
              <span>Create With Us</span>
              <ArrowRight className="w-4 h-4 text-zinc-950" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
