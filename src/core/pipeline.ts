import type { Effect, FrameContext } from '../effects/types';

const FPS = 30;

export function processStream(source: MediaStream, effects: Effect[] = []): MediaStream {
  const [track] = source.getVideoTracks();
  if (!track) return source;

  const settings = track.getSettings();
  const width = settings.width ?? 1280;
  const height = settings.height ?? 720;

  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.srcObject = new MediaStream([track]);
  void video.play();

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false })!;

  const frame: FrameContext = { video, ctx, width, height, now: 0 };

  const draw = (now: number) => {
    frame.now = now;
    ctx.drawImage(video, 0, 0, width, height);
    for (const effect of effects) effect.render(frame);
  };

  let stopped = false;
  const loop = (now: number) => {
    if (stopped) return;
    draw(now);
    if ('requestVideoFrameCallback' in video) {
      video.requestVideoFrameCallback((t) => loop(t));
    } else {
      requestAnimationFrame(loop);
    }
  };
  video.addEventListener('loadedmetadata', () => requestAnimationFrame(loop), { once: true });

  const out = canvas.captureStream(FPS);
  const [outTrack] = out.getVideoTracks();
  const origStop = outTrack.stop.bind(outTrack);
  outTrack.stop = () => {
    stopped = true;
    track.stop();
    video.srcObject = null;
    origStop();
  };

  for (const audio of source.getAudioTracks()) out.addTrack(audio);
  return out;
}
