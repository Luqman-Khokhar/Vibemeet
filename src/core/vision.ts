import type { FrameMessage, HostMessage, Vision, VisionResult } from './vision-types';

export async function createVision(): Promise<Vision> {
  const base = document.documentElement.dataset.vibemeetBase;
  if (!base) throw new Error('extension base URL missing (bridge not loaded)');
  const extOrigin = new URL(base).origin;

  const frame = document.createElement('iframe');
  frame.src = `${base}vision-host.html`;
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText =
    'position:fixed;width:1px;height:1px;left:0;top:0;opacity:0;pointer-events:none;border:0;';

  let latest: VisionResult | null = null;
  let busy = false;

  const ready = new Promise<void>((resolve, reject) => {
    window.addEventListener('message', (e: MessageEvent<HostMessage>) => {
      if (e.source !== frame.contentWindow || !e.data) return;
      switch (e.data.type) {
        case 'ready':
          resolve();
          break;
        case 'result':
          latest = e.data.result;
          busy = false;
          break;
        case 'error':
          busy = false;
          reject(new Error(e.data.message));
          console.error('[vibemeet] vision host error:', e.data.message);
          break;
      }
    });
  });

  document.documentElement.appendChild(frame);
  await ready;

  return {
    detect(video, now) {
      if (!busy && video.readyState >= 2) {
        busy = true;
        createImageBitmap(video)
          .then((bitmap) => {
            const msg: FrameMessage = { type: 'frame', bitmap, ts: now };
            frame.contentWindow!.postMessage(msg, extOrigin, [bitmap]);
          })
          .catch(() => (busy = false));
      }
      return latest;
    },
  };
}
