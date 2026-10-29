import { processStream } from './core/pipeline';
import { createVision } from './core/vision';
import { debugEffect } from './effects/debug';

// Debug overlay is burned into the outgoing video, so it is opt-in: localStorage.setItem('vibemeet.debug', '1')
const debug = localStorage.getItem('vibemeet.debug') === '1';

const md = navigator.mediaDevices;
const original = md.getUserMedia.bind(md);

md.getUserMedia = async (constraints?: MediaStreamConstraints) => {
  const stream = await original(constraints);
  if (!constraints?.video) return stream;
  try {
    return processStream(stream, debug ? [debugEffect] : [], debug ? createVision() : null);
  } catch (err) {
    console.error('[vibemeet] pipeline failed, using raw stream', err);
    return stream;
  }
};

console.info('[vibemeet] getUserMedia hooked, debug =', debug);
