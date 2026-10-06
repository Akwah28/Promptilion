import { ServiceRequest, MediaAsset, NewsletterSubscriber } from '../types';

export const INITIAL_CATEGORIES: string[] = [
  'Products',
  'Ads',
  'Branding',
  'Social',
  'Food',
  'Real Estate',
  'Video',
  'Fashion',
  'Packaging'
];

export const INITIAL_SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: 'req-01',
    businessName: 'Veloce Horology Co.',
    whatsappNumber: '+1 415 890 2341',
    selectedCreation: 'Product Explosion',
    productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    additionalInstructions: 'Need our titanium diving watch displayed in an exploded schematic render for our upcoming Kickstarter campaign.',
    status: 'new',
    createdAt: '2026-09-26T09:30:00Z',
    adminNotes: 'High priority lead. Client wants black titanium finish highlighted.'
  },
  {
    id: 'req-02',
    businessName: 'L’Aura Skincare Paris',
    whatsappNumber: '+33 6 12 34 56 78',
    selectedCreation: 'Luxury Studio Shot',
    productImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    additionalInstructions: 'Looking for 3 luxury serum bottle visuals with warm amber lighting and white marble reflections.',
    status: 'contacted',
    createdAt: '2026-09-25T14:15:00Z',
    adminNotes: 'Reached out via WhatsApp with portfolio samples. Waiting on high-res bottle PNGs.'
  },
  {
    id: 'req-03',
    businessName: 'Apex Audio Labs',
    whatsappNumber: '+44 7700 900077',
    selectedCreation: 'Kinetic Ad Creative',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    additionalInstructions: 'Need 5 high-voltage Instagram Story ads for our wireless noise-cancelling headphones drop.',
    status: 'in_progress',
    createdAt: '2026-09-24T18:40:00Z',
    adminNotes: 'Drafting kinetic neon renders. Delivery scheduled for Monday.'
  }
];

export const INITIAL_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'med-01',
    name: 'watch-exploded-master.jpg',
    url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
    category: 'Products',
    createdAt: '2026-09-20',
    size: '2.4 MB'
  },
  {
    id: 'med-02',
    name: 'luxury-marble-pedestal.jpg',
    url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    category: 'Products',
    createdAt: '2026-09-21',
    size: '3.1 MB'
  },
  {
    id: 'med-03',
    name: 'kinetic-cyber-ad.jpg',
    url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
    category: 'Ads',
    createdAt: '2026-09-22',
    size: '1.8 MB'
  }
];

export const INITIAL_SUBSCRIBERS: NewsletterSubscriber[] = [
  {
    id: 'sub-01',
    email: 'elena.rostova@atelier-vogue.com',
    subscribedAt: '2026-10-02T16:20:00Z',
    source: 'Footer Gazette',
    status: 'active'
  },
  {
    id: 'sub-02',
    email: 'marcus.vance@kineticdesigns.io',
    subscribedAt: '2026-10-03T11:45:00Z',
    source: 'Footer Gazette',
    status: 'active'
  },
  {
    id: 'sub-03',
    email: 'sophia.chen@luxurymedia.co',
    subscribedAt: '2026-10-04T08:15:00Z',
    source: 'Footer Gazette',
    status: 'active'
  }
];
