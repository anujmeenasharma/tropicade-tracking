require('dotenv').config({ path: '.env' }); // Adjust path to .env.local if needed
const cron = require('node-cron');

const API_URL = process.env.APP_URL 
  ? `${process.env.APP_URL}/api/cron/process-orders` 
  : 'http://localhost:3000/api/cron/process-orders';

console.log(`[Cron Worker] Service started.`);
console.log(`[Cron Worker] Will ping API URL: ${API_URL} every 5 minutes`);

// Run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log(`[Cron Worker] Triggering process-orders endpoint at ${new Date().toISOString()}`);
  try {
    // Note: Node 18+ has built-in fetch
    const res = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET || ''}`
      }
    });
    
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      console.log(`[Cron Worker] Response [${res.status}]:`, data);
    } else {
      const text = await res.text();
      console.log(`[Cron Worker] Response [${res.status}]:`, text.substring(0, 100));
    }
  } catch (err) {
    console.error('[Cron Worker] Failed to reach API:', err.message);
  }
});
