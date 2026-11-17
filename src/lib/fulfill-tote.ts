import type Stripe from 'stripe';
import { deliveryQuote, getToteProduct, TOTE_PRICE_PENCE } from './shop';
import { buildSupplierOrder, submitSupplierOrder } from './inkthreadable';
import { claimOrder, saveOrder } from './shop-orders';

export async function fulfillTote(stripe: Stripe, sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] });
  const product = getToteProduct(session.metadata?.website_slug || '');
  if (!product) return;
  if (session.payment_status !== 'paid') return;
  if (!session.livemode) throw new Error('Test payments cannot create supplier orders.');
  const country = session.collected_information?.shipping_details?.address?.country || '';
  const items = session.line_items?.data;
  const item = items?.[0];
  const quantity = item?.quantity || 0;
  const quote = deliveryQuote(country, quantity);
  if (session.currency !== 'gbp' || !quote || items?.length !== 1 ||
    !process.env[product.priceEnv] || item?.price?.id !== process.env[product.priceEnv] || item?.amount_total !== TOTE_PRICE_PENCE * quantity ||
    session.amount_total !== TOTE_PRICE_PENCE * quantity + quote.amount || session.total_details?.amount_shipping !== quote.amount) {
    throw new Error('Paid order details require review.');
  }
  const order = buildSupplierOrder(session, quantity);
  const claim = await claimOrder(sessionId);
  if (!claim.acquired) {
    if (claim.record.state === 'submitted') return;
    // Keep Stripe retrying and alerting on an unresolved order, without resubmitting it.
    throw new Error('An earlier supplier submission requires review.');
  }
  try {
    const supplierOrderId = await submitSupplierOrder(order);
    await saveOrder({ ...claim.record, state: 'submitted', supplierOrderId }, claim.etag);
  } catch {
    await saveOrder({ ...claim.record, state: 'review' }, claim.etag);
    throw new Error('Supplier confirmation requires review.');
  }
}
