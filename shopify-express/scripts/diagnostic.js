const mongoose = require('mongoose');
const path = require('path');

// Load env
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
console.log('--- DIAGNOSTIC SCRIPT START ---');
console.log('Using MongoDB URI:', MONGODB_URI);

const TrackingSchema = new mongoose.Schema({}, { strict: false });
const Tracking = mongoose.model('Tracking', TrackingSchema, 'trackings');

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB.');

    // 1. Check total count
    const totalCount = await Tracking.countDocuments({});
    console.log('Total documents in "trackings" collection:', totalCount);

    // 2. Fetch last 5 records
    const latestRecords = await Tracking.find({}).sort({ _id: -1 }).limit(5);
    console.log('\n--- LATEST 5 RECORDS IN DB ---');
    latestRecords.forEach((doc, index) => {
      console.log(`[Record #${index + 1}]`);
      console.log(`  _id: ${doc._id}`);
      console.log(`  trackingId: ${doc.trackingId}`);
      console.log(`  syncedToShopify: ${doc.syncedToShopify}`);
      console.log(`  shopifyFulfillment:`, JSON.stringify(doc.shopifyFulfillment, null, 2));
    });

    // 3. Search for any match containing localhost or https// in the DB
    console.log('\n--- SEARCHING FOR MATCHES ---');
    const allDocs = await Tracking.find({});
    let matchCount = 0;
    
    for (const doc of allDocs) {
      const url = doc.shopifyFulfillment?.tracking_url || '';
      const urls = doc.shopifyFulfillment?.tracking_urls || [];
      const hasLocalhost = url.includes('localhost') || urls.some(u => u.includes('localhost'));
      const hasMalformedHttps = url.includes('https//') || urls.some(u => u.includes('https//')) || url.includes('http//') || urls.some(u => u.includes('http//'));
      const hasSlashTypos = url.includes('https:/') && !url.includes('https://');
      
      if (hasLocalhost || hasMalformedHttps || hasSlashTypos) {
        matchCount++;
        console.log(`Match #${matchCount}:`);
        console.log(`  trackingId: ${doc.trackingId}`);
        console.log(`  trackingUrl: "${url}"`);
      }
    }
    console.log(`Found a total of ${matchCount} matches manually.`);

  } catch (err) {
    console.error('Diagnostic error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from DB.');
    console.log('--- DIAGNOSTIC SCRIPT END ---');
  }
}

run();
