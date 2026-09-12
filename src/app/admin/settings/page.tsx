'use client';

import { useEffect, useState } from 'react';

type Settings = {
  siteName: string;
  tagline: string;
  contactEmail: string;
  phone?: string;
  address?: string;
  siteUrl?: string;
  homeTitle?: string;
  homeDescription?: string;
  social?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
  };
};

function authHeaders() {
  const token = localStorage.getItem('admin_token');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings', { headers: authHeaders() })
      .then((r) => r.json())
      .then((json) => json.ok && setSettings(json.settings));
  }, []);

  async function save() {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    const res = await fetch('/api/admin/settings', { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(settings) });
    const json = await res.json();
    if (json.ok) setSettings(json.settings);
    setSaving(false);
    setSaved(true);
  }

  if (!settings) return <p style={{ color: 'var(--muted)' }}>Loading…</p>;

  return (
    <div style={{ maxWidth: 520 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Site settings</h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>
        Powers the footer, contact details and social links shown across the site.
      </p>

      <div className="card-flat" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Site name" value={settings.siteName} onChange={(v) => setSettings({ ...settings, siteName: v })} />
        <Field label="Tagline" value={settings.tagline} onChange={(v) => setSettings({ ...settings, tagline: v })} />
        <Field label="Contact email" value={settings.contactEmail} onChange={(v) => setSettings({ ...settings, contactEmail: v })} />
        <Field label="Phone (optional)" value={settings.phone ?? ''} onChange={(v) => setSettings({ ...settings, phone: v })} />
        <Field label="Address (optional)" value={settings.address ?? ''} onChange={(v) => setSettings({ ...settings, address: v })} textarea />

        <Field
          label="Site URL (must match your Google Search Console property exactly)"
          value={settings.siteUrl ?? ''}
          onChange={(v) => setSettings({ ...settings, siteUrl: v })}
        />

        <h2 style={{ fontSize: 15, fontWeight: 800, marginTop: 8 }}>Homepage SEO</h2>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: -12 }}>
          Shown as the headline and snippet on Google and browser tabs for the homepage.
        </p>
        <Field
          label="Page title"
          value={settings.homeTitle ?? ''}
          onChange={(v) => setSettings({ ...settings, homeTitle: v })}
        />
        <Field
          label="Meta description"
          value={settings.homeDescription ?? ''}
          onChange={(v) => setSettings({ ...settings, homeDescription: v })}
          textarea
        />

        <h2 style={{ fontSize: 15, fontWeight: 800, marginTop: 8 }}>Social links</h2>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: -12 }}>Leave blank to hide a platform from the footer.</p>
        <Field
          label="Instagram URL"
          value={settings.social?.instagram ?? ''}
          onChange={(v) => setSettings({ ...settings, social: { ...settings.social, instagram: v } })}
        />
        <Field
          label="LinkedIn URL"
          value={settings.social?.linkedin ?? ''}
          onChange={(v) => setSettings({ ...settings, social: { ...settings.social, linkedin: v } })}
        />
        <Field
          label="Twitter / X URL"
          value={settings.social?.twitter ?? ''}
          onChange={(v) => setSettings({ ...settings, social: { ...settings.social, twitter: v } })}
        />
        <Field
          label="Facebook URL"
          value={settings.social?.facebook ?? ''}
          onChange={(v) => setSettings({ ...settings, social: { ...settings.social, facebook: v } })}
        />
        <Field
          label="YouTube URL"
          value={settings.social?.youtube ?? ''}
          onChange={(v) => setSettings({ ...settings, social: { ...settings.social, youtube: v } })}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8 }}>
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          {saved && <span style={{ color: 'var(--purple)', fontSize: 13.5, fontWeight: 600 }}>Saved.</span>}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...fieldStyle, width: '100%', minHeight: 70, resize: 'vertical' }}
        />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} style={{ ...fieldStyle, width: '100%' }} />
      )}
    </div>
  );
}

const fieldStyle: React.CSSProperties = {
  padding: '10px 14px',
  border: '2px solid var(--ink)',
  borderRadius: 10,
  fontSize: 14.5,
  fontFamily: 'inherit',
};
