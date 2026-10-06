import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, MoveHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  title: string;
  type?: 'image' | 'video';
  videoUrl?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  title,
  type,
  videoUrl
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(rect.width, x));
    const percent = (clamped / rect.width) * 100;
    setSliderPos(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="space-y-3 select-none">
      {/* Interactive Drag Canvas - Instagram 4:5 Portrait Ratio */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative aspect-[2/3] max-h-[620px] sm:max-h-[720px] w-full max-w-2xl mx-auto rounded-3xl overflow-hidden cursor-ew-resize border border-amber-500/30 bg-zinc-950 shadow-2xl shadow-amber-500/10 gold-border-glow"
      >
        {/* AFTER (AI Masterpiece) - Full background layer */}
        <div className="absolute inset-0 w-full h-full">
          {type === 'video' && videoUrl ? (
            <video
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={afterImage}
              alt={`${title} Generated Result`}
              className="w-full h-full object-cover"
              draggable={false}
            />
          )}
          {/* Subtle After Badge */}
          <div className="absolute top-4 right-4 bg-zinc-950/85 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Promptilion Result</span>
          </div>
        </div>

        {/* BEFORE (Source Input) - Clipped Overlay */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img
            src={beforeImage}
            alt={`${title} Source`}
            className="w-full h-full object-cover"
            draggable={false}
          />
          {/* Subtle Before Badge */}
          <div className="absolute top-4 left-4 bg-zinc-950/85 backdrop-blur-md border border-zinc-700 text-zinc-300 text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg font-mono">
            Original Source
          </div>
        </div>

        {/* Divider Bar & Handle */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-200 via-amber-400 to-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-zinc-950 border border-amber-400 shadow-xl shadow-amber-500/40 flex items-center justify-center text-amber-300">
            <MoveHorizontal className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Helper label and quick buttons */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1 font-mono">
        <button
          type="button"
          onClick={() => setSliderPos(0)}
          className="hover:text-amber-300 transition-colors cursor-pointer"
        >
          ◀ View Full Result
        </button>
        <span className="text-[11px] text-zinc-500 uppercase tracking-widest flex items-center gap-1">
          <span>Drag slider to compare</span>
        </span>
        <button
          type="button"
          onClick={() => setSliderPos(100)}
          className="hover:text-amber-300 transition-colors cursor-pointer"
        >
          View Full Source ▶
        </button>
      </div>
    </div>
  );
};
