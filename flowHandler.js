const customer = await stripe.customers.create({
    name: "Foo Bartley"
  });
  
  const paymentMethod = await stripe.paymentMethods.create(
    {
      type: 'card',
      card: {
        number: '4242424242424242',
        exp_month: 6,
        exp_year: 2021,
        cvc: '314',
      },
    }
  );
  
  const product = await stripe.products.create(
    {name: 'Gold Special'}
  );
  
  const price = await stripe.prices.create(
    {
      unit_amount: 1111,
      currency: 'eur',
      recurring: {interval: 'month'},
      product: product.id,
    }
  );
  
  // Everything above here is just setting up this demo
  
  const attachPaymentToCustomer = await stripe.paymentMethods.attach(
    paymentMethod.id,  // <-- your payment method ID collected via Stripe.js
    { customer: customer.id } // <-- your customer id from the request body  
    
  ); 
  
  const updateCustomerDefaultPaymentMethod = await stripe.customers.update(
    customer.id, { // <-- your customer id from the request body
    
      invoice_settings: {
        default_payment_method: paymentMethod.id, // <-- your payment method ID collected via Stripe.js
      },
  });
  
  const newSubscription = await stripe.subscriptions.create({
    customer: customer.id, // <-- your customer id from the request body
    items: [{ plan: price.id, quantity: 1 }], // <-- plans and prices are compatible Prices is a newer API
    default_payment_method: paymentMethod.id, // <-- your payment method ID collected via Stripe.js
  });