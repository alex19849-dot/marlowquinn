import { stripeClient } from '@/lib/stripe';
import { fulfillTote } from '@/lib/fulfill-tote';
import { TOTE_SLUG } from '@/lib/shop';

export const runtime = 'nodejs';
export const maxDuration = 60;
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !process.env.STRIPE_RESTRICTED_KEY) return Response.json({ received: false }, { status: 503 });
  const signature = request.headers.get('stripe-signature');
  if (!signature) return Response.json({ received: false }, { status: 400 });
  const raw = await request.text();
  if (raw.length > 1048576) return Response.json({ received: false }, { status: 413 });
  const stripe = stripeClient();
  let event;
  try { event = stripe.webhooks.constructEvent(raw, signature, secret); }
  catch { return Response.json({ received: false }, { status: 400 }); }
  if (!event.livemode) return Response.json({ received: false }, { status: 400 });
  if (!['checkout.session.completed','checkout.session.async_payment_succeeded','checkout.session.async_payment_failed'].includes(event.type)) return Response.json({ received: true });
  if (event.type === 'checkout.session.async_payment_failed') return Response.json({ received: true });
  const session = event.data.object as { id: string; metadata?: Record<string, string> | null };
  if (session.metadata?.website_slug !== TOTE_SLUG) return Response.json({ received: true });
  if (process.env.SHOP_FULFILLMENT_ENABLED !== 'true') return Response.json({ received: false }, { status: 503 });
  try {
    await fulfillTote(stripe, session.id);
    return Response.json({ received: true });
  } catch {
    // Do not log customer addresses, supplier request URLs, webhook contents or secrets.
    console.error('Shop order requires review; inspect Stripe webhook deliveries and private order records.');
    return Response.json({ received: false }, { status: 503 });
  }
}
