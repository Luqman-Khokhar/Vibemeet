// Runs inside the extension-owned iframe: Meet's Trusted Types policy can't block MediaPipe's script loading here.
import { createEngine } from './core/vision-engine';
import type { FrameMessage, HostMessage } from './core/vision-types';

const send = (msg: HostMessage) => window.parent.postMessage(msg, '*');

createEngine(chrome.runtime.getURL(''))
  .then((engine) => {
    window.addEventListener('message', (e: MessageEvent<FrameMessage>) => {
      if (e.source !== window.parent || e.data?.type !== 'frame') return;
      const { bitmap, ts } = e.data;
      try {
        send({ type: 'result', result: engine.detect(bitmap, ts) });
      } catch (err) {
        send({ type: 'error', message: String(err) });
      } finally {
        bitmap.close();
      }
    });
    send({ type: 'ready' });
  })
  .catch((err) => send({ type: 'error', message: String(err) }));
