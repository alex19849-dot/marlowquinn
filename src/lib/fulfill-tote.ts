import { basketFromMetadata, basketDelivery } from './basket';
import type Stripe from 'stripe';
import { deliveryQuote, getToteProduct, validProductSize, getProductColour, paidUnitPrice } from './shop';
import { buildSupplierOrder, submitSupplierOrder } from './inkthreadable';
import { claimOrder, saveOrder } from './shop-orders';

export async function fulfillTote(stripe: Stripe, sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] });
  const basket = basketFromMetadata(session.metadata);
  const product = getToteProduct(session.metadata?.website_slug || '');
  if (!product && !basket) { if (session.metadata?.basket_version) throw new Error('Invalid basket metadata.'); return; }
  if (session.payment_status !== 'paid') return;
  if (!session.livemode) throw new Error('Test payments cannot create supplier orders.');
  const country = session.collected_information?.shipping_details?.address?.country || '';
  const items = session.line_items?.data;
  const item = items?.[0];
  const quantity = item?.quantity || 0;
  if (basket) {
    const quote = basketDelivery(country, basket);
    const expected = new Map<string, { quantity: number; amount: number }>();
    for (const row of basket) {
      const p = getToteProduct(row.slug)!;
      const id = process.env[p.priceEnv];
      if (!id) throw new Error('Missing product price.');
      const group = expected.get(id) || { quantity: 0, amount: 0 };
      group.quantity += row.quantity; group.amount += p.pricePence * row.quantity;
      expected.set(id, group);
    }
    if (!quote || session.currency !== 'gbp' || !items || session.line_items?.has_more || items.length !== expected.size || new Set(items.map(row => row.price?.id)).size !== expected.size || items.some(row => {
      const match = expected.get(row.price?.id || '');
      return !match || row.quantity !== match.quantity || row.amount_total !== match.amount;
    }) || session.amount_total !== Array.from(expected.values()).reduce((total, row) => total + row.amount, 0) + quote.amount || session.total_details?.amount_shipping !== quote.amount) throw new Error('Paid basket details require review.');
  } else {
    const unitPrice = paidUnitPrice(product!.slug, item?.price?.id);
    const quote = deliveryQuote(country, quantity, product!.slug);
    if (!getProductColour(product!.slug, session.metadata?.website_colour) || ((product!.kind === 'shirt' || product!.kind === 'hoodie') && !validProductSize(product!.slug, session.metadata?.website_size)) || session.currency !== 'gbp' || !quote || items?.length !== 1 ||
      unitPrice === null || item?.amount_total !== unitPrice * quantity ||
      session.amount_total !== unitPrice * quantity + quote.amount || session.total_details?.amount_shipping !== quote.amount) throw new Error('Paid order details require review.');
  }
  const order = buildSupplierOrder(session, quantity, basket || undefined);
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
