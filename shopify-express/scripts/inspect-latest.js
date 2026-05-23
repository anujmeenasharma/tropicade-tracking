const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

const Order = require('../models/Order');
const Tracking = require('../models/Tracking');

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');
  
  console.log('\n--- LATEST 10 ORDERS ---');
  const orders = await Order.find({}).sort({ _id: -1 }).limit(10);
  orders.forEach(o => {
    console.log(`Order ID: ${o.shopifyOrderId}`);
    console.log(`  Customer: ${o.customerEmail}`);
    console.log(`  Country: ${o.shippingCountry}, City: ${o.shippingCity}`);
    console.log(`  Created: ${o.orderCreatedDate}`);
    console.log(`  Processed: ${o.processed}, ProcessedAt: ${o.processedAt}`);
    console.log(`  ProcessAfter: ${o.processAfter}`);
    console.log(`  System CreatedAt: ${o.createdAt}`);
    console.log('-----------------');
  });

  console.log('\n--- LATEST 10 TRACKINGS ---');
  const trackings = await Tracking.find({}).sort({ _id: -1 }).limit(10);
  trackings.forEach(t => {
    console.log(`Tracking ID: ${t.trackingId}`);
    console.log(`  Order ID: ${t.shopifyFulfillment?.order_id}`);
    console.log(`  Start Date: ${t.startDate}`);
    console.log(`  Destination: ${t.destinationCity}, ${t.destinationCountry}`);
    console.log(`  Synced: ${t.syncedToShopify}`);
    if (t.events && t.events.length > 0) {
      console.log(`  First Event Date: ${t.events[0].date}, Title: ${t.events[0].title}`);
      console.log(`  Last Event Date: ${t.events[t.events.length - 1].date}, Title: ${t.events[t.events.length - 1].title}`);
    }
    console.log(`  System CreatedAt: ${t.createdAt}`);
    console.log('-----------------');
  });
  
  await mongoose.disconnect();
}

run().catch(console.error);
