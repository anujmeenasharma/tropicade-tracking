const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const verifyShopifyWebhook = require('../middleware/verifyShopifyWebhook');

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
    const shippingAddress = payload.shipping_address || {};

    let orderCreatedDate = new Date();
    if (payload.created_at) {
      const parsedDate = new Date(payload.created_at);
      if (!isNaN(parsedDate.getTime())) {
        orderCreatedDate = parsedDate;
      }
    }

    const country = shippingAddress.country || 'United States';
    const city = shippingAddress.city || 'Default City';

    // Calculate processAfter time (24 hours from now)
    const processAfterTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Mongoose Upsert for Shopify Order (Marked as unprocessed, with 24-hour delay)
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
