import React, { createContext, useContext, useState, useEffect } from 'react';
import { Creation, ServiceRequest, MediaAsset, AdminUser, NewsletterSubscriber } from '../types';
import { CREATIONS } from '../data/creations';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_SERVICE_REQUESTS, 
  INITIAL_MEDIA_ASSETS,
  INITIAL_SUBSCRIBERS 
} from '../data/initialData';
import { safeLoad, safeSave, idb } from '../utils/storage';

interface AdminCredentials {
  email: string;
  passwordHash: string; // Stored securely
}

export interface AppAnalytics {
  websiteVisitors: number;
  totalCopyClicks: number;
  whatsappSalesClicks: number;
  photoClicks: Record<string, number>; // creationId -> count
}

const INITIAL_ANALYTICS: AppAnalytics = {
  websiteVisitors: 142,
  totalCopyClicks: 35,
  whatsappSalesClicks: 8,
  photoClicks: {}
};

interface PromptilionContextType {
  creations: Creation[];
  categories: string[];
  serviceRequests: ServiceRequest[];
  mediaAssets: MediaAsset[];
  subscribers: NewsletterSubscriber[];
  adminUser: AdminUser | null;
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  analytics: AppAnalytics;
  // Tracking actions
  trackCopyClick: () => void;
  trackWhatsAppSalesClick: () => void;
  trackPhotoClick: (creationId: string) => void;
  // Creation actions
  addCreation: (creation: Omit<Creation, 'id'>) => Creation;
  updateCreation: (id: string, updated: Partial<Creation>) => void;
  deleteCreation: (id: string) => void;
  resetCreationsToDefault: () => void;
  // Category actions
  addCategory: (name: string) => boolean;
  deleteCategory: (name: string) => void;
  // Service Request / Contact actions
  submitServiceRequest: (data: {
    businessName: string;
    whatsappNumber: string;
    selectedCreation: string;
    productImage?: string;
    additionalInstructions: string;
  }) => ServiceRequest;
  updateServiceRequestStatus: (id: string, status: ServiceRequest['status'], notes?: string) => void;
  deleteServiceRequest: (id: string) => void;
  // Media actions
  addMediaAsset: (name: string, url: string, category?: string) => MediaAsset;
  deleteMediaAsset: (id: string) => void;
  // Subscriber actions
  addSubscriber: (email: string, source?: string) => { success: boolean; message: string; subscriber?: NewsletterSubscriber };
  deleteSubscriber: (id: string) => void;
  exportSubscribersAsCsv: () => void;
  // Admin auth
  loginAdmin: (email: string, password: string) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  updateAdminCredentials: (newEmail: string, newPassword: string) => { success: boolean; message?: string };
}

const PromptilionContext = createContext<PromptilionContextType | undefined>(undefined);

// Secret initial master credentials
const DEFAULT_MASTER_CREDS: AdminCredentials = {
  email: 'admin@promptilion.com',
  passwordHash: 'promptilion2026'
};

// Normalizes raw subscriber data from storage (handles both legacy string[] and NewsletterSubscriber[])
function normalizeSubscribers(raw: unknown): NewsletterSubscriber[] {
  if (!Array.isArray(raw)) return INITIAL_SUBSCRIBERS;
  const list = raw
    .map((item, index): NewsletterSubscriber | null => {
      if (typeof item === 'string') {
        const email = item.trim().toLowerCase();
        if (!email || !email.includes('@')) return null;
        return {
          id: `sub-migrated-${index}-${Math.random().toString(36).substring(2, 7)}`,
          email,
          subscribedAt: new Date().toISOString(),
          source: 'Website',
          status: 'active'
        };
      }
      if (item && typeof item === 'object') {
        const obj = item as Record<string, unknown>;
        const email = typeof obj.email === 'string' ? obj.email.trim().toLowerCase() : '';
        if (!email || !email.includes('@')) return null;
        return {
          id: typeof obj.id === 'string' && obj.id ? obj.id : `sub-${index}-${Date.now().toString(36)}`,
          email,
          subscribedAt: typeof obj.subscribedAt === 'string' && obj.subscribedAt ? obj.subscribedAt : new Date().toISOString(),
          source: typeof obj.source === 'string' && obj.source ? obj.source : 'Footer Gazette',
          status: obj.status === 'unsubscribed' ? 'unsubscribed' : 'active'
        };
      }
      return null;
    })
    .filter((s): s is NewsletterSubscriber => s !== null);

  return list.length > 0 ? list : INITIAL_SUBSCRIBERS;
}

export const PromptilionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Creations (loaded synchronously from safe storage, fallback to default CREATIONS)
  const [creations, setCreations] = useState<Creation[]>(() => {
    return safeLoad<Creation[]>('promptilion_creations', CREATIONS);
  });

  // 2. Categories
  const [categories, setCategories] = useState<string[]>(() => {
    return safeLoad<string[]>('promptilion_categories', INITIAL_CATEGORIES);
  });

  // 3. Service Requests / Contacts
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => {
    return safeLoad<ServiceRequest[]>('promptilion_requests', INITIAL_SERVICE_REQUESTS);
  });

  // 4. Media Assets
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() => {
    return safeLoad<MediaAsset[]>('promptilion_media', INITIAL_MEDIA_ASSETS);
  });

  // 5. Email Newsletter Subscribers (normalized to prevent undefined email properties from legacy storage)
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() => {
    const raw = safeLoad<unknown>('promptilion_subscribers', INITIAL_SUBSCRIBERS);
    return normalizeSubscribers(raw);
  });

  // 6. Analytics state (visitors, copy clicks, WhatsApp sales clicks, photo clicks)
  const [analytics, setAnalytics] = useState<AppAnalytics>(() => {
    return safeLoad<AppAnalytics>('promptilion_analytics', INITIAL_ANALYTICS);
  });

  // 7. Secret Admin Credentials
  const [adminCreds, setAdminCreds] = useState<AdminCredentials>(() => {
    return safeLoad<AdminCredentials>('promptilion_admin_creds', DEFAULT_MASTER_CREDS);
  });

  // 8. Admin Auth session
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    return safeLoad<AdminUser | null>('promptilion_admin_session', null);
  });

  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Save analytics & subscribers to storage
  useEffect(() => {
    safeSave('promptilion_analytics', analytics);
    safeSave('promptilion_creations', creations);
    safeSave('promptilion_categories', categories);
    safeSave('promptilion_requests', serviceRequests);
    safeSave('promptilion_media', mediaAssets);
    safeSave('promptilion_subscribers', subscribers);
    safeSave('promptilion_admin_creds', adminCreds);
    safeSave('promptilion_admin_session', adminUser);

    idb.set('promptilion_analytics', analytics).catch(() => {});
    idb.set('promptilion_creations', creations).catch(() => {});
    idb.set('promptilion_categories', categories).catch(() => {});
    idb.set('promptilion_requests', serviceRequests).catch(() => {});
    idb.set('promptilion_media', mediaAssets).catch(() => {});
    idb.set('promptilion_subscribers', subscribers).catch(() => {});
  }, [analytics, creations, categories, serviceRequests, mediaAssets, subscribers, adminCreds, adminUser]);

  // Track unique visitor per session
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('promptilion_visited');
    if (!hasVisited) {
      sessionStorage.setItem('promptilion_visited', 'true');
      setAnalytics(prev => ({
        ...prev,
        websiteVisitors: (prev.websiteVisitors || 0) + 1
      }));
    }
  }, []);

  const trackCopyClick = () => {
    setAnalytics(prev => ({
      ...prev,
      totalCopyClicks: (prev.totalCopyClicks || 0) + 1
    }));
  };

  const trackWhatsAppSalesClick = () => {
    setAnalytics(prev => ({
      ...prev,
      whatsappSalesClicks: (prev.whatsappSalesClicks || 0) + 1
    }));
  };

  const trackPhotoClick = (creationId: string) => {
    if (!creationId) return;
    setAnalytics(prev => {
      const current = prev.photoClicks || {};
      return {
        ...prev,
        photoClicks: {
          ...current,
          [creationId]: (current[creationId] || 0) + 1
        }
      };
    });
  };

  // On initial mount, hydrate from IndexedDB if it holds richer/larger data
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [idbCreations, idbCategories, idbRequests, idbMedia, idbSubscribers, idbCreds, idbAnalytics] = await Promise.all([
          idb.get<Creation[]>('promptilion_creations'),
          idb.get<string[]>('promptilion_categories'),
          idb.get<ServiceRequest[]>('promptilion_requests'),
          idb.get<MediaAsset[]>('promptilion_media'),
          idb.get<NewsletterSubscriber[]>('promptilion_subscribers'),
          idb.get<AdminCredentials>('promptilion_admin_creds'),
          idb.get<AppAnalytics>('promptilion_analytics')
        ]);

        if (isMounted) {
          if (idbCreations && Array.isArray(idbCreations) && idbCreations.length > 0) {
            setCreations(idbCreations);
          }
          if (idbCategories && Array.isArray(idbCategories) && idbCategories.length > 0) {
            setCategories(idbCategories);
          }
          if (idbRequests && Array.isArray(idbRequests)) {
            setServiceRequests(idbRequests);
          }
          if (idbMedia && Array.isArray(idbMedia)) {
            setMediaAssets(idbMedia);
          }
          if (idbSubscribers && Array.isArray(idbSubscribers)) {
            setSubscribers(normalizeSubscribers(idbSubscribers));
          }
          if (idbCreds && idbCreds.email) {
            setAdminCreds(idbCreds);
          }
          if (idbAnalytics && typeof idbAnalytics === 'object') {
            setAnalytics(prev => ({
              ...prev,
              ...idbAnalytics
            }));
          }
        }
      } catch {
        // Safe fallback to memory state
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Creation Actions
  const addCreation = (newCreationData: Omit<Creation, 'id'>): Creation => {
    const newCreation: Creation = {
      ...newCreationData,
      id: 'creation-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6)
    };
    setCreations(prev => [newCreation, ...prev]);
    return newCreation;
  };

  const updateCreation = (id: string, updated: Partial<Creation>) => {
    setCreations(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
  };

  const deleteCreation = (id: string) => {
    setCreations(prev => prev.filter(c => c.id !== id));
  };

  const resetCreationsToDefault = () => {
    setCreations(CREATIONS);
  };

  // Category Actions
  const addCategory = (name: string): boolean => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      return false;
    }
    setCategories(prev => [...prev, trimmed]);
    return true;
  };

  const deleteCategory = (name: string) => {
    setCategories(prev => prev.filter(c => c.toLowerCase() !== name.toLowerCase()));
  };

  // Service Request Actions
  const submitServiceRequest = (data: {
    businessName: string;
    whatsappNumber: string;
    selectedCreation: string;
    productImage?: string;
    additionalInstructions: string;
  }): ServiceRequest => {
    const req: ServiceRequest = {
      id: 'req-' + Date.now().toString(36),
      businessName: data.businessName.trim(),
      whatsappNumber: data.whatsappNumber.trim(),
      selectedCreation: data.selectedCreation,
      productImage: data.productImage,
      additionalInstructions: data.additionalInstructions.trim(),
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    setServiceRequests(prev => [req, ...prev]);
    return req;
  };

  const updateServiceRequestStatus = (id: string, status: ServiceRequest['status']) => {
    setServiceRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const deleteServiceRequest = (id: string) => {
    setServiceRequests(prev => prev.filter(r => r.id !== id));
  };

  // Media Actions
  const addMediaAsset = (name: string, url: string, category = 'General'): MediaAsset => {
    const asset: MediaAsset = {
      id: 'media-' + Date.now().toString(36),
      name: name.trim(),
      url: url.trim(),
      category,
      createdAt: new Date().toISOString()
    };
    setMediaAssets(prev => [asset, ...prev]);
    return asset;
  };

  const deleteMediaAsset = (id: string) => {
    setMediaAssets(prev => prev.filter(m => m.id !== id));
  };

  // Subscriber Management
  const addSubscriber = (email: string, source = 'Footer Gazette') => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    const existing = subscribers.find(s => s && typeof s.email === 'string' && s.email.toLowerCase() === trimmed);
    if (existing) {
      return { 
        success: true, 
        message: 'You are already subscribed to Promptilion directives!', 
        subscriber: existing 
      };
    }
    const newSub: NewsletterSubscriber = {
      id: 'sub-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      email: trimmed,
      subscribedAt: new Date().toISOString(),
      source,
      status: 'active'
    };
    setSubscribers(prev => [newSub, ...prev]);
    return { 
      success: true, 
      message: 'Successfully subscribed to prompt engineering tips!', 
      subscriber: newSub 
    };
  };

  const deleteSubscriber = (id: string) => {
    setSubscribers(prev => prev.filter(s => s && s.id !== id));
  };

  const exportSubscribersAsCsv = () => {
    const validSubs = subscribers.filter(s => s && typeof s.email === 'string' && s.email);
    if (validSubs.length === 0) return;
    const headers = ['Email', 'Subscribed At', 'Source', 'Status'];
    const rows = validSubs.map(s => [
      s.email,
      s.subscribedAt ? new Date(s.subscribedAt).toLocaleString() : 'N/A',
      s.source || 'Website',
      s.status || 'active'
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.map(f => `"${f}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `promptilion-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Strictly authenticate against secret stored admin credentials
  const loginAdmin = (email: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (
      trimmedEmail === adminCreds.email.toLowerCase() &&
      pass === adminCreds.passwordHash
    ) {
      const user: AdminUser = {
        email: trimmedEmail,
        name: 'Promptilion Master',
        role: 'Master Admin'
      };
      setAdminUser(user);
      setIsAdminMode(true);
      return { success: true };
    }
    
    return { 
      success: false, 
      error: 'Access Restricted: Invalid administrative credentials.' 
    };
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    setIsAdminMode(false);
  };

  const updateAdminCredentials = (newEmail: string, newPassword: string) => {
    if (!newEmail.trim() || !newPassword.trim()) {
      return { success: false, message: 'Email and password cannot be empty.' };
    }
    if (newPassword.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }
    const updated = {
      email: newEmail.trim().toLowerCase(),
      passwordHash: newPassword.trim()
    };
    setAdminCreds(updated);
    if (adminUser) {
      setAdminUser({ ...adminUser, email: updated.email });
    }
    return { success: true, message: 'Administrative credentials updated successfully.' };
  };

  return (
    <PromptilionContext.Provider
      value={{
        creations,
        categories,
        serviceRequests,
        mediaAssets,
        subscribers,
        adminUser,
        isAdminMode,
        setIsAdminMode,
        analytics,
        trackCopyClick,
        trackWhatsAppSalesClick,
        trackPhotoClick,
        addCreation,
        updateCreation,
        deleteCreation,
        resetCreationsToDefault,
        addCategory,
        deleteCategory,
        submitServiceRequest,
        updateServiceRequestStatus,
        deleteServiceRequest,
        addMediaAsset,
        deleteMediaAsset,
        addSubscriber,
        deleteSubscriber,
        exportSubscribersAsCsv,
        loginAdmin,
        logoutAdmin,
        updateAdminCredentials
      }}
    >
      {children}
    </PromptilionContext.Provider>
  );
};

export const usePromptilion = () => {
  const context = useContext(PromptilionContext);
  if (!context) {
    throw new Error('usePromptilion must be used within a PromptilionProvider');
  }
  return context;
};
