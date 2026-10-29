import type { Effect } from './types';

const HAND_COLOR = '#00ffd0';
const POSE_COLOR = '#ff4d6d';

export const debugEffect: Effect = {
  id: 'debug-landmarks',
  render({ ctx, width, height, vision }) {
    if (!vision) return;
    const dot = (x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x * width, y * height, 4, 0, Math.PI * 2);
      ctx.fill();
    };
    for (const hand of vision.hands.landmarks) for (const p of hand) dot(p.x, p.y, HAND_COLOR);
    for (const pose of vision.pose.landmarks) for (const p of pose) dot(p.x, p.y, POSE_COLOR);
  },
};
