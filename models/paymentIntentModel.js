import mongoose from 'mongoose';

const paymentIntentSchema = new mongoose.Schema({
  paymentIntentId: { type: String, required: true },
  customerId: { type: String, required: true },
  emailId:{type:String,required:true},
  amount: { type: Number, required: true },
  paymentDate: { type: Date },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  description: { type: String },
  integraPublicKeyId:{type: String,required:true},
  numberOfTokens:{type: Number,required:true},
  amountPerToken:{type: Number,required:true},
  metaData: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true }); 
export default mongoose.model('PaymentIntent', paymentIntentSchema);
