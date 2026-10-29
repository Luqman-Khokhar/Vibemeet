import {
  FilesetResolver,
  HandLandmarker,
  PoseLandmarker,
  type HandLandmarkerResult,
  type PoseLandmarkerResult,
} from '@mediapipe/tasks-vision';

export interface VisionResult {
  hands: HandLandmarkerResult;
  pose: PoseLandmarkerResult;
}

export interface Vision {
  detect(video: HTMLVideoElement, now: number): VisionResult;
}

const baseUrl = () => document.documentElement.dataset.vibemeetBase ?? '';

export async function createVision(): Promise<Vision> {
  const base = baseUrl();
  if (!base) throw new Error('extension base URL missing (bridge not loaded)');

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
    detect(video, now) {
      // MediaPipe VIDEO mode needs strictly increasing timestamps.
      const ts = now > lastTs ? now : lastTs + 1;
      lastTs = ts;
      return { hands: hands.detectForVideo(video, ts), pose: pose.detectForVideo(video, ts) };
    },
  };
}
