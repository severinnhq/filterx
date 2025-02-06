const esbuild = require('esbuild');
const path = require('path');

// Build popup
esbuild.build({
  entryPoints: ['public/popup/index.tsx'],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: 'public/popup/index.js',
  platform: 'browser',
  target: ['chrome58', 'firefox57', 'safari11', 'edge18'],
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
    '.jsx': 'jsx',
    '.js': 'js',
    '.css': 'css',
  },
  external: ['chrome'],
}).then(() => {
  console.log('⚡ Build complete! Output: public/popup/index.js')
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});