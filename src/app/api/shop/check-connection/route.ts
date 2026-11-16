import { createHash, timingSafeEqual } from 'node:crypto';
import { get, put } from '@vercel/blob';
import { stripeClient } from '@/lib/stripe';
import { SHOP_URL, TOTE_PRICE_PENCE } from '@/lib/shop';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Setup-only check. It cannot place supplier orders and switches off when sales open.
export async function POST(request: Request) {
  const expected = process.env.SHOP_SETUP_TOKEN;
  const supplied = request.headers.get('authorization')?.replace(/^Bearer /, '') || '';
  if (process.env.SHOP_CHECKOUT_ENABLED === 'true' || !expected ||
    Buffer.byteLength(supplied) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) {
    return Response.json({ ready: false }, { status: 404 });
  }
  const checks: Record<string, boolean> = {};
  const issues: Record<string, string> = {};
  try {
    const stripe = stripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment', line_items: [{ price: process.env.STRIPE_TOTE_PRICE_ID!, quantity: 1 }],
      success_url: `${SHOP_URL}/shop/thank-you`, cancel_url: `${SHOP_URL}/shop`,
      metadata: { purpose: 'connection-check-no-order' },
    }, { idempotencyKey: `shop-connection-check-${expected.slice(0, 16)}` });
    checks.stripe = session.livemode && session.currency === 'gbp' && session.amount_total === TOTE_PRICE_PENCE;
    if (session.status === 'open') await stripe.checkout.sessions.expire(session.id);
  } catch { checks.stripe = false; }
  try {
    const query = new URLSearchParams({ AppId: process.env.INKTHREADABLE_APP_ID!, format: 'JSON' });
    const signature = createHash('sha1').update(query.toString() + process.env.INKTHREADABLE_SECRET).digest('hex');
    query.set('Signature', signature);
    const response = await fetch(`https://www.inkthreadable.co.uk/api/orders/count.php?${query}`, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
    const data = await response.json();
    const hasCount = typeof data === 'number' || (data && typeof data === 'object' && Object.entries(data).some(([key, value]) => /count|total/i.test(key) && /^\d+$/.test(String(value))));
    checks.inkthreadable = response.ok && Boolean(hasCount) && !data?.error;
    if (!checks.inkthreadable) issues.inkthreadable = `HTTP ${response.status}; fields: ${Object.keys(data || {}).join(',').slice(0, 100)}`;
  } catch { checks.inkthreadable = false; }
  try {
    const path = 'shop-setup/connection-check.json';
    const content = JSON.stringify({ checkedAt: new Date().toISOString() });
    await put(path, content, { access: 'private', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json' });
    const result = await get(path, { access: 'private', useCache: false });
    checks.storage = result?.statusCode === 200 && await new Response(result.stream).text() === content;
  } catch { checks.storage = false; }
  try {
    const response = await fetch(process.env.INKTHREADABLE_TOTE_ART_URL!, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
    checks.artwork = response.ok && response.headers.get('content-type')?.startsWith('image/png') === true;
  } catch { checks.artwork = false; }
  checks.webhook = Boolean(process.env.STRIPE_WEBHOOK_SECRET);
  return Response.json({ ready: Object.values(checks).every(Boolean), checks, issues }, { headers: { 'Cache-Control': 'no-store' } });
}
