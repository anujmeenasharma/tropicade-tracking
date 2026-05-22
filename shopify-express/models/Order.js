const mongoose = require('mongoose');

const ShopifyOrderSchema = new mongoose.Schema(
  {
    shopifyOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customerEmail: {
      type: String,
      lowercase: true,
      trim: true
    },
    shippingCountry: {
      type: String,
      default: 'United States'
    },
    shippingCity: {
      type: String,
      default: 'Default City'
    },
    orderCreatedDate: {
      type: Date,
      required: true
    },
    processed: {
      type: Boolean,
      default: false,
      index: true
    },
    processAfter: {
      type: Date,
      required: true,
      index: true
    },
    processedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ShopifyOrder', ShopifyOrderSchema, 'shopify_orders');
