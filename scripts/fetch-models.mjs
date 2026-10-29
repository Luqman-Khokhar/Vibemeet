import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://storage.googleapis.com/mediapipe-models';
const MODELS = {
  'hand_landmarker.task': `${BASE}/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
  'pose_landmarker_lite.task': `${BASE}/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
};

mkdirSync('models', { recursive: true });
for (const [name, url] of Object.entries(MODELS)) {
  const path = `models/${name}`;
  if (existsSync(path)) continue;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  writeFileSync(path, Buffer.from(await res.arrayBuffer()));
  console.log(`fetched ${name}`);
}
