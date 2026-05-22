const path = require('path');
const fs = require('fs');

// Debug paths and file existence
console.log('[Debug] Current Directory (process.cwd()):', process.cwd());
console.log('[Debug] Script Directory (__dirname):', __dirname);

const pathsToCheck = [
  path.resolve(__dirname, '.env.local'),
  path.resolve(__dirname, '.env'),
  path.resolve(__dirname, '../.env.local'),
  path.resolve(__dirname, '../.env')
];

pathsToCheck.forEach(p => {
  console.log(`[Debug] Checking env file path: ${p} -> Exists: ${fs.existsSync(p)}`);
});

// Load environment variables from local and root configs (.env and .env.local)
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const mongoose = require('mongoose');
const orderRoutes = require('./routes/orders');
const { startCron } = require('./cron/worker');

const app = express();
// Default to 3001 to avoid port conflicts with Next.js (usually on 3000)
const PORT = process.env.EXPRESS_PORT || process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

console.log('[Debug] Loaded keys in process.env:', Object.keys(process.env).filter(k => !k.startsWith('npm_')));

if (!MONGODB_URI) {
  console.error('CRITICAL: MONGODB_URI environment variable is missing.');
  process.exit(1);
}

// 1. Capture Raw Request Body
// Shopify signature validation requires the raw request payload buffer.
// We configure express.json() with a custom verify function to populate req.rawBody.
app.use(express.json({
  limit: '2mb',
  verify: (req, res, buf) => {
    if (req.headers['x-shopify-hmac-sha256']) {
      req.rawBody = buf; // Store the raw Buffer directly
    }
  }
}));

// 2. Register Routes
app.use('/api/webhooks', orderRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 3. Connect to Database & Start Server
console.log('Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB database.');
    
    // Start Cron Worker Scheduler
    startCron();
    
    // Start Server Listener
    app.listen(PORT, () => {
      console.log(`[Express Server] Running on port ${PORT}`);
      console.log(`[Express Server] Shopify Webhook URL: http://localhost:${PORT}/api/webhooks/shopify`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
