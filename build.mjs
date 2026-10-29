import { build, context } from 'esbuild';
import { cpSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const watch = process.argv.includes('--watch');

execFileSync('node', ['scripts/fetch-models.mjs'], { stdio: 'inherit' });

mkdirSync('dist', { recursive: true });
cpSync('public', 'dist', { recursive: true });
cpSync('node_modules/@mediapipe/tasks-vision/wasm', 'dist/mediapipe/wasm', { recursive: true });
cpSync('models', 'dist/models', { recursive: true });

const options = {
  entryPoints: { inject: 'src/inject.ts', bridge: 'src/bridge.ts', 'vision-host': 'src/vision-host.ts' },
  outdir: 'dist',
  bundle: true,
  format: 'iife',
  target: 'chrome120',
  sourcemap: true,
  logLevel: 'info',
};

if (watch) {
  const ctx = await context(options);
  await ctx.watch();
} else {
  await build(options);
}
