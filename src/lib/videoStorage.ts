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
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const delReq = store.delete('active_restaurant_video');
      delReq.onsuccess = () => resolve();
      delReq.onerror = () => resolve();
    });
  } catch {
    // Ignore if not supported
  }
}

export interface VideoUploadResult {
  videoUrl: string;
  filename: string;
  size: number;
  sizeMB: string;
  message?: string;
}

/**
 * Uploads video from mobile or desktop directly to the server,
 * making it accessible to all clients and visitors across all devices.
 */
export async function uploadVideoToServer(
  file: File,
  onProgress?: (percent: number) => void
): Promise<VideoUploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('video', file);

    if (xhr.upload && onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          // Also save in local IndexedDB as fast cache
          saveVideoFile(file).catch(() => {});
          resolve({
            videoUrl: res.videoUrl,
            filename: res.filename,
            size: res.size,
            sizeMB: res.sizeMB,
            message: res.message
          });
        } catch (parseErr) {
          reject(new Error('Resposta inválida do servidor ao salvar vídeo.'));
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          reject(new Error(errRes.error || `Erro ${xhr.status} no upload do vídeo.`));
        } catch {
          reject(new Error(`Falha no upload do vídeo (Status ${xhr.status}).`));
        }
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Falha de conexão durante o envio do vídeo. Verifique sua internet.'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload do vídeo cancelado.'));
    });

    xhr.open('POST', '/api/upload-video', true);
    xhr.send(formData);
  });
}

/**
 * Resets the active video on the server back to the default recording
 */
export async function resetVideoOnServer(): Promise<string> {
  try {
    const res = await fetch('/api/reset-video', { method: 'POST' });
    const data = await res.json();
    await clearSavedVideo();
    return data.videoUrl || '/dende-e-brasa-espaco.mp4';
  } catch (err) {
    console.error('Error resetting video on server', err);
    await clearSavedVideo();
    return '/dende-e-brasa-espaco.mp4';
  }
}

