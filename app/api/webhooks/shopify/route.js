import crypto from 'crypto';
import clientPromise from '@/lib/mongodb';

export async function POST(req) {
  try {
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
    
    if (!secret) {
      console.error('SHOPIFY_WEBHOOK_SECRET is missing from environment variables');
      return new Response('Internal Server Error: Secret not configured', { status: 500 });
    }

    const hmacHeader = req.headers.get('x-shopify-hmac-sha256');
    if (!hmacHeader) {
      console.warn('Webhook received but x-shopify-hmac-sha256 header is missing');
      return new Response('Unauthorized: Missing signature header', { status: 401 });
    }

    // Read the raw body as an ArrayBuffer to preserve exact binary data
    const arrayBuffer = await req.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      console.warn('Webhook received but body is empty');
      return new Response('Bad Request: Empty body', { status: 400 });
    }
    const rawBodyBuffer = Buffer.from(arrayBuffer);

    // Verify Signature using HMAC SHA256 on raw Buffer
    const hash = crypto
      .createHmac('sha256', secret)
      .update(rawBodyBuffer)
      .digest('base64');

    // Secure comparison of HMAC signature
    const hashBuffer = Buffer.from(hash, 'base64');
    const headerBuffer = Buffer.from(hmacHeader, 'base64');

    let isVerified = false;
    if (hashBuffer.length === headerBuffer.length) {
      isVerified = crypto.timingSafeEqual(hashBuffer, headerBuffer);
    }

    if (!isVerified) {
      console.warn('--- Shopify Webhook Signature Verification Failed ---');
      console.warn(`Loaded Secret: "${secret.substring(0, 4)}...${secret.substring(secret.length - 4)}" (Length: ${secret.length})`);
      console.warn(`Received Header: "${hmacHeader}"`);
      console.warn(`Computed Signature: "${hash}"`);
      console.warn('Action required: Please ensure SHOPIFY_WEBHOOK_SECRET in your .env matches the signing secret from your Shopify Admin (Settings > Notifications > Webhooks) or Shopify Partner Dashboard.');
      console.warn('----------------------------------------------------');
      return new Response('Unauthorized: Invalid signature', { status: 401 });
    }

    // Parse the validated JSON body
    let payload;
    try {
      const bodyText = rawBodyBuffer.toString('utf8');
      payload = JSON.parse(bodyText);
    } catch (parseError) {
      console.error('Failed to parse webhook JSON body:', parseError);
      return new Response('Bad Request: Invalid JSON', { status: 400 });
    }

    const orderId = payload.id ? payload.id.toString() : null;
    if (!orderId) {
      console.warn('Webhook parsed successfully but id is missing from payload');
      return new Response('Bad Request: Missing order id', { status: 400 });
    }

    const email = payload.email || payload.contact_email || '';
    const shippingAddress = payload.shipping_address || {};
    
    // Parse order date safely
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

    // Store the order as unprocessed (processed: false) with a 24-hour processAfter delay
    const client = await clientPromise;
    const db = client.db('titanxlogistics');
    const collection = db.collection('shopify_orders');

    await collection.updateOne(
      { shopifyOrderId: orderId },
      {
        $set: {
          shopifyOrderId: orderId,
          customerEmail: email,
          shippingCountry: country,
          shippingCity: city,
          orderCreatedDate: orderCreatedDate,
          processed: false,
          processAfter: processAfterTime,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    console.log(`[Shopify Webhook] Order ${orderId} registered. Scheduled to process after: ${processAfterTime.toISOString()}`);

    return new Response(JSON.stringify({
      message: 'Webhook received and scheduled for processing',
      shopifyOrderId: orderId,
      processAfter: processAfterTime
    }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error('[Shopify Webhook] Error processing webhook:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
