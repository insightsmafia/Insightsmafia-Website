import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export type AdminTokenPayload = { sub: string; email: string; role: string };

export function signToken(payload: AdminTokenPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, SECRET) as AdminTokenPayload;
  } catch {
    return null;
  }
}

/** Pulls the Bearer token off a request and verifies it. Returns null if not an admin. */
export function requireAdmin(req: NextRequest): AdminTokenPayload | null {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return null;
  return verifyToken(token);
}
