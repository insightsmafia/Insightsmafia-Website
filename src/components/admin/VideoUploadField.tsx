'use client';

import { useRef } from 'react';
import { useBlobUpload } from '@/lib/useBlobUpload';

export default function VideoUploadField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploading, progress, error, uploadFile } = useBlobUpload();

  async function handleFile(file: File) {
    const url = await uploadFile(file);
    if (url) onChange(url);
  }

  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            className="btn"
            style={{ padding: '8px 14px', fontSize: 13 }}
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? `Uploading… ${progress}%` : value ? 'Replace video' : 'Upload video'}
          </button>
        </div>
        {uploading && (
          <div style={{ width: '100%', height: 6, borderRadius: 4, background: 'var(--bg)', border: '1px solid var(--line)', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--purple)', transition: 'width 0.15s ease' }} />
          </div>
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste a YouTube / Vimeo / Instagram / video URL"
          style={{ padding: '8px 12px', border: '2px solid var(--ink)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit' }}
        />
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
      {error && <p style={{ color: 'var(--coral)', fontSize: 12.5, marginTop: 6 }}>{error}</p>}
    </div>
  );
}
