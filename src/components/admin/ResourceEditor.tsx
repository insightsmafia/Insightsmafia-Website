'use client';

import { useEffect, useRef, useState } from 'react';
import ImageUploadField from './ImageUploadField';
import VideoUploadField from './VideoUploadField';
import { normalizeVideos, normalizeImages, VideoItem, ImageItem } from '@/lib/normalizeVideos';

type Item = Record<string, any>;

export type Field =
  | { name: string; label: string; type: 'text' | 'textarea'; placeholder?: string; required?: boolean }
  | { name: string; label: string; type: 'number' }
  | { name: string; label: string; type: 'checkbox' }
  | { name: string; label: string; type: 'image' }
  | { name: string; label: string; type: 'imagelist' }
  | { name: string; label: string; type: 'videolist' }
  | { name: string; label: string; type: 'select'; options: { value: string; label: string }[] };

type Props = {
  resource: string;
  title: string;
  fields: Field[];
  defaults?: Item;
  getLabel: (item: Item) => string;
  getSubtitle?: (item: Item) => string;
  /** Enables drag-to-reorder handles on each row; persists the new `order` values on drop. */
  reorderable?: boolean;
  /** Restricts the list (and everything derived from it) to items passing this check. */
  filter?: (item: Item) => boolean;
};

function GripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: 'var(--muted)' }}>
      {[4, 8, 12].flatMap((cy) => [5, 11].map((cx) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.4" fill="currentColor" />))}
    </svg>
  );
}

// Per-video/image "which work categories does this show under" control.
// A brand-new row starts pre-checked for whichever admin page it was added
// from (see the "+ Add" buttons below), but every checkbox stays fully
// editable after that - a case study can now be opened for editing from
// any category page it appears on, so treating one category as
// permanently locked no longer makes sense (whichever page you happened
// to open it from isn't necessarily special to that specific video).
function CategoryShowOn({
  categories,
  homeCategoryId,
  options,
  onChange,
}: {
  categories: string[];
  homeCategoryId?: string;
  options: { value: string; label: string }[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, border: '2px solid var(--ink)', borderRadius: 10, padding: '10px 12px' }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.3 }}>Show on</span>
      {options.map((c) => {
        const checked = categories.includes(c.value);
        return (
          <label key={c.value} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onChange(checked ? categories.filter((v) => v !== c.value) : [...categories, c.value])}
              style={{ width: 16, height: 16 }}
            />
            {c.label}
            {c.value === homeCategoryId && <span style={{ color: 'var(--muted)', fontSize: 12 }}>(this page)</span>}
          </label>
        );
      })}
    </div>
  );
}

function authHeaders() {
  const token = localStorage.getItem('admin_token');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

export default function ResourceEditor({ resource, title, fields, defaults = {}, getLabel, getSubtitle, reorderable, filter }: Props) {
  const endpoint = `/api/admin/${resource}`;
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [loading, setLoading] = useState(true);
  const dragIndex = useRef<number | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  // Drag-to-reorder for the per-item image/video rows inside the edit
  // modal (a separate, smaller drag system from the one above, which
  // reorders whole resource cards in the list behind the modal).
  const listDragFrom = useRef<number | null>(null);
  const [listDragOver, setListDragOver] = useState<{ field: string; index: number } | null>(null);
  // Only fetched when the form actually has an imagelist/videolist field,
  // for the per-item "which work category does this show under" dropdown.
  const [workCategoryOptions, setWorkCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const needsWorkCategories = fields.some((f) => f.type === 'imagelist' || f.type === 'videolist');

  useEffect(() => {
    if (!needsWorkCategories) return;
    fetch('/api/admin/work-categories', { headers: authHeaders() })
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setWorkCategoryOptions(json.items.map((c: { id: string; label: string }) => ({ value: c.id, label: c.label })));
      });
  }, [needsWorkCategories]);

  function load() {
    setLoading(true);
    fetch(endpoint, { headers: authHeaders() })
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setItems(filter ? json.items.filter(filter) : json.items);
        setLoading(false);
      });
  }

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (editing) setSaveError('');
  }, [editing]);

  function openNew() {
    const blank: Item = { published: true, order: items.length };
    for (const f of fields) {
      if (!(f.name in blank)) blank[f.name] = f.type === 'checkbox' ? false : f.type === 'number' ? 0 : f.type === 'imagelist' || f.type === 'videolist' ? [] : '';
    }
    setEditing({ ...blank, ...defaults });
  }

  function openEdit(item: Item) {
    const draft = { ...item };
    for (const f of fields) {
      if (f.type === 'videolist') {
        draft[f.name] = normalizeVideos(item[f.name]);
      } else if (f.type === 'imagelist') {
        draft[f.name] = normalizeImages(item[f.name]);
      }
    }
    setEditing(draft);
  }

  async function save() {
    if (!editing) return;
    // `required` on the <input> has no effect since Save isn't a form submit -
    // check it ourselves, otherwise a blank title/slug silently saves.
    const missing = fields.filter((f) => 'required' in f && f.required && !String(editing[f.name] ?? '').trim());
    if (missing.length > 0) {
      setSaveError(`${missing.map((f) => f.label).join(', ')} ${missing.length > 1 ? 'are' : 'is'} required.`);
      return;
    }
    setSaveError('');
    setSaving(true);
    const payload: Item = { ...defaults };
    for (const f of fields) {
      const v = editing[f.name];
      payload[f.name] = f.type === 'number' ? Number(v || 0) : f.type === 'imagelist' || f.type === 'videolist' ? JSON.stringify(v || []) : v;
    }
    if ('published' in editing) payload.published = editing.published;
    if ('order' in editing) payload.order = Number(editing.order || 0);

    if (editing.id) {
      await fetch(endpoint, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ id: editing.id, ...payload }) });
    } else {
      await fetch(endpoint, { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
    }
    setSaving(false);
    setEditing(null);
    load();
  }

  async function remove(item: Item) {
    if (!confirm(`Delete "${getLabel(item)}"? This can't be undone.`)) return;
    await fetch(endpoint, { method: 'DELETE', headers: authHeaders(), body: JSON.stringify({ id: item.id }) });
    load();
  }

  async function togglePublish(item: Item) {
    await fetch(endpoint, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ id: item.id, published: !item.published }) });
    load();
  }

  function handleDragStart(index: number) {
    dragIndex.current = index;
  }

  function handleListDragStart(index: number) {
    listDragFrom.current = index;
  }

  function handleListDragOver(e: React.DragEvent, fieldName: string, index: number, arr: any[]) {
    e.preventDefault();
    setListDragOver({ field: fieldName, index });
    const from = listDragFrom.current;
    if (from === null || from === index || !editing) return;
    const next = [...arr];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    setEditing({ ...editing, [fieldName]: next });
    listDragFrom.current = index;
  }

  function handleListDragEnd() {
    listDragFrom.current = null;
    setListDragOver(null);
  }

  function handleDragOver(e: React.DragEvent, index: number, item: Item) {
    e.preventDefault();
    setDragOverId(item.id);
    const from = dragIndex.current;
    if (from === null || from === index) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      return next;
    });
    dragIndex.current = index;
  }

  async function handleDrop() {
    dragIndex.current = null;
    setDragOverId(null);
    // Only persist rows whose position actually changed, to avoid rewriting the whole table on every drop.
    await Promise.all(
      items.map((item, index) =>
        item.order === index
          ? null
          : fetch(endpoint, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ id: item.id, order: index }) })
      )
    );
    setItems((prev) => prev.map((item, index) => ({ ...item, order: index })));
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>{title}</h1>
        <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: 14 }} onClick={openNew}>
          + New
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading…</p>
      ) : items.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>Nothing here yet — click + New to add one.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item, index) => (
            <div
              key={item.id}
              className="card-flat"
              draggable={reorderable}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index, item)}
              onDrop={(e) => e.preventDefault()}
              onDragEnd={handleDrop}
              style={{
                padding: 18,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
                outline: dragOverId === item.id ? '2px dashed var(--purple)' : undefined,
                opacity: reorderable && dragIndex.current !== null && dragOverId === item.id ? 0.7 : 1,
              }}
            >
              {reorderable && (
                <span style={{ cursor: 'grab', display: 'flex', alignItems: 'center', flexShrink: 0 }} title="Drag to reorder">
                  <GripIcon />
                </span>
              )}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{getLabel(item)}</div>
                {getSubtitle && <div style={{ color: 'var(--muted)', fontSize: 13.5 }}>{getSubtitle(item)}</div>}
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {'published' in item && (
                  <button
                    onClick={() => togglePublish(item)}
                    className="btn"
                    style={{ background: item.published ? 'var(--purple)' : 'var(--surface)', color: item.published ? '#fff' : 'var(--ink)', padding: '8px 14px', fontSize: 13 }}
                  >
                    {item.published ? 'Published' : 'Draft'}
                  </button>
                )}
                <button onClick={() => openEdit(item)} className="btn" style={{ padding: '8px 14px', fontSize: 13 }}>
                  Edit
                </button>
                <button onClick={() => remove(item)} className="btn" style={{ padding: '8px 14px', fontSize: 13, color: 'var(--coral)' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,3,21,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}
          onClick={() => setEditing(null)}
        >
          <div
            className="card-flat"
            style={{ background: 'var(--surface)', padding: 28, width: 480, maxWidth: '100%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '6px 6px 0 var(--ink)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 18 }}>{editing.id ? 'Edit' : 'New'} {title.replace(/s$/, '')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {fields.map((f) => (
                <div key={f.name}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      value={editing[f.name] ?? ''}
                      onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })}
                      placeholder={f.placeholder}
                      style={{ ...fieldStyle, minHeight: 90, resize: 'vertical', width: '100%' }}
                    />
                  ) : f.type === 'checkbox' ? (
                    <input
                      type="checkbox"
                      checked={!!editing[f.name]}
                      onChange={(e) => setEditing({ ...editing, [f.name]: e.target.checked })}
                      style={{ width: 20, height: 20 }}
                    />
                  ) : f.type === 'image' ? (
                    <ImageUploadField value={editing[f.name] ?? ''} onChange={(url) => setEditing({ ...editing, [f.name]: url })} />
                  ) : f.type === 'imagelist' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {((editing[f.name] as ImageItem[]) ?? []).map((item: ImageItem, idx: number) => (
                        <div
                          key={idx}
                          draggable
                          onDragStart={() => handleListDragStart(idx)}
                          onDragOver={(e) => handleListDragOver(e, f.name, idx, editing[f.name] as ImageItem[])}
                          onDrop={(e) => e.preventDefault()}
                          onDragEnd={handleListDragEnd}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            border: '2px solid var(--line)',
                            borderRadius: 10,
                            padding: 10,
                            outline: listDragOver?.field === f.name && listDragOver.index === idx ? '2px dashed var(--purple)' : undefined,
                          }}
                        >
                          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <span style={{ cursor: 'grab', display: 'flex', alignItems: 'center', paddingTop: 12, flexShrink: 0 }} title="Drag to reorder">
                              <GripIcon />
                            </span>
                            <div style={{ flex: 1 }}>
                              <ImageUploadField
                                value={item.url}
                                onChange={(newUrl) => {
                                  const next = [...(editing[f.name] as ImageItem[])];
                                  next[idx] = { ...next[idx], url: newUrl };
                                  setEditing({ ...editing, [f.name]: next });
                                }}
                              />
                            </div>
                            <button
                              type="button"
                              className="btn"
                              style={{ padding: '8px 10px', fontSize: 12, color: 'var(--coral)', flexShrink: 0 }}
                              onClick={() => {
                                const next = (editing[f.name] as ImageItem[]).filter((_, i) => i !== idx);
                                setEditing({ ...editing, [f.name]: next });
                              }}
                            >
                              Remove
                            </button>
                          </div>
                          <CategoryShowOn
                            categories={item.categories ?? []}
                            homeCategoryId={defaults.categoryId}
                            options={workCategoryOptions}
                            onChange={(nextCategories) => {
                              const next = [...(editing[f.name] as ImageItem[])];
                              next[idx] = { ...next[idx], categories: nextCategories };
                              setEditing({ ...editing, [f.name]: next });
                            }}
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn"
                        style={{ padding: '8px 14px', fontSize: 13, alignSelf: 'flex-start' }}
                        onClick={() => setEditing({ ...editing, [f.name]: [...((editing[f.name] as ImageItem[]) ?? []), { url: '', categories: defaults.categoryId ? [defaults.categoryId] : [] }] })}
                      >
                        + Add image
                      </button>
                    </div>
                  ) : f.type === 'videolist' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {((editing[f.name] as VideoItem[]) ?? []).map((item: VideoItem, idx: number) => (
                        <div
                          key={idx}
                          draggable
                          onDragStart={() => handleListDragStart(idx)}
                          onDragOver={(e) => handleListDragOver(e, f.name, idx, editing[f.name] as VideoItem[])}
                          onDrop={(e) => e.preventDefault()}
                          onDragEnd={handleListDragEnd}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            border: '2px solid var(--line)',
                            borderRadius: 10,
                            padding: 10,
                            outline: listDragOver?.field === f.name && listDragOver.index === idx ? '2px dashed var(--purple)' : undefined,
                          }}
                        >
                          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <span style={{ cursor: 'grab', display: 'flex', alignItems: 'center', paddingTop: 12, flexShrink: 0 }} title="Drag to reorder">
                              <GripIcon />
                            </span>
                            <div style={{ flex: 1 }}>
                              <VideoUploadField
                                value={item.url}
                                onChange={(newUrl) => {
                                  const next = [...(editing[f.name] as VideoItem[])];
                                  next[idx] = { ...next[idx], url: newUrl };
                                  setEditing({ ...editing, [f.name]: next });
                                }}
                              />
                            </div>
                            <button
                              type="button"
                              className="btn"
                              style={{ padding: '8px 10px', fontSize: 12, color: 'var(--coral)', flexShrink: 0 }}
                              onClick={() => {
                                const next = (editing[f.name] as VideoItem[]).filter((_, i) => i !== idx);
                                setEditing({ ...editing, [f.name]: next });
                              }}
                            >
                              Remove
                            </button>
                          </div>
                          <input
                            type="text"
                            value={item.views ?? ''}
                            onChange={(e) => {
                              const next = [...(editing[f.name] as VideoItem[])];
                              next[idx] = { ...next[idx], views: e.target.value };
                              setEditing({ ...editing, [f.name]: next });
                            }}
                            placeholder="Views to display (e.g. 1.2M) — optional"
                            style={{ ...fieldStyle, width: '100%' }}
                          />
                          <CategoryShowOn
                            categories={item.categories ?? []}
                            homeCategoryId={defaults.categoryId}
                            options={workCategoryOptions}
                            onChange={(nextCategories) => {
                              const next = [...(editing[f.name] as VideoItem[])];
                              next[idx] = { ...next[idx], categories: nextCategories };
                              setEditing({ ...editing, [f.name]: next });
                            }}
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn"
                        style={{ padding: '8px 14px', fontSize: 13, alignSelf: 'flex-start' }}
                        onClick={() => setEditing({ ...editing, [f.name]: [...((editing[f.name] as VideoItem[]) ?? []), { url: '', views: '', categories: defaults.categoryId ? [defaults.categoryId] : [] }] })}
                      >
                        + Add video link
                      </button>
                    </div>
                  ) : f.type === 'select' ? (
                    <select
                      value={editing[f.name] ?? ''}
                      onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })}
                      style={{ ...fieldStyle, width: '100%' }}
                    >
                      <option value="">—</option>
                      {f.options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type === 'number' ? 'number' : 'text'}
                      value={editing[f.name] ?? ''}
                      onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })}
                      placeholder={f.type === 'text' ? f.placeholder : undefined}
                      required={f.type === 'text' && f.required}
                      style={{ ...fieldStyle, width: '100%' }}
                    />
                  )}
                </div>
              ))}
              {'order' in editing && !fields.some((f) => f.name === 'order') && (
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Order</label>
                  <input
                    type="number"
                    value={editing.order ?? 0}
                    onChange={(e) => setEditing({ ...editing, order: e.target.value })}
                    style={{ ...fieldStyle, width: '100%' }}
                  />
                </div>
              )}
              {'published' in editing && !fields.some((f) => f.name === 'published') && (
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={!!editing.published}
                    onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                  />
                  Published
                </label>
              )}
            </div>
            {saveError && <p style={{ color: 'var(--coral)', fontSize: 13, fontWeight: 600, marginTop: 14 }}>{saveError}</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              <button className="btn btn-primary" onClick={save} disabled={saving} style={{ flex: 1 }}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button className="btn" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
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
