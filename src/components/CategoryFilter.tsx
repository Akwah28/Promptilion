import React from 'react';
import { Search } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  totalCount
}) => {
  const allCategories = ['All', ...categories];

  return (
    <div id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-900">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Creation Library</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Browse {totalCount} ready-to-use AI prompts, inspected results, and creative recipes
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search 'product', 'ads', 'video'..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-zinc-900/90 text-zinc-100 placeholder-zinc-500 text-sm rounded-2xl pl-11 pr-4 py-3 border border-zinc-800 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/40 transition-all"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pt-6 pb-2 no-scrollbar">
        {allCategories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold shadow-lg shadow-amber-500/20 border border-amber-400/40'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
