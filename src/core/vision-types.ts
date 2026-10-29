export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface VisionResult {
  hands: {
    landmarks: Landmark[][];
    handedness: { categoryName: string; score: number }[][];
  };
  pose: {
    landmarks: Landmark[][];
  };
}

export interface Vision {
  /** Non-blocking: returns the latest finished result (may lag a frame or two). */
  detect(video: HTMLVideoElement, now: number): VisionResult | null;
}

export type HostMessage =
  | { type: 'ready' }
  | { type: 'error'; message: string }
  | { type: 'result'; result: VisionResult };

export interface FrameMessage {
  type: 'frame';
  bitmap: ImageBitmap;
  ts: number;
}
