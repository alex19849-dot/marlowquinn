import type Stripe from 'stripe';
import { checkoutReady, deliveryQuote, getToteProduct, SHOP_URL, TOTE_SLUG, validProductSize, getProductColour } from '@/lib/shop';
import { stripeClient } from '@/lib/stripe';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (request.headers.get('origin') !== SHOP_URL) return Response.json({ message: 'Please use the checkout on our website.' }, { status: 403 });
  try {
    const text = await request.text();
    if (text.length > 1024) return Response.json({ message: 'Please select your delivery country.' }, { status: 400 });
    let body;
    try { body = JSON.parse(text); } catch { return Response.json({ message: 'Please check your checkout details.' }, { status: 400 }); }
    // Default preserves checkout for visitors with the original product page cached.
    const slug = body?.productSlug === undefined ? TOTE_SLUG : body.productSlug;
    const product = typeof slug === 'string' ? getToteProduct(slug) : undefined;
    if (!product) return Response.json({ message: 'Please choose a product from the shop.' }, { status: 400 });
    const colour = getProductColour(product.slug, body?.colour);
    if (!colour) return Response.json({ message: 'Please choose an available colour.' }, { status: 400 });
    const size = (product.kind === 'shirt' || product.kind === 'hoodie') ? body?.size : undefined;
    if ((product.kind === 'shirt' || product.kind === 'hoodie') && !validProductSize(product.slug, size)) return Response.json({ message: 'Please choose an available size.' }, { status: 400 });
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ message: 'Please enter an email address for your receipt.' }, { status: 400 });
    if (!checkoutReady(product.slug)) return Response.json({ message: 'This product is not available to order yet.' }, { status: 503 });
    const country = typeof body?.country === 'string' ? body.country : '';
    const requestId = typeof body?.requestId === 'string' ? body.requestId : '';
    const quantity = typeof body?.quantity === 'number' ? body.quantity : 0;
    const quote = deliveryQuote(country, quantity, product.slug);
    if (!quote || !/^[0-9a-f-]{36}$/.test(requestId)) return Response.json({ message: 'Please select a supported delivery country.' }, { status: 400 });
    const stripe = stripeClient();
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      mode: 'payment', integration_identifier: 'marlow_tote_rqnvkzht',
      adaptive_pricing: { enabled: false },
      line_items: [{ price: process.env[product.priceEnv]!, quantity }],
      shipping_address_collection: { allowed_countries: [country as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry] },
      shipping_options: [{ shipping_rate_data: { type: 'fixed_amount', display_name: quote.label, fixed_amount: { amount: quote.amount, currency: 'gbp' } } }],
      automatic_tax: { enabled: false },
      success_url: `${SHOP_URL}/shop/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SHOP_URL}/shop/${product.slug}`,
      metadata: { website_slug: product.slug, website_colour: colour, delivery_country: country, ...(size ? { website_size: size } : {}) },
      payment_intent_data: { receipt_email: email, description: `${quantity} x ${product.name} (${product.kind}, ${colour}${size ? ', size ' + size : ''}). UK orders include delivery.`, metadata: { website_slug: product.slug, website_colour: colour, ...(size ? { website_size: size } : {}) } },
      custom_text: { submit: { message: `Your selection: ${colour === 'white' ? 'White' : 'Black'}${size ? ', size ' + size + '. Please check the size guide before paying.' : '.'}` }, shipping_address: { message: country === 'US' ? 'Your delivery charge includes US import duty.' : country === 'GB' ? 'UK tracked delivery is included.' : 'Local import taxes or duties may be payable on delivery.' } },
    }, { idempotencyKey: `tote-v3-${product.slug}-${colour}-${size || 'one-size'}-${country}-${quantity}-${requestId}` });
    if (!session.url || !session.livemode) throw new Error('Live checkout is unavailable.');
    return Response.json({ url: session.url });
  } catch {
    return Response.json({ message: 'Checkout could not open. Please try again.' }, { status: 502 });
  }
}
