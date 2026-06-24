/**
 * Script to add tracking links to all orders created yesterday.
 * Fetches yesterday's orders from Shopify, registers them in MongoDB,
 * and creates fulfillments with tracking details.
 * 
 * Usage:
 *   node shopify-express/scripts/process-yesterday-orders.js [--dry-run]
 */

const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
const timeZone = process.env.TIMEZONE || 'Europe/Berlin';

if (!MONGODB_URI) {
  console.error('Error: Missing MONGODB_URI environment variable.');
  process.exit(1);
}
if (!storeDomain || !accessToken) {
  console.error('Error: Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ACCESS_TOKEN env variables.');
  process.exit(1);
}

const Order = require('../models/Order');
const Tracking = require('../models/Tracking');
const { generateTrackingTimeline } = require('../utils/tracking');
const { createShopifyFulfillment } = require('../utils/shopify');

const isDryRun = process.argv.includes('--dry-run');

// Delay helper for rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function generateTrackingId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let id = 'TXK-';
  for (let i = 0; i < 5; i++) id += numbers.charAt(Math.floor(Math.random() * numbers.length));
  id += letters.charAt(Math.floor(Math.random() * letters.length));
  return id;
}

function normalizeAppUrl(url) {
  if (!url) return 'https://titanxlogistics.us';
  let cleaned = url.trim();
  if (/^https?\/\//i.test(cleaned)) {
    cleaned = cleaned.replace(/^(https?)\/\//i, '$1://');
  } else if (/^https?:\/([^/])/i.test(cleaned)) {
    cleaned = cleaned.replace(/^(https?):\/([^/])/i, '$1://$2');
  } else if (/^https?\/([^/])/i.test(cleaned)) {
    cleaned = cleaned.replace(/^(https?)\/([^/])/i, '$1://$2');
  } else if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }
  cleaned = cleaned.replace(/\/+$/, '');
  return cleaned;
}

function formatNextDayInTimezone(date, tz = timeZone) {
  const d = date ? new Date(date) : new Date();
  const nextDay = new Date(d.getTime() + 24 * 60 * 60 * 1000);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
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

function getLocalDateString(date, tz = timeZone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find(p => p.type === 'year').value;
  const month = parts.find(p => p.type === 'month').value;
  const day = parts.find(p => p.type === 'day').value;
  return `${year}-${month}-${day}`;
}

function getNextDay10AM(baseDate, tz = timeZone) {
  const date = baseDate ? new Date(baseDate) : new Date();
  const tomorrow = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(tomorrow);
  const year = parts.find(p => p.type === 'year').value;
  const month = parts.find(p => p.type === 'month').value;
  const day = parts.find(p => p.type === 'day').value;
  
  const targetISO = `${year}-${month}-${day}T10:00:00`;
  const dateWithNoOffset = new Date(targetISO + 'Z');
  
  const offsetFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  });
  const offsetParts = offsetFormatter.formatToParts(dateWithNoOffset);
  const getOffsetPart = (type) => offsetParts.find(p => p.type === type).value;
  
  const locYear = parseInt(getOffsetPart('year'), 10);
  const locMonth = parseInt(getOffsetPart('month'), 10) - 1;
  const locDay = parseInt(getOffsetPart('day'), 10);
  const locHour = parseInt(getOffsetPart('hour'), 10);
  const locMin = parseInt(getOffsetPart('minute'), 10);
  const locSec = parseInt(getOffsetPart('second'), 10);
  
  const parsedLoc = Date.UTC(locYear, locMonth, locDay, locHour, locMin, locSec);
  const diff = parsedLoc - dateWithNoOffset.getTime();
  
  return new Date(dateWithNoOffset.getTime() - diff);
}

async function run() {
  console.log('========================================================');
  console.log(`[Processor] Starting process-yesterday-orders script...`);
  if (isDryRun) {
    console.log(`[Processor] *** DRY RUN MODE ACTIVE - No changes will be saved to MongoDB or synced to Shopify ***`);
  }
  console.log('========================================================');

  const now = new Date();
  const todayStr = getLocalDateString(now);
  const seventyTwoHoursAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000);

  console.log(`Current Server Time (UTC): ${now.toISOString()}`);
  console.log(`Timezone: ${timeZone}`);
  console.log(`Today's local date: ${todayStr}`);
  console.log(`Fetching orders from the past 72 hours (since ${seventyTwoHoursAgo.toISOString()})`);

  // Connect to DB
  console.log('Connecting to database...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB.');

  const cleanDomain = storeDomain.replace(/^https?:\/\//i, '').replace(/\/+$/, '').trim();
  
  // We query orders created in the last 4 days to account for any timezone boundary edge cases and 72h buffer
  const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
  const url = `https://${cleanDomain}/admin/api/2024-04/orders.json?created_at_min=${fourDaysAgo.toISOString()}&status=any&limit=250`;
  
  console.log(`Fetching orders from Shopify: ${url}`);
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    }
  });

  if (!res.ok) {
    console.error(`Failed to fetch orders from Shopify: ${res.status} ${res.statusText}`);
    const details = await res.text();
    console.error(details);
    await mongoose.disconnect();
    process.exit(1);
  }

  const data = await res.json();
  const allOrders = data.orders || [];
  console.log(`Fetched ${allOrders.length} recent orders from Shopify.`);

  // Filter for orders created in the past 72 hours
  const targetOrders = allOrders.filter(order => {
    const orderDate = new Date(order.created_at);
    return orderDate >= seventyTwoHoursAgo && orderDate <= now;
  });

  console.log(`Found ${targetOrders.length} orders created in the past 72 hours.`);

  if (targetOrders.length === 0) {
    console.log('No orders to process.');
    await mongoose.disconnect();
    return;
  }

  let processedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const order of targetOrders) {
    const orderId = order.id.toString();
    const orderName = order.name || `#${orderId}`;
    console.log(`\n--------------------------------------------------------`);
    console.log(`Processing Order ${orderName} (ID: ${orderId})`);
    console.log(`  Created At: ${order.created_at}`);
    console.log(`  Fulfillment Status: ${order.fulfillment_status}`);

    const isAlreadyFulfilled = order.fulfillment_status === 'fulfilled';
    
    // Check local database for Order status
    const localOrder = await Order.findOne({ shopifyOrderId: orderId });
    const isAlreadyProcessed = localOrder && localOrder.processed;

    // Check if tracking document already exists in DB
    const existingTracking = await Tracking.findOne({
      $or: [
        { 'shopifyFulfillment.order_id': orderId },
        { 'shopifyFulfillment.order_id': Number(orderId) }
      ]
    });

    const email = order.email || order.contact_email || '';
    const billingAddress = order.billing_address || order.shipping_address || {};
    const country = billingAddress.country || 'United States';
    const city = billingAddress.city || 'Default City';
    const orderCreatedDate = new Date(order.created_at);
    const processAfter = getNextDay10AM(orderCreatedDate);

    if (isAlreadyFulfilled) {
      // Check if there is a Titan X Logistics fulfillment on Shopify
      const titanFulfillment = order.fulfillments && order.fulfillments.find(f => 
        f.tracking_company === 'Titan X Logistics' || 
        (f.tracking_number && (f.tracking_number.startsWith('TX-') || f.tracking_number.startsWith('TXK-')))
      );

      if (titanFulfillment) {
        const trackingId = titanFulfillment.tracking_number;
        
        // Check if this tracking exists locally
        const localTracking = await Tracking.findOne({ trackingId });
        if (!localTracking) {
          console.log(`  -> Detected fulfilled order with missing local tracking record in DB. Restoring tracking ID: ${trackingId}...`);
          
          if (isDryRun) {
            console.log(`  [DRY RUN] Would restore tracking record for trackingId=${trackingId} to MongoDB`);
            processedCount++;
            continue;
          }

          // Generate tracking events
          const startDate = formatNextDayInTimezone(orderCreatedDate);
          const events = generateTrackingTimeline(startDate, country, city);

          // Save tracking document to MongoDB
          await Tracking.findOneAndUpdate(
            { trackingId },
            {
              trackingId,
              startDate,
              destinationCountry: country,
              destinationCity: city,
              status: 'active',
              events,
              syncedToShopify: true,
              shopifyFulfillment: titanFulfillment
            },
            { upsert: true, new: true }
          );

          // Mark local order as processed
          await Order.findOneAndUpdate(
            { shopifyOrderId: orderId },
            {
              shopifyOrderId: orderId,
              customerEmail: email,
              shippingCountry: country,
              shippingCity: city,
              orderCreatedDate: orderCreatedDate,
              processed: true,
              processAfter: processAfter,
              processedAt: new Date(),
              updatedAt: new Date()
            },
            { upsert: true }
          );

          console.log(`  -> Successfully restored tracking record to MongoDB.`);
          processedCount++;
          continue;
        }
      }

      console.log(`  -> Order is already fulfilled on Shopify and exists locally. Skipping.`);
      skippedCount++;
      continue;
    }

    if (isAlreadyProcessed) {
      console.log(`  -> Order is already marked processed: true in local DB. Skipping.`);
      skippedCount++;
      continue;
    }

    if (existingTracking) {
      console.log(`  -> Tracking document (${existingTracking.trackingId}) already exists for this order. Skipping.`);
      skippedCount++;
      continue;
    }

    console.log(`  Customer: ${email}`);
    console.log(`  Destination: ${city}, ${country}`);
    console.log(`  processAfter (Next day 10AM): ${processAfter.toISOString()}`);

    // If dry run, just simulate the rest
    if (isDryRun) {
      console.log(`  [DRY RUN] Would upsert local Order: shopifyOrderId=${orderId}, processed=false`);
      console.log(`  [DRY RUN] Would generate tracking ID, tracking timeline events, and call createShopifyFulfillment`);
      console.log(`  [DRY RUN] Would save Tracking document with status=active and syncedToShopify=true`);
      console.log(`  [DRY RUN] Would set local Order processed=true`);
      processedCount++;
      continue;
    }

    // 1. Sync order to local DB as unprocessed first (or update it)
    await Order.findOneAndUpdate(
      { shopifyOrderId: orderId },
      {
        shopifyOrderId: orderId,
        customerEmail: email,
        shippingCountry: country,
        shippingCity: city,
        orderCreatedDate: orderCreatedDate,
        processed: false,
        processAfter: processAfter,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // 2. Generate Tracking ID and Timeline
    const trackingId = generateTrackingId();
    const startDate = formatNextDayInTimezone(orderCreatedDate);
    const events = generateTrackingTimeline(startDate, country, city);

    // 3. Build tracking URL & sync to Shopify
    const normalizedAppUrl = normalizeAppUrl(process.env.APP_URL);
    const trackingUrl = `${normalizedAppUrl}/track/${trackingId}`;
    
    let syncedToShopify = false;
    let shopifyFulfillment = null;

    try {
      console.log(`  Creating fulfillment on Shopify (Tracking ID: ${trackingId})...`);
      const syncResult = await createShopifyFulfillment({
        orderId,
        trackingNumber: trackingId,
        trackingUrl,
        carrierName: 'Titan X Logistics'
      });

      if (syncResult && syncResult.success) {
        syncedToShopify = true;
        shopifyFulfillment = syncResult.fulfillment;
        console.log(`  -> Successfully synced tracking info to Shopify.`);
      } else {
        console.warn(`  -> Skipped/Failed syncing to Shopify: ${syncResult?.reason}`);
      }
    } catch (syncError) {
      console.error(`  -> Error syncing fulfillment to Shopify:`, syncError.message);
    }

    // 4. Save/Upsert Tracking document
    try {
      await Tracking.findOneAndUpdate(
        { trackingId: trackingId },
        {
          trackingId,
          startDate,
          destinationCountry: country,
          destinationCity: city,
          status: 'active',
          events,
          syncedToShopify,
          shopifyFulfillment
        },
        { upsert: true, new: true }
      );
      console.log(`  -> Saved tracking document to MongoDB.`);
    } catch (dbError) {
      console.error(`  -> Failed to save tracking document to MongoDB:`, dbError.message);
      errorCount++;
      continue;
    }

    // 5. Mark local Order as processed
    try {
      await Order.findOneAndUpdate(
        { shopifyOrderId: orderId },
        {
          processed: true,
          processedAt: new Date()
        }
      );
      console.log(`  -> Marked local Order as processed: true.`);
      processedCount++;
    } catch (dbError) {
      console.error(`  -> Failed to update order processed status in MongoDB:`, dbError.message);
      errorCount++;
    }

    // Shopify Rate Limit safety delay (500ms)
    await delay(500);
  }

  console.log(`\n========================================================`);
  console.log(`[Processor] Processing Completed.`);
  console.log(`  Total Orders Found (Past 72h): ${targetOrders.length}`);
  console.log(`  Successfully Processed/Fulfilling: ${processedCount}`);
  console.log(`  Skipped (Already Processed/Fulfilled): ${skippedCount}`);
  console.log(`  Errors Encountered: ${errorCount}`);
  console.log('========================================================');

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('Critical script error:', err);
  await mongoose.disconnect();
  process.exit(1);
});
