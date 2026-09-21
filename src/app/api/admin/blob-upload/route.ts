import { NextRequest, NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { requireAdmin } from '@/lib/auth';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'video/mp4',
  'video/quicktime',
  'video/webm',
];

// Client-direct upload: the browser uploads bytes straight to Vercel Blob
// storage, not through this serverless function - this route only issues a
// short-lived signed token. That matters for video files, which routinely
// exceed the request body size Vercel allows a serverless function to
// receive (the old proxy-through-the-function /api/admin/upload route is
// fine for small images but can't handle video at all for that reason).
export async function POST(request: NextRequest): Promise<NextResponse> {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED_TYPES,
        addRandomSuffix: true,
        maximumSizeInBytes: 250 * 1024 * 1024, // 250MB - generous for a reel-length video
      }),
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 400 });
  }
}
