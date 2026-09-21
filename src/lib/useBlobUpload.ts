'use client';

import { useState } from 'react';
import { upload } from '@vercel/blob/client';

/** Shared client-direct-upload logic (with real progress) for image/video fields. */
export function useBlobUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  async function uploadFile(file: File): Promise<string | null> {
    setUploading(true);
    setProgress(0);
    setError('');
    const token = localStorage.getItem('admin_token');
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/blob-upload',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });
      return blob.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
      return null;
    } finally {
      setUploading(false);
    }
  }

  return { uploading, progress, error, uploadFile };
}
