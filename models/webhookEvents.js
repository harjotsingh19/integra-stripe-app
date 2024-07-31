import mongoose from 'mongoose';

// Define the schema for webhook events
const webhookEventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    unique: true,
    required: true,
  },
  eventType: {
    type: String,
    required: true,
  },
  eventData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  tokenAdded: {
    type: Boolean,
    default: false,
  },
  integraPublicKeyData: {
    type: mongoose.Schema.Types.Mixed,
  },
  tokensInPlan: {
    type: Number,
    required:false,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model based on the schema
const WebhookEvent = mongoose.model('WebhookEvent', webhookEventSchema);

export default WebhookEvent;
