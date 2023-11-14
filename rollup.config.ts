import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { RollupOptions } from 'rollup'
import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(() => {
  // const manualChunks = {
  //   enquirer: ['enquirer'],
  // }
  const chunkFileNames = () => {
    return '[name]-[hash]-kiwo.js'
  }
  return {
    input: './src/cli.ts',
    output: [
      {
        dir: path.resolve(__dirname, 'dist/es'),
        format: 'es',
        entryFileNames: 'index.mjs',
        // manualChunks,
        chunkFileNames,
      },

    ],
    external: ['fs-extra', 'fast-glob', 'yargs', 'enquirer', 'picocolors'],
    plugins: [typescript(), nodeResolve(), commonjs()],
  } as RollupOptions
})
