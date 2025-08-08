export type BackgroundRemovalMessage =
  | { type: 'progress'; progress: number }
  | { type: 'complete'; data: Blob }
  | { type: 'error'; error: string };

export interface BackgroundRemovalOptions {
  workerUrl: URL;
  onProgress?: (progress: number) => void;
}

export async function removeBackgroundViaWorker(
  imageSrc: string,
  { workerUrl, onProgress }: BackgroundRemovalOptions
): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    let worker: Worker | null = null;
    try {
      worker = new Worker(workerUrl, { type: 'module' });
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

    worker.postMessage({ imageSrc });
  });
}
