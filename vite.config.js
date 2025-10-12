import preact from '@preact/preset-vite'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import million from 'million/compiler'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    million.vite({ auto: true }),
    preact(),
    cssInjectedByJsPlugin(),
    basicSsl()
  ],
  build: {
    lib: {
      fileName: 'index',
      entry: resolve(__dirname, './ts-sc-client/index.tsx'),
      formats: ['es'],
    },
    minify: true,
    sourcemap: true,
    target: 'esnext'
  },
  server: {
    https: true,
    port: 5173,
  },
})
