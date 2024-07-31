// # server.rb
// #
// # Use this sample code to handle webhook events in your integration.
// #
// # 1) Paste this code into a new file (server.rb)
// #
// # 2) Install dependencies
// #   gem install sinatra
// #   gem install stripe
// #
// # 3) Run the server on http://localhost:4242
// #   ruby server.rb

// require 'json'
// require 'sinatra'
// require 'stripe'

// # The library needs to be configured with your account's secret key.
// # Ensure the key is kept out of any version control system you might be using.
// Stripe.api_key = 'sk_test_...'

// # This is your Stripe CLI webhook secret for testing your endpoint locally.
// endpoint_secret = 'whsec_77f00730c84b498aea288a6160d4f2a570a283600ac7744483a41f6f8d2fc480'

// set :port, 4242

// post '/webhook' do
//     payload = request.body.read
//     sig_header = request.env['HTTP_STRIPE_SIGNATURE']
//     event = nil

//     begin
//         event = Stripe::Webhook.construct_event(
//             payload, sig_header, endpoint_secret
//         )
//     rescue JSON::ParserError => e
//         # Invalid payload
//         status 400
//         return
//     rescue Stripe::SignatureVerificationError => e
//         # Invalid signature
//         status 400
//         return
//     end

//     # Handle the event
//     case event.type
//     when 'customer.subscription.updated'
//         subscription = event.data.object
//     when 'invoice.payment_succeeded'
//         invoice = event.data.object
//     # ... handle other event types
//     else
//         puts "Unhandled event type: #{event.type}"
//     end

//     status 200
// end