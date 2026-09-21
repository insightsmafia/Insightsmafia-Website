'use client';

import { useRef } from 'react';
import { proxyImage } from '@/lib/imageProxy';
import { useBlobUpload } from '@/lib/useBlobUpload';

export default function ImageUploadField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploading, progress, error, uploadFile } = useBlobUpload();

  async function handleFile(file: File) {
    const url = await uploadFile(file);
    if (url) onChange(url);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={proxyImage(value)}
            alt=""
            style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 10, border: '2px solid var(--ink)', flexShrink: 0 }}
          />
        )}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn"
              style={{ padding: '8px 14px', fontSize: 13 }}
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? `Uploading… ${progress}%` : value ? 'Replace image' : 'Upload image'}
            </button>
            {value && (
              <button
                type="button"
                className="btn"
                style={{ padding: '8px 14px', fontSize: 13, color: 'var(--coral)' }}
                onClick={() => onChange('')}
              >
                Remove
              </button>
            )}
          </div>
          {uploading && (
            <div style={{ width: '100%', height: 6, borderRadius: 4, background: 'var(--bg)', border: '1px solid var(--line)', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--purple)', transition: 'width 0.15s ease' }} />
            </div>
          )}
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste an image URL"
            style={{ padding: '8px 12px', border: '2px solid var(--ink)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit' }}
          />
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
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
