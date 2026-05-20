import crypto from 'crypto';

/**
 * Normalizes the Shopify store domain by removing any protocols or trailing slashes.
 * e.g., 'https://my-store.myshopify.com/' becomes 'my-store.myshopify.com'
 */
function getNormalizedDomain(domain) {
  if (!domain) return '';
  return domain
    .replace(/^https?:\/\//i, '') // Remove http:// or https://
    .replace(/\/+$/, '')          // Remove trailing slashes
    .trim();
}

/**
 * Fetches the active fulfillment orders for a given Shopify order ID.
 * Returns the list of unfulfilled fulfillment order IDs.
 */
async function getFulfillmentOrderIds(orderId, storeDomain, accessToken) {
  const cleanDomain = getNormalizedDomain(storeDomain);
  const url = `https://${cleanDomain}/admin/api/2024-04/orders/${orderId}/fulfillment_orders.json`;

  console.log(`[Shopify API] Fetching fulfillment orders for order ${orderId} from https://${cleanDomain}`);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to fetch fulfillment orders (Status: ${response.status}). Details: ${errorBody}`);
  }

  const data = await response.json();
  const fulfillmentOrders = data.fulfillment_orders || [];

  // Filter for fulfillment orders that are not yet fulfilled and support creation of fulfillment
  const activeOrders = fulfillmentOrders.filter(
    (fo) =>
      (fo.status === 'open' || fo.status === 'unfulfilled') &&
      fo.supported_actions &&
      fo.supported_actions.includes('create_fulfillment')
  );

  if (activeOrders.length === 0) {
    console.warn(`[Shopify API] No active/unfulfilled fulfillment orders found for Shopify order ID: ${orderId}`);
    return [];
  }

  return activeOrders.map((fo) => fo.id);
}

/**
 * Creates a fulfillment for the specified order and attaches the tracking details.
 * Does NOT mark the order as delivered.
 * 
 * @param {string} orderId - Shopify Order ID
 * @param {string} trackingNumber - Unique generated tracking ID (e.g. TX-XXXXXX)
 * @param {string} trackingUrl - Tracking tracking details URL
 * @param {string} carrierName - e.g., 'Titan X Logistics'
 * @returns {Promise<object>} The Shopify fulfillment response object.
 */
export async function createShopifyFulfillment({
  orderId,
  trackingNumber,
  trackingUrl,
  carrierName = 'Titan X Logistics'
}) {
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;

  if (!accessToken || accessToken.startsWith('shpat_xxxx')) {
    throw new Error('SHOPIFY_ACCESS_TOKEN is missing or not configured in environment');
  }
  if (!storeDomain || storeDomain.includes('your-store-domain')) {
    throw new Error('SHOPIFY_STORE_DOMAIN is missing or not configured in environment');
  }

  try {
    // 1. Fetch active fulfillment order IDs for the order
    const fulfillmentOrderIds = await getFulfillmentOrderIds(orderId, storeDomain, accessToken);

    if (fulfillmentOrderIds.length === 0) {
      console.warn(`[Shopify API] Order ${orderId} cannot be fulfilled (might already be fulfilled or cancelled).`);
      return { success: false, reason: 'No active fulfillment orders available' };
    }

    // 2. Prepare the fulfillment payload
    // Build line items mapping for each active fulfillment order
    const lineItemsByFulfillmentOrder = fulfillmentOrderIds.map((foId) => ({
      fulfillment_order_id: foId
    }));

    const cleanDomain = getNormalizedDomain(storeDomain);
    const url = `https://${cleanDomain}/admin/api/2024-04/fulfillments.json`;

    const payload = {
      fulfillment: {
        notify_customer: true,
        tracking_info: {
          number: trackingNumber,
          url: trackingUrl,
          company: carrierName
        },
        line_items_by_fulfillment_order: lineItemsByFulfillmentOrder
      }
    };

    console.log(`[Shopify API] Submitting fulfillment request for Shopify order ${orderId}...`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Fulfillment creation failed (Status: ${response.status}). Details: ${errorBody}`);
    }

    const data = await response.json();
    console.log(`[Shopify API] Successfully created fulfillment for Shopify order ${orderId}.`);
    
    return {
      success: true,
      fulfillment: data.fulfillment
    };
  } catch (error) {
    console.error(`[Shopify API] Error in createShopifyFulfillment for order ${orderId}:`, error.message);
    throw error;
  }
}
