// Loads YouTube's official IFrame Player API once and shares the promise
// across every embedded player on the page - needed to reliably detect
// "video ended" (a hand-rolled raw postMessage protocol isn't officially
// documented and doesn't reliably fire state-change events).
let apiPromise: Promise<any> | null = null;

export function loadYouTubeIframeApi(): Promise<any> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  const w = window as any;
  if (w.YT && w.YT.Player) return Promise.resolve(w.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const prevCallback = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      if (prevCallback) prevCallback();
      resolve(w.YT);
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);
  });
  return apiPromise;
}
