const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const APP_URL = process.env.APP_URL || 'https://titanxlogistics.us';

if (!MONGODB_URI || !SHOPIFY_ACCESS_TOKEN || !SHOPIFY_STORE_DOMAIN) {
  console.error('Error: Missing required environment variables. Please check .env or .env.local');
  process.exit(1);
}

const Tracking = require('../models/Tracking');

function getNormalizedDomain(domain) {
  if (!domain) return '';
  return domain
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '')
    .trim();
}

async function fixLocalhostUrls() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Find all tracking documents where the synced tracking URL contains 'localhost'
    const query = {
      $or: [
        { 'shopifyFulfillment.tracking_url': { $regex: /localhost/i } },
        { 'shopifyFulfillment.tracking_urls': { $regex: /localhost/i } }
      ]
    };

    const trackings = await Tracking.find(query);
    console.log(`Found ${trackings.length} tracking records containing 'localhost' URLs.`);

    if (trackings.length === 0) {
      console.log('No records to fix.');
      await mongoose.disconnect();
      return;
    }

    const cleanDomain = getNormalizedDomain(SHOPIFY_STORE_DOMAIN);

    for (const tracking of trackings) {
      try {
        const trackingId = tracking.trackingId;
        const fulfillmentId = tracking.shopifyFulfillment?.id;

        if (!fulfillmentId) {
          console.warn(`Tracking ID ${trackingId} does not have a valid shopifyFulfillment ID. Skipping.`);
          continue;
        }

        const newTrackingUrl = `${APP_URL}/track/${trackingId}`;
        console.log(`Updating order tracking on Shopify for trackingId ${trackingId} (Fulfillment ID: ${fulfillmentId})...`);
        console.log(`New tracking URL: ${newTrackingUrl}`);

        const url = `https://${cleanDomain}/admin/api/2024-04/fulfillments/${fulfillmentId}/update_tracking.json`;
        const payload = {
          fulfillment: {
            notify_customer: false, // Don't spam customers with duplicate notifications
            tracking_info: {
              number: trackingId,
              url: newTrackingUrl,
              company: 'Titan X Logistics'
            }
          }
        };

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Shopify API responded with status ${response.status}: ${errorBody}`);
        }

        const data = await response.json();
        console.log(`Successfully updated Shopify tracking for ID ${trackingId}.`);

        // Update tracking document in MongoDB
        tracking.shopifyFulfillment = data.fulfillment;
        tracking.markModified('shopifyFulfillment');
        await tracking.save();

        console.log(`Updated database record for trackingId ${trackingId}.`);
      } catch (err) {
        console.error(`Failed to update tracking for trackingId ${tracking.trackingId}:`, err.message);
      }
    }

    console.log('Finished updating all records.');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Critical script error:', error);
    process.exit(1);
  }
}

fixLocalhostUrls();
