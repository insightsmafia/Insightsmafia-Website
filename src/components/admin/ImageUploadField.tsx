'use client';

import { useRef, useState } from 'react';
import { proxyImage } from '@/lib/imageProxy';

export default function ImageUploadField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file: File) {
    setUploading(true);
    setError('');
    const token = localStorage.getItem('admin_token');
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const json = await res.json();
      if (json.ok) {
        onChange(json.url);
      } else {
        setError(json.error || 'Upload failed.');
      }
    } catch {
      setError('Upload failed.');
    }
    setUploading(false);
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
              {uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
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
