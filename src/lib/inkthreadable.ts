import { createHash } from 'node:crypto';
import type Stripe from 'stripe';
import { getToteProduct, validProductSize, getProductColour, productImagePrefix, hasColourOptions, paidUnitPrice } from './shop';

export function buildSupplierOrder(session: Stripe.Checkout.Session, quantity: number) {
  const product = getToteProduct(session.metadata?.website_slug || '');
  if (!product) throw new Error('Unknown product.');
  const colour = getProductColour(product.slug, session.metadata?.website_colour);
  if (!colour) throw new Error('Invalid product colour.');
  const mug = product.kind === 'mug';
  const hoodie = product.kind === 'hoodie';
  const courier = mug && quantity >= 5 && session.collected_information?.shipping_details?.address?.country !== 'GB';
  const colourCode = colour === 'white' ? 'WHI' : 'BLK';
  const size = session.metadata?.website_size;
  if ((product.kind === 'shirt' || product.kind === 'hoodie') && !validProductSize(product.slug, size)) throw new Error('Invalid shirt size.');
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
    shipping: { shippingMethod: courier ? 'courier' : 'recorded' },
    items: [{
      pn: hoodie ? `JH001-JBK-${size}` : mug ? 'MUG-CER-WHI' : product.kind === 'shirt' ? `STTW079-${colourCode}-${size}` : hasColourOptions(product.slug) ? `STAU773-${colourCode}` : process.env.INKTHREADABLE_TOTE_PN, quantity, retailPrice: (paidUnitPrice(product.slug, session.line_items?.data?.[0]?.price?.id) ?? product.pricePence) / 100, retailCurrency: 'GBP',
      description: hoodie ? `Black AWDis College Hoodie, size ${size}. Front DTG print, centred on chest above kangaroo pocket, 260 mm wide. Preserve supplied artwork and aspect ratio; do not crop. Plain back.` : mug ? '11oz glossy white ceramic mug. Dye sublimation. Print the supplied 200 x 90 mm wrap at its exact size, with the same design on both sides. Do not stretch, crop or enlarge to fill the mug.' : product.kind === 'shirt' ? `${colour === 'white' ? 'White' : 'Black'} Stella Expresser 2.0, size ${size}. Front DTG print, centred, maximum 260 mm wide by 300 mm high. Preserve the artwork aspect ratio.` : 'Front DTG print, centred, 220 mm wide. Preserve the artwork aspect ratio.',
      designs: { front: process.env[product.artEnv] },
      mockups: { front: `https://www.marlowquinn.com/shop/${productImagePrefix(product.slug, colour)}-${mug ? 'model' : 'detail'}.webp` },
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
