import { createHash } from 'node:crypto';
import type Stripe from 'stripe';

export function buildSupplierOrder(session: Stripe.Checkout.Session, quantity: number) {
  const shipping = session.collected_information?.shipping_details;
  const address = shipping?.address;
  if (!shipping?.name || !address?.line1 || !address.country || !address.city) throw new Error('Shipping details are incomplete.');
  const names = shipping.name.trim().split(/\s+/);
  const country = new Intl.DisplayNames(['en'], { type: 'region' }).of(address.country);
  if (!country) throw new Error('Shipping country is invalid.');
  return {
    external_id: session.id,
    brand: process.env.INKTHREADABLE_BRAND,
    buyer_email: session.customer_details?.email || undefined,
    comments: `Marlow Quinn website order ${session.id}`,
    shipping_address: {
      firstName: names.shift(), lastName: names.join(' '),
      address1: address.line1, address2: address.line2 || '', city: address.city,
      county: address.state || '', postcode: address.postal_code || '', country,
      phone1: session.customer_details?.phone || '',
    },
    shipping: { shippingMethod: 'recorded' },
    items: [{
      pn: process.env.INKTHREADABLE_TOTE_PN, quantity, retailPrice: 19.99, retailCurrency: 'GBP',
      description: 'Front DTG print, centred, 220 mm wide. Preserve the artwork aspect ratio.',
      designs: [{ title: 'Printing Front - DTG', src: process.env.INKTHREADABLE_TOTE_ART_URL }],
      mockups: [{ title: 'Printing Front - DTG', src: 'https://www.marlowquinn.com/shop/filthy-bookshelf-detail.webp' }],
    }],
  };
}

export async function submitSupplierOrder(order: ReturnType<typeof buildSupplierOrder>) {
  const appId = process.env.INKTHREADABLE_APP_ID;
  const secret = process.env.INKTHREADABLE_SECRET;
  if (!appId || !secret) throw new Error('Supplier connection is not configured.');
  const body = JSON.stringify(order);
  const signature = createHash('sha1').update(body + secret).digest('hex');
  const url = new URL('https://www.inkthreadable.co.uk/api/orders.php');
  url.searchParams.set('AppId', appId);
  url.searchParams.set('Signature', signature);
  // Never retry a supplier POST automatically: a timeout may still have created the order.
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, signal: AbortSignal.timeout(20000), cache: 'no-store' });
  if (!response.ok) throw new Error('Supplier order needs review.');
  const data = await response.json();
  const result = Array.isArray(data) && data.length === 1 ? data[0] : data;
  const id = result?.order?.id ?? result?.id;
  if (!id || !/^\d+$/.test(String(id))) throw new Error('Supplier confirmation needs review.');
  return String(id);
}
