/**
 * UploadStore — simple in-memory reactive state for tracking a single active upload.
 */

type Listener = () => void;

class UploadStoreClass {
  private isUploading: boolean = false;
  private progress: number = 0;
  private fileName: string = '';
  private params: { uri: string; name: string; size: string } | null = null;
  private metadata: { title: string; author: string; category: string; description: string } | null = null;
  private listeners: Set<Listener> = new Set();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  startUpload(fileName: string, params: { uri: string; name: string; size: string }, metadata: { title: string; author: string; category: string; description: string }) {
    this.isUploading = true;
    this.progress = 0;
    this.fileName = fileName;
    this.params = params;
    this.metadata = metadata;
    this.notify();
  }

  updateProgress(progress: number) {
    this.progress = progress;
    this.notify();
  }

  endUpload() {
    this.isUploading = false;
    this.progress = 0;
    this.fileName = '';
    this.params = null;
    this.metadata = null;
    this.notify();
  }

  getIsUploading() {
    return this.isUploading;
  }

  getProgress() {
    return this.progress;
  }

  getFileName() {
    return this.fileName;
  }

  getParams() {
    return this.params;
  }

  getMetadata() {
    return this.metadata;
  }
}

export const UploadStore = new UploadStoreClass();
