import { FilesetResolver, HandLandmarker, PoseLandmarker } from '@mediapipe/tasks-vision';
import type { VisionResult } from './vision-types';

export interface Engine {
  detect(bitmap: ImageBitmap, ts: number): VisionResult;
}

export async function createEngine(base: string): Promise<Engine> {
  const fileset = await FilesetResolver.forVisionTasks(`${base}mediapipe/wasm`);
  const hands = await HandLandmarker.createFromOptions(fileset, {
    baseOptions: { modelAssetPath: `${base}models/hand_landmarker.task`, delegate: 'GPU' },
    runningMode: 'VIDEO',
    numHands: 2,
  });
  const pose = await PoseLandmarker.createFromOptions(fileset, {
    baseOptions: { modelAssetPath: `${base}models/pose_landmarker_lite.task`, delegate: 'GPU' },
    runningMode: 'VIDEO',
    numPoses: 1,
  });

  let lastTs = -1;
  return {
    detect(bitmap, now) {
      // MediaPipe VIDEO mode needs strictly increasing timestamps.
      const ts = now > lastTs ? now : lastTs + 1;
      lastTs = ts;
      const h = hands.detectForVideo(bitmap, ts);
      const p = pose.detectForVideo(bitmap, ts);
      // Copy to plain objects so the result survives postMessage structured clone.
      return {
        hands: {
          landmarks: h.landmarks.map((hand) => hand.map(({ x, y, z }) => ({ x, y, z }))),
          handedness: h.handedness.map((hand) =>
            hand.map(({ categoryName, score }) => ({ categoryName, score })),
          ),
        },
        pose: {
          landmarks: p.landmarks.map((body) =>
            body.map(({ x, y, z, visibility }) => ({ x, y, z, visibility })),
          ),
        },
      };
    },
  };
}
