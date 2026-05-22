module.exports = {
  apps: [
    {
      name: 'tropicade-next',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      env: {
        PORT: 3000,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'tropicade-express',
      script: 'server.js',
      cwd: require('path').join(__dirname, 'shopify-express'),
      instances: 1,
      exec_mode: 'fork',
      env: {
        PORT: 3001,
        EXPRESS_PORT: 3001,
        NODE_ENV: 'production'
      }
    }
  ]
};
