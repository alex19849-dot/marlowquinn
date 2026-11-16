import type Stripe from 'stripe';
import { checkoutReady, deliveryQuote, SHOP_URL, TOTE_SLUG } from '@/lib/shop';
import { stripeClient } from '@/lib/stripe';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!checkoutReady()) return Response.json({ message: 'The shop is not open yet.' }, { status: 503 });
  if (request.headers.get('origin') !== SHOP_URL) return Response.json({ message: 'Please use the checkout on our website.' }, { status: 403 });
  try {
    const text = await request.text();
    if (text.length > 1024) return Response.json({ message: 'Please select your delivery country.' }, { status: 400 });
    let body;
    try { body = JSON.parse(text); } catch { return Response.json({ message: 'Please check your checkout details.' }, { status: 400 }); }
    const country = typeof body?.country === 'string' ? body.country : '';
    const requestId = typeof body?.requestId === 'string' ? body.requestId : '';
    const quantity = typeof body?.quantity === 'number' ? body.quantity : 0;
    const quote = deliveryQuote(country, quantity);
    if (!quote || !/^[0-9a-f-]{36}$/.test(requestId)) return Response.json({ message: 'Please select a supported delivery country.' }, { status: 400 });
    const stripe = stripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment', integration_identifier: 'marlow_tote_rqnvkzht',
      adaptive_pricing: { enabled: false },
      line_items: [{ price: process.env.STRIPE_TOTE_PRICE_ID!, quantity }],
      shipping_address_collection: { allowed_countries: [country as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry] },
      shipping_options: [{ shipping_rate_data: { type: 'fixed_amount', display_name: quote.label, fixed_amount: { amount: quote.amount, currency: 'gbp' } } }],
      automatic_tax: { enabled: false },
      success_url: `${SHOP_URL}/shop/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SHOP_URL}/shop/${TOTE_SLUG}`,
      metadata: { website_slug: TOTE_SLUG, delivery_country: country },
      custom_text: { shipping_address: { message: country === 'US' ? 'Your delivery charge includes US import duty.' : country === 'GB' ? 'UK tracked delivery is included.' : 'Local import taxes or duties may be payable on delivery.' } },
    }, { idempotencyKey: `tote-${country}-${quantity}-${requestId}` });
    if (!session.url || !session.livemode) throw new Error('Live checkout is unavailable.');
    return Response.json({ url: session.url });
  } catch {
    return Response.json({ message: 'Checkout could not open. Please try again.' }, { status: 502 });
  }
}
