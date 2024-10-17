import mongoose from 'mongoose';
const { Schema } = mongoose;

const subscriptionRenewalSchema = new Schema({
  renewalId: { type: String, required: true,unique: true },
  subscriptionId: { type: String, required: true },
  renewalDate: { type: Number ,default:0},
  tokensCredited: { type: Boolean, default: false },
  sessionId: { type: String, required: true },
  sessionMetaData:{type: Schema.Types.Mixed},
  customerId : {type: String},
  priceId:{type: String},
  subscriptionType: {
    type: String,
    enum: ['first_time', 'renew'],
    required: true,
    default: 'first_time'
  },
  paid: {type: Boolean ,default: false},
  invoiceDetails: {
    invoiceId: { type: String },
    amountDue: { type: Number },
    amountPaid: { type: Number },
    created: { type: Number },
    currency: { type: String },
    customerId: { type: String },
    customerEmail: { type: String },
    customerName: { type: String },
    invoiceUrl: { type: String },
    invoicePdf: { type: String },
    paid: { type: Boolean, default: false },
    paymentIntent: { type: String },
    status: { type: String, default: 'unpaid' },
    statementDescriptor: { type: String },
    subtotal: { type: Number },
    total: { type: Number }
  },

  subscriptionDetails: {
    subscriptionId: { type: String },
    created: { type: Number },
    currency: { type: String },
    status: { type: String },
    currentPeriodStart: { type: Number },
    currentPeriodEnd: { type: Number },
    startDate: { type: Number },
    customerId: { type: String },
    defaultPaymentMethod: { type: String },
    latestInvoice: { type: String },
    items: { type: Schema.Types.Mixed }, // You can define a more specific schema if needed
    planDetails: {
      planId: { type: String },
      created: { type: Number },
      currency: { type: String },
      interval: { type: String },
      intervalCount: { type: String },
      tokens: { type: Number },
      product: { type: String },
      amount: { type: Number },
      quantity: { type: Number },
    },
  },
  integraPublicKeyData: {
    type: mongoose.Schema.Types.Mixed,
  },
},{ timestamps: true },);

// Create an index for `renewalDate`
subscriptionRenewalSchema.index({ renewalDate: -1 });

// Create indexes for improved query performance
subscriptionRenewalSchema.index({ subscriptionId: 1 }); // Index on subscriptionId
subscriptionRenewalSchema.index({ "invoiceDetails.invoiceId": 1 }); // Index on invoiceDetails.invoiceId

const SubscriptionRenewal = mongoose.model('SubscriptionRenewal', subscriptionRenewalSchema);

export default SubscriptionRenewal;
