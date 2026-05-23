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

let myFetch;
if (typeof fetch !== 'undefined') {
  myFetch = fetch;
} else {
  try {
    myFetch = require('node-fetch');
  } catch {
    myFetch = null;
  }
}

function formatNextDayInTimezone(date, timeZone = process.env.TIMEZONE || 'Asia/Kolkata') {
  const d = date ? new Date(date) : new Date();
  const nextDay = new Date(d.getTime() + 24 * 60 * 60 * 1000);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(nextDay);
  const year = parts.find(p => p.type === 'year').value;
  const month = parts.find(p => p.type === 'month').value;
  const day = parts.find(p => p.type === 'day').value;
  return `${year}-${month}-${day}`;
}

async function getShopifyOrderBillingAddress(orderId) {
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!accessToken || !storeDomain || !myFetch) {
    return null;
  }
  const cleanDomain = storeDomain.replace(/^https?:\/\//i, '').replace(/\/+$/, '').trim();
  const url = `https://${cleanDomain}/admin/api/2024-04/orders/${orderId}.json`;
  try {
    const res = await myFetch(url, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      }
    });
    if (res.ok) {
      const data = await res.json();
      return data.order?.billing_address || data.order?.shipping_address || null;
    }
  } catch (err) {
    console.error(`Failed to fetch order ${orderId} from Shopify:`, err.message);
  }
  return null;
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
      const correctStartDate = formatNextDayInTimezone(order.orderCreatedDate);

      // Fetch original billing address from Shopify
      let billingAddress = await getShopifyOrderBillingAddress(orderId);
      if (!billingAddress) {
        console.log(`  Could not fetch billing address from Shopify for order ${orderId}. Using database order fields.`);
        billingAddress = {
          country: order.shippingCountry,
          city: order.shippingCity
        };
      }

      const correctCountry = billingAddress.country || 'United States';
      const correctCity = billingAddress.city || 'Default City';

      let needsUpdate = false;
      if (tracking.startDate !== correctStartDate) {
        console.log(`  Date mismatch for ${tracking.trackingId}: ${tracking.startDate} -> ${correctStartDate}`);
        tracking.startDate = correctStartDate;
        needsUpdate = true;
      }
      if (tracking.destinationCountry !== correctCountry) {
        console.log(`  Country mismatch for ${tracking.trackingId}: ${tracking.destinationCountry} -> ${correctCountry}`);
        tracking.destinationCountry = correctCountry;
        needsUpdate = true;
      }
      if (tracking.destinationCity !== correctCity) {
        console.log(`  City mismatch for ${tracking.trackingId}: ${tracking.destinationCity} -> ${correctCity}`);
        tracking.destinationCity = correctCity;
        needsUpdate = true;
      }

      if (needsUpdate) {
        console.log(`Updating ${tracking.trackingId}:`);
        console.log(`  Order Created Date (UTC): ${order.orderCreatedDate.toISOString()}`);
        console.log(`  Tracking Start Date:  ${correctStartDate}`);
        console.log(`  Destination:  ${correctCity}, ${correctCountry}`);

        // Regenerate events based on the new correct start date and correct address
        const newEvents = generateTrackingTimeline(
          correctStartDate,
          correctCountry,
          correctCity
        );
        tracking.events = newEvents;
        
        tracking.markModified('events');
        await tracking.save();
        
        // Also update local Order document for consistency
        order.shippingCountry = correctCountry;
        order.shippingCity = correctCity;
        await order.save();

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


