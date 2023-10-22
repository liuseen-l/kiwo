import path from 'node:path'
import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig(() => {
  const manualChunks = {
    'enquirer': ['enquirer'],
  }
  const chunkFileNames = () => {
    return '[name]-[hash]-pmm.js'
  }
  return {
    input: './src/cli.ts',
    output: [
      {
        dir: path.resolve(__dirname, 'dist/es'),
        format: 'es',
        entryFileNames: 'index.mjs',
        manualChunks,
        chunkFileNames
      },
      {
        dir: path.resolve(__dirname, 'dist/cjs'),
        format: 'cjs',
        entryFileNames: 'index.cjs',
        manualChunks,
        chunkFileNames
      },
    ],
    external: ['fs-extra', 'fast-glob', 'yargs'],
    plugins: [typescript(), nodeResolve(), commonjs()],
  }
}) 
