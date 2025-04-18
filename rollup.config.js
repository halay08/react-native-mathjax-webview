import { builtinModules } from 'module'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import { defineConfig } from 'rollup'
import pkg from './package.json' assert { type: 'json' }

const external = [
  ...builtinModules,
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

const plugins = [
  esbuild({
    target: 'node20',
  }),
]

export default defineConfig([
  {
    input: 'src/index.tsx',
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].js',
      chunkFileNames: 'chunk-[name].js',
    },
    external,
    plugins,
    onwarn,
  },
  {
    input: 'src/index.tsx',
    output: {
      dir: 'dist',
      entryFileNames: '[name].d.ts',
      format: 'esm',
    },
    external,
    plugins: [dts({ respectExternal: true })],
    onwarn,
  },
])

function onwarn(message) {
  if (['EMPTY_BUNDLE', 'CIRCULAR_DEPENDENCY'].includes(message.code)) {
    return
  }
  console.error(message)
}
