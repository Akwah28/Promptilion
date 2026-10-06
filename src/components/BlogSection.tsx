import React from 'react';
import { BookOpen, ArrowRight, Clock, Calendar } from 'lucide-react';
import { BLOG_POSTS } from '../data/blog';
import { BlogPost } from '../types';

interface BlogSectionProps {
  onOpenArticle: (post: BlogPost) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onOpenArticle }) => {
  return (
    <section id="blog" className="py-24 bg-zinc-950/60 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-amber-500/20 text-xs font-semibold text-amber-300 mb-4">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Studio Guides & Tutorials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Master AI Creation Techniques
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-2">
            In-depth guides on product photography, exploded 3D visual setups, and high-converting commercial ad prompting.
          </p>
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => onOpenArticle(post)}
              className="group bg-zinc-900/40 rounded-3xl border border-zinc-800/80 hover:border-amber-500/40 p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-amber-400/80" />
                    {post.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-amber-200 transition-colors mb-3">
                  {post.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold text-amber-400 pt-4 border-t border-zinc-900 group-hover:text-amber-300">
                <span>Read Article</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
