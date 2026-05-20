const crypto = require('crypto');

/**
 * Express middleware to verify the HMAC signature sent by Shopify.
 * Assumes express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }) is configured.
 */
function verifyShopifyWebhook(req, res, next) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  
  if (!secret) {
    console.error('[Shopify Verify Middleware] SHOPIFY_WEBHOOK_SECRET is not configured.');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const hmacHeader = req.get('x-shopify-hmac-sha256');
  
  if (!hmacHeader) {
    console.warn('[Shopify Verify Middleware] Access blocked: x-shopify-hmac-sha256 header is missing.');
    return res.status(401).json({ error: 'Unauthorized: Missing signature header' });
  }

  if (!req.rawBody) {
    console.error(
      '[Shopify Verify Middleware] Access blocked: req.rawBody is missing. ' +
      'Please make sure express.json() is configured with a verify option to capture raw bytes.'
    );
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Calculate the signature hash directly from the raw body Buffer
  const hash = crypto
    .createHmac('sha256', secret)
    .update(req.rawBody)
    .digest('base64');

  try {
    // Prevent timing attacks using crypto.timingSafeEqual
    const hashBuffer = Buffer.from(hash, 'base64');
    const headerBuffer = Buffer.from(hmacHeader, 'base64');

    if (hashBuffer.length !== headerBuffer.length || !crypto.timingSafeEqual(hashBuffer, headerBuffer)) {
      console.warn('--- Shopify Webhook Signature Verification Failed (Express) ---');
      console.warn(`Loaded Secret: "${secret.substring(0, 4)}...${secret.substring(secret.length - 4)}" (Length: ${secret.length})`);
      console.warn(`Received Header: "${hmacHeader}"`);
      console.warn(`Computed Signature: "${hash}"`);
      console.warn('Action required: Please ensure SHOPIFY_WEBHOOK_SECRET in your .env matches the signing secret from your Shopify Admin or Partner Dashboard.');
      console.warn('--------------------------------------------------------------');
      return res.status(401).json({ error: 'Unauthorized: Invalid signature' });
    }

    // Signature matches, proceed
    next();
  } catch (error) {
    console.error('[Shopify Verify Middleware] HMAC comparison failed:', error);
    return res.status(401).json({ error: 'Unauthorized: Signature comparison failed' });
  }
}

module.exports = verifyShopifyWebhook;
