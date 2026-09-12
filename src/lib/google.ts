import { google } from 'googleapis';

/**
 * Reads the service account key from GOOGLE_SERVICE_ACCOUNT_JSON (the full JSON key
 * pasted as one line). Returns null when not configured so callers can show a
 * "connect Google" state instead of crashing.
 */
function loadCredentials(): { client_email: string; private_key: string } | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.client_email || !parsed.private_key) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function isGoogleConfigured() {
  return loadCredentials() !== null;
}

function authClient(scopes: string[]) {
  const creds = loadCredentials();
  if (!creds) throw new Error('Google service account not configured');
  return new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes,
  });
}

export async function getSearchAnalytics(siteUrl: string, days = 28) {
  const auth = authClient(['https://www.googleapis.com/auth/webmasters.readonly']);
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);

  const res = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      dimensions: ['query'],
      rowLimit: 25,
    },
  });

  return (res.data.rows || []).map((r) => ({
    query: r.keys?.[0] || '',
    clicks: r.clicks || 0,
    impressions: r.impressions || 0,
    ctr: r.ctr || 0,
    position: r.position || 0,
  }));
}

export async function getIndexedPages(siteUrl: string) {
  const auth = authClient(['https://www.googleapis.com/auth/webmasters.readonly']);
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 28);

  const res = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      dimensions: ['page'],
      rowLimit: 50,
    },
  });

  return (res.data.rows || []).map((r) => ({
    page: r.keys?.[0] || '',
    clicks: r.clicks || 0,
    impressions: r.impressions || 0,
    position: r.position || 0,
  }));
}

export async function requestIndexing(url: string) {
  const auth = authClient(['https://www.googleapis.com/auth/indexing']);
  const indexing = google.indexing({ version: 'v3', auth });

  const res = await indexing.urlNotifications.publish({
    requestBody: { url, type: 'URL_UPDATED' },
  });

  return res.data;
}
