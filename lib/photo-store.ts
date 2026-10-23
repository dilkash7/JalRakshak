/**
 * JalRakshak IndexedDB Photo Store
 * Stores binary photo blobs in the browser's IndexedDB to prevent localStorage quota limits.
 * Provides instant Blob URLs for zero-latency preview and rendering.
 */

const DB_NAME = "jalrakshak_media_db";
const DB_VERSION = 1;
const STORE_NAME = "photos";

interface StoredPhotoRecord {
  id: string;
  blob: Blob;
  mimeType: string;
  name?: string;
  createdAt: number;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.indexedDB !== "undefined";
}

function getDB(): Promise<IDBDatabase> {
  if (!isBrowser()) {
    return Promise.reject(new Error("IndexedDB is only available in browser environments"));
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      dbPromise = null;
      reject((event.target as IDBOpenDBRequest).error);
    };
  });

  return dbPromise;
}

// In-memory URL cache for created Object URLs to prevent memory leaks and recreate when needed
const urlCache = new Map<string, string>();

/**
 * Save an uploaded photo (File or Blob) into IndexedDB.
 * Returns an object with the photo's persistent ID and an immediate object URL for rendering.
 */
export async function savePhoto(
  id: string,
  fileOrBlob: Blob | File,
  name?: string
): Promise<{ id: string; url: string; secureUrl: string }> {
  if (!isBrowser()) {
    return {
      id,
      url: "/images/hero-water-droplet.jpg",
      secureUrl: "/images/hero-water-droplet.jpg",
    };
  }

  const db = await getDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const record: StoredPhotoRecord = {
      id,
      blob: fileOrBlob,
      mimeType: fileOrBlob.type || "image/jpeg",
      name: name || (fileOrBlob instanceof File ? fileOrBlob.name : "photo.jpg"),
      createdAt: Date.now(),
    };

    const req = store.put(record);

    req.onsuccess = () => {
      const objectUrl = URL.createObjectURL(fileOrBlob);
      urlCache.set(id, objectUrl);
      resolve({
        id,
        url: objectUrl,
        secureUrl: objectUrl,
      });
    };

    req.onerror = () => {
      reject(req.error);
    };
  });
}

/**
 * Retrieve a photo Blob by ID from IndexedDB.
 */
export async function getPhotoBlob(id: string): Promise<Blob | null> {
  if (!isBrowser()) return null;

  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => {
        const record = req.result as StoredPhotoRecord | undefined;
        resolve(record ? record.blob : null);
      };

      req.onerror = () => {
        reject(req.error);
      };
    });
  } catch (err) {
    console.warn("[PhotoStore] Error getting photo blob:", err);
    return null;
  }
}

/**
 * Get a valid displayable URL for a photo ID.
 * Uses cached Object URL or generates a new one from the stored Blob.
 */
export async function getPhotoUrl(id: string): Promise<string | null> {
  if (!isBrowser()) return null;

  if (urlCache.has(id)) {
    return urlCache.get(id)!;
  }

  const blob = await getPhotoBlob(id);
  if (!blob) return null;

  const objectUrl = URL.createObjectURL(blob);
  urlCache.set(id, objectUrl);
  return objectUrl;
}

/**
 * Delete a photo by ID from IndexedDB.
 */
export async function deletePhoto(id: string): Promise<void> {
  if (!isBrowser()) return;

  if (urlCache.has(id)) {
    URL.revokeObjectURL(urlCache.get(id)!);
    urlCache.delete(id);
  }

  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("[PhotoStore] Error deleting photo:", err);
  }
}

/**
 * Clear all stored photos from IndexedDB (invoked during full Reset Demo Data).
 */
export async function clearAllPhotos(): Promise<void> {
  if (!isBrowser()) return;

  // Revoke all created URLs
  for (const url of urlCache.values()) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // Ignore URL revocation errors
    }
  }
  urlCache.clear();

  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("[PhotoStore] Error clearing photos:", err);
  }
}
