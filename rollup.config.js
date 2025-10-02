import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'dist/cloudfront/viewer-request/index.js',
  output: {
    file: 'dist/cloudfront/viewer-request/index.js',
    format: 'cjs',
    exports: 'auto'
  },
  plugins: [commonjs()]
};
