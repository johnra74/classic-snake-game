/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// The service worker is a build/dev artifact only; skip it under Vitest (which
// shares this config) so test runs and coverage are unaffected.
const pwa = process.env.VITEST
  ? []
  : [
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: ['icon.svg', 'apple-touch-icon-180x180.png', 'favicon.ico'],
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        },
        manifest: {
          name: 'Pixel Snake',
          short_name: 'Snake',
          description: 'A pixelated snake game you can install and play offline.',
          theme_color: '#0f0f1b',
          background_color: '#0f0f1b',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          categories: ['games'],
          icons: [
            { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
            {
              src: 'maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
      }),
    ];

export default defineConfig({
  plugins: [react(), ...pwa],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/test/**',
        'src/**/*.test.{ts,tsx}',
        'src/**/types.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
