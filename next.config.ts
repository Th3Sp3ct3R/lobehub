import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from './src/libs/next/config/define-config';

const isVercel = !!process.env.VERCEL_ENV;
const rootDir = path.dirname(fileURLToPath(import.meta.url));

const vercelConfig = {
  // Vercel serverless optimization: exclude musl binaries from all routes
  // Vercel uses Amazon Linux (glibc), not Alpine Linux (musl)
  // This saves ~45MB (29MB canvas-musl + 16MB sharp-musl) per serverless function
  outputFileTracingExcludes: {
    '*': [
      'node_modules/.pnpm/@napi-rs+canvas-*-musl*',
      'node_modules/.pnpm/@img+sharp-libvips-*musl*',
      // Exclude SPA/desktop/mobile build artifacts from serverless functions
      'public/_spa/**',
      'dist/desktop/**',
      'dist/mobile/**',
      'apps/desktop/**',
      'packages/database/migrations/**',
    ],
  },
};
const nextConfig = defineConfig({
  ...(isVercel ? vercelConfig : {}),
  turbopack: {
    resolveAlias: {
      '@lobechat/device-gateway-client': './packages/device-gateway-client/src/index.ts',
      '@lobechat/local-file-shell': './packages/local-file-shell/src/index.ts',
    },
    root: rootDir,
  },
});

export default nextConfig;
