const mongoose = require('mongoose');

const TrackingEventSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  eventCode: { type: String, required: true },
  warning: { type: Boolean, default: false }
}, { _id: false });

const TrackingSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    startDate: {
      type: String, // YYYY-MM-DD
      required: true
    },
    destinationCountry: {
      type: String,
      required: true
    },
    destinationCity: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'delivered', 'returned', 'pending']
    },
    syncedToShopify: {
      type: Boolean,
      default: false
    },
    shopifyFulfillment: {
      type: Object
    },
    events: [TrackingEventSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Tracking', TrackingSchema);
