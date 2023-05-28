import path from 'node:path';

import { defineConfig } from 'rollup';

import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      name: 'memo',
      format: 'es',
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
    }),
    alias({
      entries: [
        {
          find: '@/',
          replacement: path.join(import.meta.url, './src'),
        },
      ],
    }),
  ],
});
