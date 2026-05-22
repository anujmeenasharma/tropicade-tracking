const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: Missing MONGODB_URI environment variable.');
  process.exit(1);
}

const Order = require('../models/Order');
const Tracking = require('../models/Tracking');
const { generateTrackingTimeline } = require('../utils/tracking');

function formatDateInTimezone(date, timeZone = process.env.TIMEZONE || 'Asia/Kolkata') {
  const d = date ? new Date(date) : new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(d);
  const year = parts.find(p => p.type === 'year').value;
  const month = parts.find(p => p.type === 'month').value;
  const day = parts.find(p => p.type === 'day').value;
  return `${year}-${month}-${day}`;
}

async function fixTrackingDates() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Find all trackings
    const trackings = await Tracking.find({});
    console.log(`Found ${trackings.length} tracking documents total.`);

    let updatedCount = 0;

    for (const tracking of trackings) {
      const orderId = tracking.shopifyFulfillment?.order_id;
      if (!orderId) {
        console.warn(`Tracking ID ${tracking.trackingId} does not have an order_id in shopifyFulfillment. Skipping.`);
        continue;
      }

      // Find the corresponding order
      const order = await Order.findOne({ shopifyOrderId: orderId.toString() });
      if (!order) {
        console.warn(`Could not find Order record for Shopify Order ID ${orderId} (tracking: ${tracking.trackingId}). Skipping.`);
        continue;
      }

      // Calculate correct start date in the local timezone (e.g. Asia/Kolkata)
      const correctStartDate = formatDateInTimezone(order.orderCreatedDate);

      if (tracking.startDate !== correctStartDate) {
        console.log(`Updating ${tracking.trackingId}:`);
        console.log(`  Order Created Date (UTC): ${order.orderCreatedDate.toISOString()}`);
        console.log(`  Old Tracking Start Date:  ${tracking.startDate}`);
        console.log(`  New Tracking Start Date:  ${correctStartDate}`);

        tracking.startDate = correctStartDate;
        
        // Regenerate events based on the new correct start date
        const newEvents = generateTrackingTimeline(
          correctStartDate,
          tracking.destinationCountry,
          tracking.destinationCity
        );
        tracking.events = newEvents;
        
        tracking.markModified('events');
        await tracking.save();
        updatedCount++;
        console.log(`  -> Successfully updated and regenerated timeline.`);
      }
    }

    console.log(`\nFinished updating. Total trackings updated: ${updatedCount}`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Critical script error:', error);
    process.exit(1);
  }
}

fixTrackingDates();


