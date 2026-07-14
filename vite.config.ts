import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      build: {
        // Split the heavy 3D/vendor graph so no single chunk dominates the
        // bundle and peak build memory stays lower.
        rollupOptions: {
          output: {
            // NOTE: react/react-dom are intentionally not a manual chunk.
            // @react-three/fiber and drei pull react-dom into their own chunks,
            // so forcing a "react" chunk produced an empty 0kB file + warning.
            manualChunks: {
              three: ['three'],
              drei: ['@react-three/drei'],
              fiber: ['@react-three/fiber'],
              motion: ['framer-motion'],
            },
          },
        },
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
