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
        const startDate = order.orderCreatedDate 
          ? new Date(order.orderCreatedDate).toISOString().split('T')[0] 
          : new Date().toISOString().split('T')[0];

        // 1. Generate Timeline
        const events = generateTrackingTimeline(
          startDate,
          order.shippingCountry,
          order.shippingCity
        );

        // 2. Sync fulfillment to Shopify
        let syncedToShopify = false;
        let shopifyFulfillment = null;
        const trackingUrl = `${process.env.APP_URL || 'https://tropicade.com'}/track/${trackingId}`;

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

// Schedule the cron job to run every minute for faster testing
function startCron() {
  // Run every minute
  cron.schedule('* * * * *', processPendingOrders);
  console.log('[Express Cron] Cron scheduler initialized (Interval: Every 1 minute).');
  
  // Run immediately on startup for testing/verification
  console.log('[Express Cron] Running initial cron job on startup...');
  processPendingOrders();
}

module.exports = {
  startCron,
  processPendingOrders
};
