// IndexedDB Persistent Video Store for Dendê e Brasa
const DB_NAME = 'dende_brasa_media';
const STORE_NAME = 'videos';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveVideoFile(file: File): Promise<string> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const putReq = store.put(file, 'active_restaurant_video');

    putReq.onsuccess = () => {
      const url = URL.createObjectURL(file);
      resolve(url);
    };
    putReq.onerror = () => reject(putReq.error);
  });
}

export async function getSavedVideoUrl(): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get('active_restaurant_video');

      getReq.onsuccess = () => {
        const file = getReq.result as File | undefined;
        if (file instanceof Blob) {
          const url = URL.createObjectURL(file);
          resolve(url);
        } else {
          resolve(null);
        }
      };
      getReq.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function clearSavedVideo(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete('active_restaurant_video');
  } catch (err) {
    console.error('Error clearing video from IndexedDB', err);
  }
}
