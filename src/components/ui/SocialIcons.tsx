type IconProps = { size?: number };

export function InstagramIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedInIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.32-.02-3-1.83-3-1.84 0-2.12 1.44-2.12 2.9V21h-4V9Z" />
    </svg>
  );
}

export function TwitterIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.24 3H21l-6.6 7.54L22.2 21h-6.1l-4.78-6.26L5.8 21H3l7.06-8.07L2.4 3h6.25l4.32 5.72L18.24 3Zm-1.07 16.2h1.68L7.9 4.7H6.1l11.07 14.5Z" />
    </svg>
  );
}

export function FacebookIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93V8.55c0-.86.24-1.44 1.47-1.44h1.57V4.46c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9v2.2H7.9v2.96h2.56V21h3.04Z" />
    </svg>
  );
}

export function YouTubeIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12s0-3.14-.4-4.64a2.6 2.6 0 0 0-1.83-1.83C18.27 5 12 5 12 5s-6.27 0-7.77.53a2.6 2.6 0 0 0-1.83 1.83C2 8.86 2 12 2 12s0 3.14.4 4.64a2.6 2.6 0 0 0 1.83 1.83C5.73 19 12 19 12 19s6.27 0 7.77-.53a2.6 2.6 0 0 0 1.83-1.83c.4-1.5.4-4.64.4-4.64Zm-12 3V9l5.2 3-5.2 3Z" />
    </svg>
  );
}
