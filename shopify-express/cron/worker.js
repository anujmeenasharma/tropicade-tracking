const cron = require('node-cron');
const Order = require('../models/Order');
const Tracking = require('../models/Tracking');
const { generateTrackingTimeline } = require('../utils/tracking');
const { createShopifyFulfillment } = require('../utils/shopify');

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

function formatNextDayInTimezone(date, timeZone = process.env.TIMEZONE || 'Europe/Berlin') {
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

// The core worker processing logic
async function processPendingOrders() {
  console.log(`[Express Cron] Running pending orders check at ${new Date().toISOString()}`);
  try {
    const now = new Date();

    // Find up to 50 unprocessed orders that have reached their processAfter time
    const pendingOrders = await Order.find({
      processed: false,
      processAfter: { $lte: now }
    }).limit(50);

    if (pendingOrders.length === 0) {
      console.log('[Express Cron] No pending orders to process.');
      return;
    }

    console.log(`[Express Cron] Found ${pendingOrders.length} orders ready to process.`);

    for (const order of pendingOrders) {
      try {
        const trackingId = generateTrackingId();
        const startDate = formatNextDayInTimezone(order.orderCreatedDate);

        // 1. Generate Timeline
        const events = generateTrackingTimeline(
          startDate,
          order.shippingCountry,
          order.shippingCity
        );

        // 2. Sync fulfillment to Shopify
        const normalizedAppUrl = normalizeAppUrl(process.env.APP_URL);
        const trackingUrl = `${normalizedAppUrl}/track/${trackingId}`;
        let syncedToShopify = false;
        let shopifyFulfillment = null;

        try {
          const syncResult = await createShopifyFulfillment({
            orderId: order.shopifyOrderId,
            trackingNumber: trackingId,
            trackingUrl,
            carrierName: 'Titan X Logistics'
          });
          if (syncResult && syncResult.success) {
            syncedToShopify = true;
            shopifyFulfillment = syncResult.fulfillment;
            console.log(`[Express Cron Sync] Successfully synced tracking info to Shopify for order ${order.shopifyOrderId}`);
          } else {
            console.warn(`[Express Cron Sync] Skipped or failed to sync: ${syncResult?.reason}`);
          }
        } catch (syncError) {
          console.error(`[Express Cron Sync] Error syncing fulfillment for order ${order.shopifyOrderId}:`, syncError.message);
        }

        // 3. Save/Upsert Tracking document
        await Tracking.findOneAndUpdate(
          { trackingId: trackingId },
          {
            trackingId,
            startDate,
            destinationCountry: order.shippingCountry,
            destinationCity: order.shippingCity,
            status: 'active',
            events,
            syncedToShopify,
            shopifyFulfillment
          },
          { upsert: true, new: true }
        );

        // 4. Mark the Order as processed
        order.processed = true;
        order.processedAt = new Date();
        await order.save();

        console.log(`[Express Cron] Successfully processed Shopify order ${order.shopifyOrderId} -> Tracking ID: ${trackingId}. Synced: ${syncedToShopify}`);
      } catch (orderError) {
        console.error(`[Express Cron] Error processing order ${order.shopifyOrderId}:`, orderError);
        // Will retry in the next run because processed remains false
      }
    }
  } catch (error) {
    console.error('[Express Cron] Critical error in cron job:', error);
  }
}

// Schedule the cron job to run every 5 minutes
function startCron() {
  // '*/5 * * * *' = every 5 minutes
  cron.schedule('*/5 * * * *', processPendingOrders);
  console.log('[Express Cron] Cron scheduler initialized (Interval: Every 5 minutes).');
  
  // Optional: Run immediately on startup for testing/verification
  if (process.env.RUN_CRON_ON_STARTUP === 'true') {
    console.log('[Express Cron] Running initial cron job on startup...');
    processPendingOrders();
  }
}

module.exports = {
  startCron,
  processPendingOrders
};


