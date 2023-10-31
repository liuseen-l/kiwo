import path from 'node:path'
import { RollupOptions, defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs';
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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
  } as RollupOptions
}) 
