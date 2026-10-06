import React from 'react';

interface PromptilionLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const PromptilionLogo: React.FC<PromptilionLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Luxury Geometric Monogram */}
      <div className={`relative ${iconSizes[size]} shrink-0 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-0.5 border border-amber-500/30 shadow-xl shadow-amber-500/10 group-hover:border-amber-400/60 transition-all duration-300`}>
        <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-zinc-900/90 to-zinc-950 flex items-center justify-center relative overflow-hidden">
          {/* Subtle metallic sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-indigo-500/15" />
          
          <svg
            viewBox="0 0 44 44"
            className="w-3/4 h-3/4 relative z-10 drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="35%" stopColor="#F59E0B" />
                <stop offset="70%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
              <linearGradient id="violetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="100%" stopColor="#C084FC" />
              </linearGradient>
            </defs>

            {/* Stylized geometric P spine and loop */}
            <path
              d="M13 8.5C13 7.67 13.67 7 14.5 7H24C29.52 7 34 11.48 34 17C34 22.52 29.52 27 24 27H19V36C19 36.55 18.55 37 18 37H14C13.45 37 13 36.55 13 36V8.5Z"
              fill="url(#goldGradient)"
            />
            {/* Cutout / inner loop */}
            <path
              d="M19 13H23.5C25.99 13 28 15.01 28 17.5C28 19.99 25.99 22 23.5 22H19V13Z"
              fill="#09090b"
            />
            {/* Prismatic geometric facet */}
            <path
              d="M23.5 13L28 17.5L24 27H19V13H23.5Z"
              fill="url(#violetGradient)"
              opacity="0.25"
            />
            {/* 4-point Diamond Sparkle */}
            <polygon
              points="33,7 34.5,3.5 36,7 39.5,8.5 36,10 34.5,13.5 33,10 29.5,8.5"
              fill="#FEF08A"
            />
          </svg>
        </div>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-['Cinzel',serif] tracking-[0.16em] font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-zinc-100 to-amber-200 ${textSizes[size]}`}>
            PROMPTILION
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        </div>
        {showSubtitle && (
          <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-400 font-semibold font-mono">
            Creative AI Vault
          </span>
        )}
      </div>
    </div>
  );
};
