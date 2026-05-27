const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const verifyShopifyWebhook = require('../middleware/verifyShopifyWebhook');

/**
 * Calculates the next day 10:00 AM in the specified timezone
 * @param {Date} baseDate The starting date (e.g. orderCreatedDate)
 * @param {string} [timeZone] The timezone to use (defaults to process.env.TIMEZONE or 'Europe/Berlin')
 * @returns {Date} The UTC Date object representing 10:00 AM of the next calendar day in that timezone.
 */
function getNextDay10AM(baseDate, timeZone = process.env.TIMEZONE || 'Europe/Berlin') {
  const date = baseDate ? new Date(baseDate) : new Date();
  const tomorrow = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
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
    timeZone,
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


/**
 * POST /api/webhooks/shopify
 * Shopify orders/create webhook handler
 */
router.post('/shopify', verifyShopifyWebhook, async (req, res) => {
  try {
    const payload = req.body;

    const orderId = payload.id ? payload.id.toString() : null;
    if (!orderId) {
      console.warn('[Express Webhook] Payload parsed successfully but order ID (id) is missing.');
      return res.status(400).json({ error: 'Bad Request: Missing order id' });
    }

    const email = payload.email || payload.contact_email || '';
    const billingAddress = payload.billing_address || payload.shipping_address || {};

    let orderCreatedDate = new Date();
    if (payload.created_at) {
      const parsedDate = new Date(payload.created_at);
      if (!isNaN(parsedDate.getTime())) {
        orderCreatedDate = parsedDate;
      }
    }

    const country = billingAddress.country || 'United States';
    const city = billingAddress.city || 'Default City';

    // Calculate processAfter time (Next day morning 10 AM)
    const processAfterTime = getNextDay10AM(orderCreatedDate);

    // Mongoose Upsert for Shopify Order (Marked as unprocessed, with next-day 10 AM delay)
    await Order.findOneAndUpdate(
      { shopifyOrderId: orderId },
      {
        shopifyOrderId: orderId,
        customerEmail: email,
        shippingCountry: country,
        shippingCity: city,
        orderCreatedDate: orderCreatedDate,
        processed: false,
        processAfter: processAfterTime
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`[Express Webhook] Shopify Order ${orderId} registered. Scheduled for processing after: ${processAfterTime.toISOString()}`);
    
    return res.status(200).json({
      message: 'Webhook received and scheduled for processing',
      shopifyOrderId: orderId,
      processAfter: processAfterTime
    });
  } catch (error) {
    console.error('[Express Webhook] Handler error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
