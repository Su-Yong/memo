import { defineConfig } from 'rollup';

import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const configs = [
  defineConfig({
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.esm.js',
        name: 'memo-core',
        format: 'es',
      },
      {
        file: 'dist/index.umd.js',
        name: 'memo-core',
        format: 'umd',
      },
    ],
    external: ['zod', '@tiptap/core', '@tiptap/pm', '@tiptap/starter-kit'],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
      }),
      nodeResolve()
    ],
  }),
  defineConfig({
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.d.ts',
        format: 'es',
      },
    ],
    plugins: [
      dts(),
    ],
  }),
];

export default configs;