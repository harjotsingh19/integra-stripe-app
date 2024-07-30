import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String },
  emailId: { type: String, required: true, unique: true },
  password:{type: String},
  isAdmin: {
    type: Boolean,
    default: false,
  },
  phone: { type: String },
  stripeCustomerId: { type: String},
}, { timestamps: true }); 

export default mongoose.model('User', userSchema);
