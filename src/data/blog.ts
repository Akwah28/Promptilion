import { BlogPost } from '../types';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'How to Create an Exploded Product Image With AI',
    slug: 'how-to-create-exploded-product-image-with-ai',
    excerpt: 'Step-by-step guide on transforming flat product shots into technical 3D exploded presentations without complex 3D software.',
    readTime: '4 min read',
    date: 'October 12, 2026',
    relatedCreationSlug: 'product-explosion',
    content: [
      'Product presentation is everything in modern e-commerce. Traditionally, creating an exploded 3D view required specialized CAD software, 3D artists, and days of rendering time.',
      'With modern AI image generation models and well-crafted prompts, you can achieve stunning exploded visual presentations in minutes.',
      'Step 1: Start with a clean, high-resolution photo of your product against a solid neutral background. Ensure the lighting is even.',
      'Step 2: Use Promptilion to copy the Product Explosion prompt recipe.',
      'Step 3: Paste it into ChatGPT along with your product photo, and let the AI generate the isometric component separation and volumetric studio lighting.',
      'If you prefer not to fiddle with prompts or fine-tuning, Promptilion also offers a bespoke done-for-you service where our creative studio produces these visuals directly for your business.'
    ]
  },
  {
    id: '2',
    title: 'AI Product Photography for Small Businesses',
    slug: 'ai-product-photography-for-small-businesses',
    excerpt: 'How boutique brands and creators are upgrading their catalog imagery using smart AI prompts and studio presets.',
    readTime: '5 min read',
    date: 'September 28, 2026',
    relatedCreationSlug: 'luxury-studio-shot',
    content: [
      'High production costs used to be the main barrier stopping small brands from competing with enterprise advertising.',
      'Today, Promptilion prompts allow you to place any basic product onto marble pedestals, tropical beaches, or neon-lit concrete studios.',
      'Discover our curated gallery of studio shots and luxury prompts to get started in seconds.'
    ]
  },
  {
    id: '3',
    title: 'Creating Cinematic Product Reels and Video Concepts',
    slug: 'creating-cinematic-product-reels-and-video-concepts',
    excerpt: 'Move beyond static images. Learn how to prompt AI video models for smooth 360-degree product showcases.',
    readTime: '6 min read',
    date: 'September 15, 2026',
    relatedCreationSlug: 'cinematic-product-reel',
    content: [
      'Video content dominates social media feeds like Instagram Reels, TikTok, and YouTube Shorts.',
      'By using video generation prompts paired with your product assets, you can storyboard professional commercials with zero filming gear.'
    ]
  }
];
