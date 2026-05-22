const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

const TrackingSchema = new mongoose.Schema({}, { strict: false });
const Tracking = mongoose.model('Tracking', TrackingSchema, 'trackings');

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');
  
  const all = await Tracking.find({});
  console.log(`Total trackings in DB: ${all.length}`);
  all.forEach(doc => {
    console.log(`ID: ${doc.trackingId}, status: ${doc.status}, synced: ${doc.syncedToShopify}, trackingUrl: ${doc.shopifyFulfillment?.tracking_url}`);
  });
  
  await mongoose.disconnect();
}

run().catch(console.error);
