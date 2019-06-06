import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from "rollup-plugin-uglify";
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      name: pkg.globalName,
      file: pkg.umd,
      format: 'umd'
    },
    plugins: [
      resolve(),
      commonjs()
    ]
  },

  // browser-friendly UMD build (production)
  {
    input: 'src/index.js',
    output: {
      name: pkg.globalName,
      file: pkg.umdMin,
      format: 'umd'
    },
    plugins: [
      resolve(),
      commonjs(),
      uglify({
        output: {
          comments: function(node, comment) {
            if (comment.type === "comment2") {
              // multiline comment
              return /@preserve|@license|@cc_on/i.test(comment.value);
            }
            return false;
          }
        }
      })
    ]
  }
];