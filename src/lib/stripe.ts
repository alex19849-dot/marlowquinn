import Stripe from 'stripe';

export function stripeClient() {
  const key = process.env.STRIPE_RESTRICTED_KEY;
  if (!key) throw new Error('Payment connection is not configured.');
  return new Stripe(key, { maxNetworkRetries: 2, timeout: 15000 });
}
