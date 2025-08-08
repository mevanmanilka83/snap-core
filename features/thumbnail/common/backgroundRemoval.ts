export type BackgroundRemovalMessage =
  | { type: 'progress'; progress: number }
  | { type: 'complete'; data: Blob }
  | { type: 'error'; error: string };

export interface BackgroundRemovalOptions {
  onProgress?: (progress: number) => void;
}

export async function removeBackgroundViaWorker(
  imageSrc: string,
  { onProgress }: BackgroundRemovalOptions
): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    let worker: Worker | null = null;
    try {
      // Use the correct worker path
      worker = new Worker(new URL('./workers/background-removal.worker.ts', import.meta.url), { type: 'module' });
    } catch (e) {
      reject(new Error('Failed to initialize background removal worker'));
      return;
    }

    const cleanup = () => {
      if (worker) {
        worker.terminate();
        worker = null;
      }
    };

    worker.onmessage = (e: MessageEvent<BackgroundRemovalMessage>) => {
      const msg = e.data;
      if (msg.type === 'progress') {
        onProgress?.(msg.progress);
      } else if (msg.type === 'complete') {
        const blob = msg.data;
        if (!(blob instanceof Blob) || !blob.type.startsWith('image/') || blob.size === 0) {
          cleanup();
          reject(new Error('Invalid image data received from worker'));
          return;
        }
        cleanup();
        resolve(blob);
      } else if (msg.type === 'error') {
        cleanup();
        reject(new Error(msg.error || 'Background removal failed'));
      }
    };

    worker.onerror = () => {
      cleanup();
      reject(new Error('Background removal worker error'));
    };

    try {
      // Try fetch validation to avoid CORS/404 surprises
      fetch(imageSrc, { mode: 'cors' })
        .then(resp => {
          if (!resp.ok) throw new Error('Unable to fetch image for processing');
        })
        .catch(() => {
          // proceed anyway; worker will handle blob URLs too
        })
        .finally(() => {
          if (worker) {
            worker.postMessage({ imageSrc });
          }
        });
    } catch {
      // proceed anyway; worker will handle blob URLs too
      if (worker) {
        worker.postMessage({ imageSrc });
      }
    }
  });
}
