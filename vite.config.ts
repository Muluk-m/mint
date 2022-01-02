import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';
import proxyConfig from './src/config/proxy.config';

export default defineConfig({
  optimizeDeps: {
    include: []
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  },
  plugins: [reactRefresh(), tsconfigPaths()],
  logLevel: 'error',
  server: {
    open: true,
    fs: {
      strict: false
    },
    host: '0.0.0.0',
    port: 3000,
    proxy: proxyConfig
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  build: {
    sourcemap: 'inline'
  }
});
