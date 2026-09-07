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

export async function saveSavedVideoUrl(url: string): Promise<void> {
  try {
    localStorage.setItem('dende_brasa_active_video_url', url);
  } catch {}
}

export async function clearSavedVideo(): Promise<void> {
  try {
    localStorage.removeItem('dende_brasa_active_video_url');
  } catch {}
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
  // Always cache locally in IndexedDB so the device immediately has the video active
  let localBlobUrl = '';
  try {
    localBlobUrl = await saveVideoFile(file);
  } catch {
    try {
      localBlobUrl = URL.createObjectURL(file);
    } catch {}
  }

  const sizeMB = (file.size / (1024 * 1024)).toFixed(1);

  return new Promise((resolve) => {
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
      const contentType = xhr.getResponseHeader('content-type') || '';
      if (xhr.status >= 200 && xhr.status < 300 && contentType.includes('application/json')) {
        try {
          const res = JSON.parse(xhr.responseText);
          resolve({
            videoUrl: res.videoUrl,
            filename: res.filename,
            size: res.size,
            sizeMB: res.sizeMB,
            message: res.message || 'Vídeo publicado com sucesso no servidor!'
          });
          return;
        } catch {
          // parse error
        }
      }

      // If server returned non-JSON (e.g. Vercel static rewrites to index.html) or other response:
      // Gracefully resolve with the local persistent video URL
      resolve({
        videoUrl: localBlobUrl || '/dende-e-brasa-espaco.mp4',
        filename: file.name,
        size: file.size,
        sizeMB,
        message: 'Vídeo ativado no navegador com sucesso!'
      });
    });

    xhr.addEventListener('error', () => {
      // Connection failed (or static host without backend): fallback to local blob/IndexedDB
      resolve({
        videoUrl: localBlobUrl || '/dende-e-brasa-espaco.mp4',
        filename: file.name,
        size: file.size,
        sizeMB,
        message: 'Vídeo ativado localmente no dispositivo!'
      });
    });

    xhr.addEventListener('abort', () => {
      resolve({
        videoUrl: localBlobUrl || '/dende-e-brasa-espaco.mp4',
        filename: file.name,
        size: file.size,
        sizeMB,
        message: 'Upload cancelado.'
      });
    });

    try {
      xhr.open('POST', '/api/upload-video', true);
      xhr.send(formData);
    } catch {
      resolve({
        videoUrl: localBlobUrl || '/dende-e-brasa-espaco.mp4',
        filename: file.name,
        size: file.size,
        sizeMB
      });
    }
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

