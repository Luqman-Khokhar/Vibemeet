import { processStream } from './core/pipeline';

const md = navigator.mediaDevices;
const original = md.getUserMedia.bind(md);

md.getUserMedia = async (constraints?: MediaStreamConstraints) => {
  const stream = await original(constraints);
  if (!constraints?.video) return stream;
  try {
    return processStream(stream);
  } catch (err) {
    console.error('[vibemeet] pipeline failed, using raw stream', err);
    return stream;
  }
};

console.info('[vibemeet] getUserMedia hooked');
