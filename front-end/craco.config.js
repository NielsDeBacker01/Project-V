const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@services': path.resolve(__dirname, 'src/services/'),
    },
    configure: {
      resolve: {
        fallback: {
          "path": require.resolve("path-browserify"),
          "os": require.resolve("os-browserify/browser"),
          "fs": false
        }
      }
    }
  },
};
