# Shopify Webhook & Tracking Integration (Express)

This folder contains a production-ready, standalone Node.js Express server configured to receive and securely verify Shopify `orders/create` webhook events and schedule background tracking generation.

## Features

1. **Secure Webhook Handler**: Uses SHA256 HMAC signature verification with safe byte-comparison to prevent timing attacks.
2. **Raw Body Parsing Hook**: Safely preserves the raw payload buffer inside standard Express JSON middleware (`express.json()`).
3. **Database Upserts**: Saves raw Shopify order details to MongoDB with future `processAfter` processing dates.
4. **Cron Scheduler**: Employs `node-cron` to automatically process pending orders, build tracking records using custom business-day calculation, and flag orders as processed.

---

## Code Overview

- **`server.js`**: Application bootloader. Mounts routes and database. Captures `req.rawBody` for webhook verify headers.
- **`middleware/verifyShopifyWebhook.js`**: Reusable security middleware that verifies Shopify signatures using the HMAC-SHA256 protocol.
- **`models/Order.js`**: Mongoose Schema for webhook order storage.
- **`models/Tracking.js`**: Mongoose Schema for logistics timeline tracking.
- **`routes/orders.js`**: Express API controller for the webhook route `POST /api/webhooks/shopify`.
- **`cron/worker.js`**: Background cron scheduler running order processing.

---

## Environment Variables

Create a `.env` file inside this directory or set them in your hosting provider (e.g., Heroku, Render, AWS, Railway):

```ini
# MongoDB database connection string
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/titanxlogistics

# Shopify client secret (from App Admin Dashboard or Webhooks screen)
SHOPIFY_WEBHOOK_SECRET=your_shopify_webhook_secret

# Server runtime settings
PORT=3000

# Execute processing job immediately on server startup (great for testing)
RUN_CRON_ON_STARTUP=false
```

---

## Local Setup & Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
* **Production mode**:
  ```bash
  npm start
  ```
* **Development mode** (reloads on changes using Node --watch):
  ```bash
  npm run dev
  ```

---

## Testing & Verification

### 1. Tunneling Localhost (ngrok)
Shopify requires a public HTTPS URL to deliver webhook events. You can use **ngrok** to tunnel traffic:
```bash
ngrok http 3000
```
Use the forwarded HTTPS URL (e.g., `https://abcdef123.ngrok-free.app`) to register your webhook.

### 2. Register Webhook URL
Your webhook URL path will be:
`https://<your-domain>/api/webhooks/shopify`

#### Option A: Shopify Admin Portal
1. From Shopify Admin, go to **Settings > Notifications**.
2. Scroll to the **Webhooks** section and click **Create webhook**.
3. Select **Event**: `Order creation` (`orders/create`).
4. Select **Format**: `JSON`.
5. Enter **URL**: `https://<your-domain>/api/webhooks/shopify`.
6. Select **API Version**: Choose the latest stable release.
7. Click **Save**. Copy the **Webhook signing secret** and paste it into your `.env` file as `SHOPIFY_WEBHOOK_SECRET`.

#### Option B: Shopify CLI
If you are developing a custom app, you can trigger webhooks directly using the Shopify CLI:
```bash
shopify app webhook trigger --topic orders/create --delivery-method http --address https://<your-domain>/api/webhooks/shopify
```

### 3. Verify HMAC Manually (Mock Webhook Test)
You can test webhook validation locally using `curl`:

```bash
curl -X POST http://localhost:3000/api/webhooks/shopify \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Hmac-Sha256: INVALID_SIGNATURE_HEADER" \
  -d '{"id": 999999, "email": "test@customer.com", "shipping_address": {"city": "Berlin", "country": "Germany"}}'
```
*Expected Response:* `401 Unauthorized`

To simulate a successful webhook request, run the server with a test key (e.g., `test_shopify_webhook_secret_key`), generate a signature hash using that key, and include it in the header.
