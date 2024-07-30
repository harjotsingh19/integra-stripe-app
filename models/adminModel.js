import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String },
  emailId: { type: String, required: true, unique: true },
  phone: { type: String },
  stripeCustomerId: { type: String, required: true },
}, { timestamps: true }); 

export default mongoose.model('User', userSchema);
