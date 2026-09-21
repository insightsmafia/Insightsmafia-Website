// Loads Vimeo's official Player.js library once and shares the promise
// across every embedded player on the page - same reasoning as the
// YouTube loader: a hand-rolled raw postMessage subscription isn't
// reliable for detecting "video ended".
let apiPromise: Promise<any> | null = null;

export function loadVimeoPlayerApi(): Promise<any> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  const w = window as any;
  if (w.Vimeo && w.Vimeo.Player) return Promise.resolve(w.Vimeo);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://player.vimeo.com/api/player.js';
    script.onload = () => resolve(w.Vimeo);
    document.head.appendChild(script);
  });
  return apiPromise;
}
