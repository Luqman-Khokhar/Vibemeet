export interface FrameContext {
  video: HTMLVideoElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  now: number;
}

export interface Effect {
  id: string;
  /** Draw this effect over (or instead of) the base frame. */
  render(frame: FrameContext): void;
}
