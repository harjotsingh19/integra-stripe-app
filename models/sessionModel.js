import mongoose from 'mongoose';

const checkoutSessionSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    object: { type: String, required: true },
    amount_subtotal: { type: Number, required: true },
    amount_total: { type: Number, required: true },
    // cancel_url: { type: String, required: true },
    created: { type: Date, required: true },
    currency: { type: String, required: true },
    // custom_fields: [{ type: Schema.Types.Mixed }],
    // custom_text: {
    //   after_submit: { type: String, default: null },
    //   shipping_address: { type: String, default: null },
    //   submit: { type: String, default: null },
    //   terms_of_service_acceptance: { type: String, default: null }
    // },
    customer: { type: String, default: null },
    customer_creation: { type: String, required: true },
    customer_details: {
      address: {
        city: { type: String, default: null },
        country: { type: String, required: true },
        line1: { type: String, default: null },
        line2: { type: String, default: null },
        postal_code: { type: String, default: null },
        state: { type: String, default: null }
      },
      email: { type: String, required: true },
      name: { type: String, required: true },
      phone: { type: String, default: null },
      tax_exempt: { type: String, default: 'none' },
      tax_ids: [{ type: String }]
    },
    // customer_email: { type: String, default: null },
    expires_at: { type: Date, required: true },
    // invoice: { type: String, default: null },
    // invoice_creation: {
    //   enabled: { type: Boolean, default: false },
    //   invoice_data: {
    //     account_tax_ids: [{ type: String }],
    //     custom_fields: [{ type: Schema.Types.Mixed }],
    //     description: { type: String, default: null },
    //     footer: { type: String, default: null },
    //     issuer: { type: String, default: null },
    //     metadata: { type: Map, of: String },
    //     rendering_options: { type: String, default: null }
    //   }
    // },
    livemode: { type: Boolean, required: true },
    // locale: { type: String, default: null },
    // metadata: { type: Map, of: String },
    mode: { type: String, required: true },
    payment_intent: { type: String, required: true },
    // payment_link: { type: String, default: null },
    // payment_method_collection: { type: String, required: true },
    // payment_method_configuration_details: { type: String, default: null },
    payment_method_options: {
      card: {
        request_three_d_secure: { type: String, required: true }
      }
    },
    payment_method_types: [{ type: String, required: true }],
    payment_status: { type: String, required: true },
    // phone_number_collection: { enabled: { type: Boolean, default: false } },
    // recovered_from: { type: String, default: null },
    // saved_payment_method_options: { type: String, default: null },
    // setup_intent: { type: String, default: null },
    // shipping_address_collection: { type: String, default: null },
    // shipping_cost: { type: Number, default: null },
    // shipping_details: { type: Schema.Types.Mixed, default: null },
    // shipping_options: [{ type: Schema.Types.Mixed }],
    status: { type: String, required: true },
    // submit_type: { type: String, default: null },
    // subscription: { type: String, default: null },
    success_url: { type: String, required: true },
    // total_details: {
    //   amount_discount: { type: Number, required: true },
    //   amount_shipping: { type: Number, required: true },
    //   amount_tax: { type: Number, required: true }
    // },
    // ui_mode: { type: String, default: 'hosted' },
    // url: { type: String, default: null }
  }, {
    timestamps: true
  });

  export default mongoose.model('CheckoutSession', checkoutSessionSchema);