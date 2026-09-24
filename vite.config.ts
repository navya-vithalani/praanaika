import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/brand/favicon.svg'],
      manifest: {
        name: 'Praanaika View',
        short_name: 'Praanaika',
        description: 'Body, Environment, Baseline',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#F8F1E7',
        theme_color: '#4A2650',
        icons: [
          { src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
          { src: '/icons/maskable-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Today', short_name: 'Today', url: '/today', icons: [{ src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' }] },
          { name: 'Talk', short_name: 'Talk', url: '/talk', icons: [{ src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' }] },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
