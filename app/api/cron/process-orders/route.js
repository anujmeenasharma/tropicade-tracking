import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { generateTrackingTimeline } from '@/lib/tracking-logic';
import { saveTracking } from '@/lib/db';
import { createShopifyFulfillment } from '@/lib/shopify';

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

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  
  const cronSecret = process.env.CRON_SECRET;
  
  if (!cronSecret) {
    console.warn('[Cron Job] CRON_SECRET is not defined in environment variables. Access is unauthenticated.');
  } else {
    const isAuthorized = 
      authHeader === `Bearer ${cronSecret}` || 
      token === cronSecret;
      
    if (!isAuthorized) {
      console.warn('[Cron Job] Unauthorized access attempt detected.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const client = await clientPromise;
    const db = client.db('titanxlogistics');
    const collection = db.collection('shopify_orders');

    const now = new Date();
    
    // Find unprocessed orders where processAfter time has passed
    const pendingOrders = await collection.find({
      processed: false,
      processAfter: { $lte: now }
    }).limit(50).toArray();

    if (pendingOrders.length === 0) {
      return NextResponse.json({ message: 'No pending orders to process.' });
    }

    let processedCount = 0;
    const results = [];

    for (const order of pendingOrders) {
      try {
        const { shopifyOrderId, shippingCountry, shippingCity, orderCreatedDate } = order;
        
        // Generate tracking ID using random format
        const trackingId = generateTrackingId();
        
        let startDate;
        try {
          startDate = formatNextDayInTimezone(orderCreatedDate);
        } catch {
          startDate = formatNextDayInTimezone(new Date());
        }

        // 1. Generate Tracking Events using logic library
        const events = generateTrackingTimeline(
          startDate, 
          shippingCountry || 'United States', 
          shippingCity || 'Default City'
        );

        // 2. Sync fulfillment to Shopify
        let syncedToShopify = false;
        let shopifyFulfillment = null;
        const normalizedAppUrl = normalizeAppUrl(process.env.APP_URL);
        const trackingUrl = `${normalizedAppUrl}/track/${trackingId}`;

        try {
          const syncResult = await createShopifyFulfillment({
            orderId: shopifyOrderId,
            trackingNumber: trackingId,
            trackingUrl,
            carrierName: 'Titan X Logistics'
          });
          if (syncResult && syncResult.success) {
            syncedToShopify = true;
            shopifyFulfillment = syncResult.fulfillment;
            console.log(`[Cron Shopify Sync] Successfully synced tracking info to Shopify for order ${shopifyOrderId}`);
          } else {
            console.warn(`[Cron Shopify Sync] Skipped or failed to sync tracking info: ${syncResult?.reason}`);
          }
        } catch (syncError) {
          console.error(`[Cron Shopify Sync] Error syncing fulfillment for order ${shopifyOrderId}:`, syncError.message);
        }

        const newTracking = {
          trackingId,
          startDate,
          destinationCountry: shippingCountry || 'United States',
          destinationCity: shippingCity || 'Default City',
          status: 'active',
          events,
          syncedToShopify,
          shopifyFulfillment
        };

        // 3. Save the tracking entry
        const isSaved = await saveTracking(newTracking);
        if (!isSaved) {
          throw new Error(`Failed to save tracking info for order ${shopifyOrderId}`);
        }

        // 4. Mark the order as processed
        await collection.updateOne(
          { _id: order._id },
          { $set: { processed: true, processedAt: new Date() } }
        );

        processedCount++;
        results.push({ shopifyOrderId, trackingId, status: 'success', syncedToShopify });
        console.log(`[Cron Job] Successfully processed Shopify order ${shopifyOrderId} -> Tracking ID: ${trackingId}. Synced: ${syncedToShopify}`);
      } catch (err) {
        console.error(`[Cron Job] Failed to process order ${order.shopifyOrderId}:`, err);
        results.push({ shopifyOrderId: order.shopifyOrderId, error: err.message, status: 'failed' });
      }
    }

    return NextResponse.json({ 
      message: `Processed ${processedCount} out of ${pendingOrders.length} orders.`,
      details: results
    });
  } catch (error) {
    console.error('[Cron Job] Critical error in cron route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


