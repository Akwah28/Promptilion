export type Category = string;

export interface Creation {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  prompt: string;
  requirements: string[];
  instructions: string[];
  type: 'image' | 'video';
  videoUrl?: string;
  featured: boolean;
  serviceAvailable: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  readTime: string;
  date: string;
  relatedCreationSlug?: string;
  content: string[];
}

export interface ServiceRequest {
  id: string;
  businessName: string;
  whatsappNumber: string;
  selectedCreation: string;
  productImage?: string;
  additionalInstructions: string;
  status: 'new' | 'contacted' | 'in_progress' | 'completed';
  createdAt: string;
  adminNotes?: string;
}

export interface AdminUser {
  email: string;
  name: string;
  role: 'Master Admin' | 'Creative Director' | 'Editor';
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  category?: string;
  createdAt: string;
  size?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  source?: string;
  status: 'active' | 'unsubscribed';
}
