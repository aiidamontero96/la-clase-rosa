import { defineConfig } from 'vite';

// The published site continues to use the existing static build and Worker.
export default defineConfig({
  root: 'public',
  publicDir: false,
  server: { host: '0.0.0.0', allowedHosts: ['terminal.local'], watch: { ignored: ['**/audio/pdi/*.mp3'] } },
});
