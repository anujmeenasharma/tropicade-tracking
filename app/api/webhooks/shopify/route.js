import crypto from 'crypto';
import clientPromise from '@/lib/mongodb';

/**
 * Calculates the next day 10:00 AM in the specified timezone
 * @param {Date} baseDate The starting date (e.g. orderCreatedDate)
 * @param {string} [timeZone] The timezone to use (defaults to process.env.TIMEZONE or 'Asia/Kolkata')
 * @returns {Date} The UTC Date object representing 10:00 AM of the next calendar day in that timezone.
 */
function getNextDay10AM(baseDate, timeZone = process.env.TIMEZONE || 'Asia/Kolkata') {
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
    const billingAddress = payload.billing_address || payload.shipping_address || {};
    
    // Parse order date safely
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

    // Store the order as unprocessed (processed: false) with a next-day 10 AM delay
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
