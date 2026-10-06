/**
 * Hybrid storage manager using IndexedDB with safe localStorage synchronization.
 * IndexedDB has virtually unlimited storage (>500MB), completely eliminating QuotaExceededError.
 */

const DB_NAME = 'promptilion_db';
const DB_VERSION = 1;
const STORE_NAME = 'app_state';

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('IndexedDB not supported'));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (err) {
        reject(err);
      }
    });
  }
  return dbPromise;
}

export const idb = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const db = await getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result ?? null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  },

  async set(key: string, val: unknown): Promise<void> {
    try {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(val, key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      // IndexedDB fallback
    }
  },

  async delete(key: string): Promise<void> {
    try {
      const db = await getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      });
    } catch {
      // Ignore
    }
  }
};

/**
 * Safely saves data to storage.
 * Always saves to IndexedDB. Also attempts to write to localStorage for instant synchronous access.
 * If localStorage quota is exceeded, it cleanly recovers without throwing unhandled exceptions.
 */
export function safeSave<T>(key: string, value: T): void {
  // 1. Asynchronously persist to IndexedDB (virtually unlimited quota)
  idb.set(key, value).catch(() => {});

  // 2. Try writing to localStorage
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (err) {
    // If quota exceeded, remove oversized key from localStorage and rely on IndexedDB
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}

/**
 * Safely reads data synchronously from localStorage on initial render.
 */
export function safeLoad<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw) as T;
    }
  } catch {
    // If parse error or quota corrupted, clear it safely
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
  return fallback;
}
