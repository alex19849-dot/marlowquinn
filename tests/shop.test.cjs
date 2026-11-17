const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, mocks = {}) {
  const filename = path.resolve(__dirname, '../', file);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(source, { module, exports: module.exports, process, Request, Response, AbortSignal, URL, Intl, console,
    require(name) { if (name in mocks) return mocks[name]; return require(name); },
  }, { filename });
  return module.exports;
}
const shop = load('src/lib/shop.ts');

test('delivery totals match the approved single-tote quotes', () => {
  for (const [country, amount] of Object.entries({ GB: 0, DE: 654, ES: 796, CA: 743, AU: 936, US: 1286 })) {
    assert.equal(shop.deliveryQuote(country, 1).amount, amount);
  }
  for (const quantity of [0, -1, 1.5, 7, '1', NaN]) assert.equal(shop.deliveryQuote('GB', quantity), null);
  assert.equal(shop.deliveryQuote('XX', 1), null);
});

test('US delivery covers postage and duty on the entire customer total', () => {
  const postage = [1038, 1614, 1614, 1897, 2345, 2394];
  for (let q = 1; q <= 6; q++) {
    const fee = shop.deliveryQuote('US', q).amount;
    const duty = (1999 * q + fee) * 0.163;
    assert.ok(fee + 288 * q >= postage[q - 1] + duty);
    assert.ok(fee + 288 * q < postage[q - 1] + duty + 1);
  }
});

function fixture(overrides = {}) {
  return { id: 'cs_live_example', livemode: true, payment_status: 'paid', currency: 'gbp',
    metadata: { website_slug: shop.TOTE_SLUG }, amount_total: 1999, total_details: { amount_shipping: 0 },
    collected_information: { shipping_details: { name: 'Test Buyer', address: { line1: '1 Test Road', city: 'Test City', country: 'GB', postal_code: 'PR1 1AA' } } },
    line_items: { data: [{ quantity: 1, amount_total: 1999, price: { id: 'price_expected' } }] }, ...overrides };
}

test('only a verified paid order reaches the supplier, and duplicate notifications do not resend', async () => {
  process.env.STRIPE_TOTE_PRICE_ID = 'price_expected';
  let session = fixture(); let calls = 0; let record;
  const fulfill = load('src/lib/fulfill-tote.ts', {
    './shop': shop,
    './inkthreadable': { buildSupplierOrder: s => s, submitSupplierOrder: async () => { calls++; return '123'; } },
    './shop-orders': {
      claimOrder: async () => record ? { acquired: false, record } : { acquired: true, record: { sessionId: session.id, state: 'submitting' }, etag: 'one' },
      saveOrder: async value => { record = value; },
    },
  }).fulfillTote;
  const stripe = { checkout: { sessions: { retrieve: async () => session } } };
  session = fixture({ payment_status: 'unpaid' }); await fulfill(stripe, session.id); assert.equal(calls, 0);
  session = fixture({ livemode: false }); await assert.rejects(fulfill(stripe, session.id)); assert.equal(calls, 0);
  session = fixture({ amount_total: 1 }); await assert.rejects(fulfill(stripe, session.id)); assert.equal(calls, 0);
  session = fixture(); await fulfill(stripe, session.id); await fulfill(stripe, session.id);
  assert.equal(calls, 1); assert.equal(record.state, 'submitted');
});

test('an ambiguous supplier timeout is held for review and never automatically resubmitted', async () => {
  process.env.STRIPE_TOTE_PRICE_ID = 'price_expected';
  let calls = 0; let record;
  const fulfill = load('src/lib/fulfill-tote.ts', {
    './shop': shop,
    './inkthreadable': { buildSupplierOrder: s => s, submitSupplierOrder: async () => { calls++; throw new Error('timeout after submission'); } },
    './shop-orders': {
      claimOrder: async () => record ? { acquired: false, record } : { acquired: true, record: { sessionId: 'cs_live_example', state: 'submitting' }, etag: 'one' },
      saveOrder: async value => { record = value; },
    },
  }).fulfillTote;
  const stripe = { checkout: { sessions: { retrieve: async () => fixture() } } };
  await assert.rejects(fulfill(stripe, 'cs_live_example'));
  await assert.rejects(fulfill(stripe, 'cs_live_example'));
  assert.equal(calls, 1); assert.equal(record.state, 'review');
});

test('addresses in countries without postcodes remain valid supplier orders', () => {
  const { buildSupplierOrder } = load('src/lib/inkthreadable.ts', { './shop': shop });
  const session = fixture(); session.collected_information.shipping_details.address = { line1: '1 Test Road', city: 'Hong Kong', country: 'HK' };
  assert.equal(buildSupplierOrder(session, 1).shipping_address.postcode, '');
});

test('the selected tote uses its own price and artwork, and a swapped price cannot be fulfilled', async () => {
  process.env.STRIPE_TOTE_PRICE_ID = 'price_original';
  process.env.STRIPE_FICTIONAL_MEN_PRICE_ID = 'price_fictional';
  process.env.INKTHREADABLE_TOTE_ART_URL = 'https://example.com/original.png';
  process.env.INKTHREADABLE_FICTIONAL_MEN_ART_URL = 'https://example.com/fictional.png';
  const supplier = load('src/lib/inkthreadable.ts', { './shop': shop });
  let session = fixture({ metadata: { website_slug: shop.FICTIONAL_MEN_SLUG }, line_items: { data: [{ quantity: 1, amount_total: 1999, price: { id: 'price_original' } }] } });
  const submitted = [];
  const fulfill = load('src/lib/fulfill-tote.ts', {
    './shop': shop,
    './inkthreadable': { ...supplier, submitSupplierOrder: async order => { submitted.push(order); return '456'; } },
    './shop-orders': { claimOrder: async () => ({ acquired: true, record: { sessionId: session.id, state: 'submitting' }, etag: 'one' }), saveOrder: async () => {} },
  }).fulfillTote;
  const stripe = { checkout: { sessions: { retrieve: async () => session } } };
  await assert.rejects(fulfill(stripe, session.id)); assert.equal(submitted.length, 0);
  session.line_items.data[0].price.id = 'price_fictional';
  await fulfill(stripe, session.id);
  assert.equal(submitted[0].items[0].designs[0].src, 'https://example.com/fictional.png');
  assert.ok(submitted[0].items[0].mockups[0].src.endsWith('fictional-men-detail.webp'));
  const original = fixture(); original.metadata.website_slug = shop.TOTE_SLUG;
  assert.equal(supplier.buildSupplierOrder(original, 1).items[0].designs[0].src, 'https://example.com/original.png');
  assert.equal(shop.getToteProduct('unrecognised-tote'), undefined);
});

test('the webhook rejects forged notifications and accepts only signed live shop events', async () => {
  const Stripe = require('stripe');
  const stripe = new Stripe('rk_live_fixture');
  const secret = 'whsec_local_test_fixture';
  process.env.STRIPE_RESTRICTED_KEY = 'rk_live_fixture';
  process.env.STRIPE_WEBHOOK_SECRET = secret;
  process.env.SHOP_FULFILLMENT_ENABLED = 'true';
  let calls = 0;
  const { POST } = load('src/app/api/shop/webhook/route.ts', {
    '@/lib/stripe': { stripeClient: () => stripe },
    '@/lib/shop': shop,
    '@/lib/fulfill-tote': { fulfillTote: async () => { calls++; } },
  });
  const request = (payload, signature) => new Request('https://www.marlowquinn.com/api/shop/webhook', {
    method: 'POST', headers: signature ? { 'stripe-signature': signature } : {}, body: payload,
  });
  const payload = JSON.stringify({ id: 'evt_fixture', object: 'event', type: 'checkout.session.completed', livemode: true,
    data: { object: { id: 'cs_live_fixture', metadata: { website_slug: shop.TOTE_SLUG } } } });
  const signature = stripe.webhooks.generateTestHeaderString({ payload, secret });
  assert.equal((await POST(request(payload))).status, 400);
  assert.equal((await POST(request(payload, 't=1,v1=forged'))).status, 400);
  assert.equal((await POST(request(payload.replace('cs_live_fixture', 'cs_live_tampered'), signature))).status, 400);
  assert.equal(calls, 0);
  assert.equal((await POST(request(payload, signature))).status, 200); assert.equal(calls, 1);
  const testPayload = payload.replace('"livemode":true', '"livemode":false');
  const testSignature = stripe.webhooks.generateTestHeaderString({ payload: testPayload, secret });
  assert.equal((await POST(request(testPayload, testSignature))).status, 400); assert.equal(calls, 1);
  process.env.SHOP_FULFILLMENT_ENABLED = 'false';
  assert.equal((await POST(request(payload, signature))).status, 503); assert.equal(calls, 1);
  const unrelated = payload.replace(shop.TOTE_SLUG, 'unrelated-product');
  assert.equal((await POST(request(unrelated, stripe.webhooks.generateTestHeaderString({ payload: unrelated, secret })))).status, 200);
  assert.equal(calls, 1);
});
