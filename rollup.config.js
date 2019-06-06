import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      name: 'DOMAnimate',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**'
      }),
      commonjs()
    ]
  },

  // browser-friendly UMD build (production)
  {
    input: 'src/index.js',
    output: {
      name: 'domAnimate',
      file: pkg.browser_production,
      format: 'umd'
    },
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**'
      }),
      commonjs(),
      uglify()
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      babel({
        exclude: 'node_modules/**'
      })
    ],
    external: [ 'bezier-easing' ]
  }
];