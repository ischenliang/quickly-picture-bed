import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import multiInput from 'rollup-plugin-multi-input'
import pkg from './package.json';

export default {
  // input: 'src/app.ts',
  // 通过 globe 匹配所有文件
  input: ['src/**/*.ts'],
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  preserveModules: true,
  nested: true,
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ],
  plugins: [
    typescript(),
    multiInput(),
    resolve(),
    commonjs(),
    json(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
    }),
  ],
};