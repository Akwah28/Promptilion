import React from 'react';
import { ArrowRight, Sparkles, Video } from 'lucide-react';
import { Creation } from '../types';
import { usePromptilion } from '../context/PromptilionContext';

interface CreationCardProps {
  creation: Creation;
  onSelect: (creation: Creation) => void;
}

export const CreationCard: React.FC<CreationCardProps> = ({ creation, onSelect }) => {
  const { trackPhotoClick } = usePromptilion();

  const handleClick = () => {
    trackPhotoClick(creation.id);
    onSelect(creation);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-zinc-950/70 rounded-3xl border border-zinc-800/80 hover:border-amber-500/40 overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1 gold-border-glow"
    >
      {/* Image preview */}
      <div className="aspect-[2/3] w-full overflow-hidden relative bg-zinc-950">
        <img
          src={creation.afterImage}
          alt={creation.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />

        {/* AI Creation indicator badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-zinc-950/85 backdrop-blur-md border border-amber-500/30 text-amber-200 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg font-mono">
          {creation.type === 'video' ? (
            <Video className="w-3.5 h-3.5 text-purple-400" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span>{creation.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors mb-2 font-['Cinzel',serif]">
            {creation.title}
          </h3>
          <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed mb-6 font-light">
            {creation.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider font-mono">
            {creation.type === 'video' ? 'Video Recipe' : 'Prompt Recipe'}
          </span>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-400 group-hover:text-amber-300 font-mono">
            <span>View Recipe</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
