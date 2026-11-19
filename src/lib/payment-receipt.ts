import { basketFromMetadata } from './basket';
import type Stripe from 'stripe';
import { getToteProduct } from './shop';

// The opaque Checkout ID is a bearer reference. Never accept a recipient override.
export async function emailPaymentReceipt(stripe: Stripe, sessionId: string) {
  if (!/^cs_live_[a-zA-Z0-9]+$/.test(sessionId)) throw new Error('Invalid payment reference.');
  const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent.latest_charge'] });
  const product = getToteProduct(session.metadata?.website_slug || '');
  const email = session.customer_details?.email;
  const intent = typeof session.payment_intent === 'object' ? session.payment_intent : null;
  const charge = typeof intent?.latest_charge === 'object' ? intent.latest_charge : null;
  if ((!product && !basketFromMetadata(session.metadata)) || !email || !session.livemode || session.payment_status !== 'paid' || intent?.status !== 'succeeded' || !charge?.paid || !charge.livemode || charge.amount !== session.amount_total || charge.currency !== session.currency) throw new Error('A successful shop payment could not be verified.');
  if (!charge.receipt_email) {
    await stripe.charges.update(charge.id, { receipt_email: email }, { idempotencyKey: `shop-receipt-${session.id}` });
  } else if (charge.receipt_email.toLowerCase() !== email.toLowerCase()) {
    throw new Error('The receipt recipient needs review.');
  }
  return { receiptUrl: charge.receipt_url };
}
