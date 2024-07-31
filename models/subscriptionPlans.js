import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
  productId: {
    type: String,
    required: false, // Temporarily allow null
    unique: true,
  },
  priceId: {
    type: String,
    required: false, // Can be null if custom pricing
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  period: {
    type: String,
    enum: ['month', 'year'],
    required: true,
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

const SubsciptionPlan = mongoose.model('SubsciptionPlan', productSchema);

export default SubsciptionPlan;
