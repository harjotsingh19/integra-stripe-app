import  mongoose from 'mongoose';
const { Schema } = mongoose;

const stripeSession = new Schema({
  sessionId: { type: String, required: true,unique: true }, // ID for the object (session_id, invoice_id, etc.)
  created: { type: Number },
  currency: { type: String },
  status: { type: String },
  customerId: { type: String },
  customerEmail: { type: String },
  eventId:{type: String},
  eventType:{type: String},
  paymentIntent: { type: String },
  payment_status: { type: String },
  invoiceId: { type: String },
  metadata: { type: Schema.Types.Mixed },
  mode: { type: String },
  invoiceDetails: {
    invoiceId: { type: String },
    amountDue: { type: Number },
    amountPaid: { type: Number },
    created: { type: Number },
    currency: { type: String },
    customerId: { type: String },
    customerEmail: { type: String },
    customerName: { type: String },
    InvoiceUrl: { type: String },
    invoicePdf: { type: String },
    paid: { type: Boolean, default: false },
    payment_intent: {type: String},
    status: { type: String, default: 'unpaid' },
    statementDescriptor: { type: String },
    
    subtotal: { type: Number },
    total: { type: Number }
  },
  subscriptionId:{ type: String },
  subscriptionDetails: {
    subscriptionId: { type: String },
    created: { type: Number },
    currency: { type: String },
    status: { type: String },
    currentPeriodStart: { type: Number },
    currentPeriodEnd: { type: Number },
    startDate: { type: Number },
    customerId: { type: String },
    default_payment_method: { type: String },
    latest_invoice: { type: String },
    items: { type: Schema.Types.Mixed
      // id: { type: String },
      // price: { type: String },
      // quantity: { type: Number }
    },
    planDetails: {
      planId: { type: String },
      created: { type: Number },
      currency: { type: String },
      interval:  { type: String },
      interval_count: { type: String },
      tokens: {type:Number},
      product: { type: String },
      amount: { type: Number },
      quantity: { type: Number },
    },
  },
  isTokenCredited:{type: Boolean , default:false},
  integraPublicKeyData: {
    type: mongoose.Schema.Types.Mixed,
  },
},{ timestamps: true },);

const subscriptionSession = mongoose.model('subscriptionSession', stripeSession);

export default subscriptionSession;