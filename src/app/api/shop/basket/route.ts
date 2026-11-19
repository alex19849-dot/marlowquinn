import { createHash } from 'node:crypto';
import type Stripe from 'stripe';
import { normaliseBasket, basketDelivery, basketMetadata, productKind } from '@/lib/basket';
import { checkoutReady, getToteProduct, SHOP_URL } from '@/lib/shop';
import { stripeClient } from '@/lib/stripe';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (request.headers.get('origin') !== SHOP_URL) return Response.json({ message: 'Please use the checkout on our website.' }, { status: 403 });
  try {
    const text = await request.text();
    if (text.length > 4096) return Response.json({ message: 'Please check your basket.' }, { status: 400 });
    let body;
    try { body = JSON.parse(text); } catch { return Response.json({ message: 'Please check your basket.' }, { status: 400 }); }
    const items = normaliseBasket(body?.items);
    if (!items) return Response.json({ message: 'Please check your items, sizes and quantities. Baskets can contain up to 6 items.' }, { status: 400 });
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ message: 'Please enter an email address for your receipt.' }, { status: 400 });
    if (items.some(item => !checkoutReady(item.slug))) return Response.json({ message: 'An item is currently unavailable. Please contact us.' }, { status: 503 });
    const country = typeof body.country === 'string' ? body.country : '';
    const quote = basketDelivery(country, items);
    if (!quote || typeof body.requestId !== 'string' || !/^[0-9a-f-]{36}$/.test(body.requestId)) return Response.json({ message: 'Please choose a supported delivery country. Hoodies currently ship to the UK only.' }, { status: 400 });
    const quantities = new Map<string, number>();
    for (const item of items) quantities.set(item.slug, (quantities.get(item.slug) || 0) + item.quantity);
    const metadata = { ...basketMetadata(items), delivery_country: country };
    const description = items.map(item => `${item.quantity} x ${getToteProduct(item.slug)!.name} (${productKind(getToteProduct(item.slug)!.kind)}, ${item.colour}${item.size ? ', ' + item.size : ''})`).join('; ');
    const digest = createHash('sha256').update(JSON.stringify({ items, country, email })).digest('hex').slice(0, 32);
    const session = await stripeClient().checkout.sessions.create({
      mode: 'payment', customer_email: email, integration_identifier: 'marlow_tote_rqnvkzht', adaptive_pricing: { enabled: false },
      line_items: Array.from(quantities, ([slug, quantity]) => ({ price: process.env[getToteProduct(slug)!.priceEnv]!, quantity })),
      shipping_address_collection: { allowed_countries: [country as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry] },
      shipping_options: [{ shipping_rate_data: { type: 'fixed_amount', display_name: quote.label, fixed_amount: { amount: quote.amount, currency: 'gbp' } } }],
      automatic_tax: { enabled: false }, metadata,
      payment_intent_data: { receipt_email: email, description: description.slice(0, 1000), metadata },
      success_url: `${SHOP_URL}/shop/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SHOP_URL}/shop/basket`,
      custom_text: { submit: { message: 'Your sizes and colours: ' + items.map(item => `${productKind(getToteProduct(item.slug)!.kind)} ${item.colour}${item.size ? ' ' + item.size : ''} x${item.quantity}`).join('; ') }, shipping_address: { message: country === 'GB' ? 'UK tracked delivery is included.' : country === 'US' ? 'US import duty is included in your delivery charge.' : 'Local import taxes or duties may be payable on arrival.' } },
    }, { idempotencyKey: `basket-v1-${digest}-${body.requestId}` });
    if (!session.url || !session.livemode) throw new Error('Live checkout is unavailable.');
    return Response.json({ url: session.url });
  } catch { return Response.json({ message: 'Checkout could not open. Your basket is saved. Please try again.' }, { status: 502 }); }
}
