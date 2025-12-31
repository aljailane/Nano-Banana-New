export interface GeneratedImage {
  imageUrl: string;
  mimeType: string;
}

export interface ImageUploadState {
  file: File | null;
  previewUrl: string | null;
  base64Data: string | null;
  mimeType: string | null;
}

export interface AlertMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}