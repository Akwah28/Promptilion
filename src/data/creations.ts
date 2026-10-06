import { Creation } from '../types';

export const CREATIONS: Creation[] = [
  {
    id: '1',
    title: 'Product Explosion',
    slug: 'product-explosion',
    category: 'Products',
    description: 'Turn your ordinary product photo into a professional exploded-view presentation showing the product and its components separated in 3D space.',
    beforeImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80', // Simple watch photo
    afterImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80', // Cinematic exploded tech/watch style
    prompt: 'Act as a professional 3D commercial renderer and product photographer. Take the attached product photo and create an exploded-view 3D presentation. The main product components (casing, dial, internal mechanism, strap) must float harmoniously in mid-air along precise isometric axis lines with clean glowing technical connector lines. Studio cinematic dark background, volumetric rim lighting, 8k resolution, photorealistic metallic and glass textures.',
    requirements: [
      'A clear, high-resolution photo of your product against a neutral background',
      'Brief list of key components or materials if applicable'
    ],
    instructions: [
      'Upload your product photo to ChatGPT.',
      'Copy the prompt above.',
      'Paste the prompt into ChatGPT and send.',
      'Let ChatGPT generate your exploded 3D presentation.',
      'Refine lighting or component separation if necessary.'
    ],
    type: 'image',
    featured: true,
    serviceAvailable: true,
    tags: ['3D', 'Tech', 'Product', 'Exploded View']
  },
  {
    id: '2',
    title: 'Luxury Studio Shot',
    slug: 'luxury-studio-shot',
    category: 'Products',
    description: 'Transform an ordinary product photo into a high-end luxury campaign image with sophisticated reflections and moody shadows.',
    beforeImage: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80', // Smartwatch basic
    afterImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80', // Luxury cosmetic/watch dark marble
    prompt: 'Act as an elite luxury brand art director. Place the attached product onto a polished black Italian marble pedestal. Surround with subtle golden amber backlighting, soft caustic light refractions through crystal glass, and deep matte black shadows. Commercial magazine advertising aesthetic, hyper-detailed surface textures, cinematic depth of field, 8k.',
    requirements: [
      'Clear photo of the product',
      'Preference for dark or light mood'
    ],
    instructions: [
      'Upload your product photo to ChatGPT.',
      'Copy the prompt above and customize background material if desired.',
      'Paste into ChatGPT and run generation.',
      'Download your luxury campaign visual.'
    ],
    type: 'image',
    featured: true,
    serviceAvailable: true,
    tags: ['Luxury', 'Cosmetics', 'Studio', 'Marble']
  },
  {
    id: '3',
    title: 'Kinetic Ad Creative',
    slug: 'kinetic-ad-creative',
    category: 'Ads',
    description: 'Turn a standard product into a polished, high-converting social media advertising banner with bold typography placement zones.',
    beforeImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80', // Headphones
    afterImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80', // Vibrant neon ad backdrop
    prompt: 'Create a high-impact digital advertising visual featuring the attached product. Dynamic neon lighting streaks in cyan and magenta cutting across a dark minimalist architectural concrete studio. Ample negative space in the upper third for headline typography. Commercial billboard style, vibrant color grading, ultra-sharp focus.',
    requirements: [
      'Product image with clear edges',
      'Target color palette or brand vibe'
    ],
    instructions: [
      'Upload the product image to ChatGPT.',
      'Copy and paste the ad creative prompt.',
      'Specify any brand colors if you want custom matching.',
      'Generate and use for your ad campaigns.'
    ],
    type: 'image',
    featured: true,
    serviceAvailable: true,
    tags: ['Ads', 'Neon', 'Social Media', 'Banner']
  },
  {
    id: '4',
    title: 'Cinematic Product Reel',
    slug: 'cinematic-product-reel',
    category: 'Video',
    description: 'Create a short cinematic product motion concept showcasing smooth 360-degree rotation and dramatic lighting transitions.',
    beforeImage: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80', // Camera
    afterImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80', // Cinematic camera setup
    prompt: 'Generate a 5-second cinematic product showcase video prompt for Sora / video models: A smooth macro 360-degree orbit shot around the attached product resting on a dark slate surface. Golden hour sun rays break through soft atmospheric dust motes. Ultra-smooth camera movement, shallow depth of field, photorealistic lighting transitions.',
    requirements: [
      'Product photo or 3D render asset',
      'Desired motion style (orbit, zoom, pan)'
    ],
    instructions: [
      'Upload your product image to ChatGPT / Sora interface.',
      'Copy the video motion prompt above.',
      'Paste into the video generator and set motion parameters.',
      'Export your cinematic reel.'
    ],
    type: 'video',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-42823-large.mp4',
    featured: true,
    serviceAvailable: true,
    tags: ['Video', 'Reel', 'Motion', 'Cinematic']
  },
  {
    id: '5',
    title: 'Artisan Food Styling',
    slug: 'artisan-food-styling',
    category: 'Food',
    description: 'Elevate an ordinary dish or beverage snapshot into a Michelin-star restaurant editorial photograph with warm natural window light.',
    beforeImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80', // Pizza slice
    afterImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', // Gourmet restaurant interior/food
    prompt: 'Act as a professional culinary photographer. Restyle the attached food photo into a moody, sophisticated epicurean editorial shot. Rustic dark wooden table setting, fresh basil garnish, glistening olive oil highlights, soft morning window side-lighting, shallow depth of field (f/1.8), Michelin guide aesthetic.',
    requirements: [
      'Original photo of the food or dish',
      'Key ingredients or dish name'
    ],
    instructions: [
      'Upload your food photograph to ChatGPT.',
      'Copy and paste the culinary styling prompt.',
      'Review the generated gourmet visual.'
    ],
    type: 'image',
    featured: false,
    serviceAvailable: true,
    tags: ['Food', 'Restaurant', 'Culinary', 'Editorial']
  },
  {
    id: '6',
    title: 'Architectural Real Estate Glow',
    slug: 'architectural-real-estate-glow',
    category: 'Real Estate',
    description: 'Transform a daytime real estate exterior snapshot into a breathtaking twilight architectural masterwork with warm interior lighting.',
    beforeImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', // House exterior day
    afterImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', // Luxury villa twilight
    prompt: 'Act as an architectural visualization expert. Convert the attached home exterior photo into a stunning golden-hour twilight showcase. Warm interior lights glowing through expansive floor-to-ceiling glass windows, manicured landscaping with subtle uplighting, deep indigo evening sky with soft sunset gradient, architectural Digest photography style.',
    requirements: [
      'Clear daylight photo of the property facade',
      'Any specific architectural highlights'
    ],
    instructions: [
      'Upload the house photo to ChatGPT.',
      'Copy the twilight architectural prompt.',
      'Generate the high-end listing visual.'
    ],
    type: 'image',
    featured: false,
    serviceAvailable: true,
    tags: ['Real Estate', 'Architecture', 'Twilight', 'Interior Design']
  },
  {
    id: '7',
    title: 'Minimalist Brand Identity Kit',
    slug: 'minimalist-brand-identity-kit',
    category: 'Branding',
    description: 'Present a new logo or brand mark as a tangible, high-end stationery and embossed packaging mockup.',
    beforeImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80', // Logo sketch
    afterImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80', // Brand mockup flatlay
    prompt: 'Act as a senior brand identity designer. Place the attached logo vector onto a minimalist stationery flatlay featuring textured cotton business cards with blind debossing, matte black ink pen, and neutral linen cardstock. Overhead flatlay composition, natural soft shadows, premium Scandinavian design aesthetic.',
    requirements: [
      'Logo file or graphic in high contrast',
      'Preferred paper or material texture'
    ],
    instructions: [
      'Upload your logo to ChatGPT.',
      'Copy and paste the branding mockup prompt.',
      'Generate presentation-ready client assets.'
    ],
    type: 'image',
    featured: false,
    serviceAvailable: true,
    tags: ['Branding', 'Logo', 'Mockup', 'Stationery']
  },
  {
    id: '8',
    title: 'Social Media Aesthetic Grid',
    slug: 'social-media-aesthetic-grid',
    category: 'Social',
    description: 'Create a cohesive, editorial multi-post Instagram grid concept centered around your product or lifestyle brand.',
    beforeImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80', // Phone screen
    afterImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80', // Abstract aesthetic visual
    prompt: 'Design a cohesive 3x3 Instagram grid aesthetic featuring the attached product theme. Unified warm terracotta and sage color palette, mix of editorial lifestyle shots, minimalist typography quote cards, and tactile product closeups. High-end social curation look.',
    requirements: [
      'Brand moodboard or key product image',
      'Desired color tone'
    ],
    instructions: [
      'Upload reference assets to ChatGPT.',
      'Copy the social grid prompt and run.',
      'Split or use images for your social feed.'
    ],
    type: 'image',
    featured: false,
    serviceAvailable: true,
    tags: ['Social', 'Instagram', 'Grid', 'Aesthetic']
  }
];
