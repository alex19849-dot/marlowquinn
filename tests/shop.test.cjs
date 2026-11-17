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


test('shirt fulfilment preserves every size and uses the shirt price and print limits', async () => {
  process.env.STRIPE_GOOD_MANNERS_SHIRT_PRICE_ID = 'price_shirt';
  process.env.INKTHREADABLE_TOTE_ART_URL = 'https://example.com/good-manners.png';
  const supplier = load('src/lib/inkthreadable.ts', { './shop': shop });
  let session; const submitted = [];
  const fulfill = load('src/lib/fulfill-tote.ts', {
    './shop': shop, './inkthreadable': { ...supplier, submitSupplierOrder: async order => { submitted.push(order); return '789'; } },
    './shop-orders': { claimOrder: async () => ({ acquired: true, record: { sessionId: session.id, state: 'submitting' }, etag: 'one' }), saveOrder: async () => {} },
  }).fulfillTote;
  const stripe = { checkout: { sessions: { retrieve: async () => session } } };
  for (const size of shop.SHIRT_SIZES) {
    session = fixture({ metadata: { website_slug: shop.SHIRT_SLUG, website_size: size }, amount_total: 2499,
      line_items: { data: [{ quantity: 1, amount_total: 2499, price: { id: 'price_shirt' } }] } });
    await fulfill(stripe, session.id);
    const item = submitted.at(-1).items[0];
    assert.equal(item.pn, `STTW079-BLK-${size}`); assert.equal(item.retailPrice, 24.99);
    assert.equal(item.designs[0].src, 'https://example.com/good-manners.png');
    assert.match(item.description, /260 mm wide by 300 mm/);
  }
  for (const bad of [undefined, '', '4XL', 'M;other-sku', ['M']]) {
    session.metadata.website_size = bad;
    await assert.rejects(fulfill(stripe, session.id));
  }
  session.metadata.website_size = 'M'; session.line_items.data[0].price.id = 'price_original';
  await assert.rejects(fulfill(stripe, session.id)); assert.equal(submitted.length, 7);
});

test('shirt US delivery covers the shirt-specific duty on the full sale', () => {
  const postage = [1038, 1614, 1614, 1897, 2345, 2394];
  for (let q = 1; q <= 6; q++) {
    const fee = shop.deliveryQuote('US', q, shop.SHIRT_SLUG).amount;
    const duty = (2499 * q + fee) * .265;
    assert.ok(fee + 288 * q >= postage[q - 1] + duty);
    assert.ok(fee + 288 * q < postage[q - 1] + duty + 1);
  }
});

test('checkout requires a valid shirt size and binds size to metadata and idempotency', async () => {
  for (const key of ['STRIPE_RESTRICTED_KEY','STRIPE_WEBHOOK_SECRET','STRIPE_GOOD_MANNERS_SHIRT_PRICE_ID','STRIPE_GOOD_MANNERS_SHIRT_PRODUCT_ID','INKTHREADABLE_APP_ID','INKTHREADABLE_SECRET','INKTHREADABLE_TOTE_ART_URL','INKTHREADABLE_BRAND','BLOB_READ_WRITE_TOKEN']) process.env[key] = 'fixture';
  process.env.SHOP_CHECKOUT_ENABLED = process.env.SHOP_FULFILLMENT_ENABLED = 'true';
  const sessions = [];
  const { POST } = load('src/app/api/shop/checkout/route.ts', {
    '@/lib/shop': shop, '@/lib/stripe': { stripeClient: () => ({ checkout: { sessions: { create: async (params, options) => { sessions.push({params, options}); return { livemode: true, url: 'https://checkout.stripe.com/fixture' }; } } } }) },
  });
  const request = body => new Request(shop.SHOP_URL + '/api/shop/checkout', { method: 'POST', headers: { origin: shop.SHOP_URL }, body: JSON.stringify(body) });
  const body = { productSlug: shop.SHIRT_SLUG, country: 'GB', quantity: 1, requestId: '11111111-1111-1111-1111-111111111111' };
  for (const size of [undefined, '', '4XL', ['M']]) assert.equal((await POST(request({...body, size}))).status, 400);
  for (const size of ['XS','3XL']) {
    assert.equal((await POST(request({...body, size, price: 1}))).status, 200);
    const {params, options} = sessions.at(-1);
    assert.equal(params.metadata.website_size, size);
    assert.equal(params.payment_intent_data.metadata.website_size, size);
    assert.equal(params.line_items[0].price, 'fixture');
    assert.match(params.custom_text.submit.message, new RegExp(size));
    assert.ok(options.idempotencyKey.includes('-'+size+'-'));
  }
  assert.notEqual(sessions[0].options.idempotencyKey, sessions[1].options.idempotencyKey);
});


test('Fictional Men shirt keeps its own payment and print while preserving size', async () => {
  process.env.STRIPE_FICTIONAL_SHIRT_PRICE_ID = 'price_fictional_shirt';
  process.env.INKTHREADABLE_FICTIONAL_MEN_ART_URL = 'https://example.com/fictional-shirt.png';
  const supplier = load('src/lib/inkthreadable.ts', { './shop': shop });
  const session = fixture({ metadata: { website_slug: shop.FICTIONAL_SHIRT_SLUG, website_size: '3XL' }, amount_total: 2499,
    line_items: { data: [{ quantity: 1, amount_total: 2499, price: { id: 'price_good_manners_shirt' } }] } });
  const submitted = [];
  const fulfill = load('src/lib/fulfill-tote.ts', {
    './shop': shop, './inkthreadable': { ...supplier, submitSupplierOrder: async order => { submitted.push(order); return '891'; } },
    './shop-orders': { claimOrder: async () => ({ acquired: true, record: { sessionId: session.id, state: 'submitting' }, etag: 'one' }), saveOrder: async () => {} },
  }).fulfillTote;
  const stripe = { checkout: { sessions: { retrieve: async () => session } } };
  await assert.rejects(fulfill(stripe, session.id)); assert.equal(submitted.length, 0);
  session.line_items.data[0].price.id = 'price_fictional_shirt';
  await fulfill(stripe, session.id);
  assert.equal(submitted[0].items[0].pn, 'STTW079-BLK-3XL');
  assert.equal(submitted[0].items[0].designs[0].src, 'https://example.com/fictional-shirt.png');
  assert.ok(submitted[0].items[0].mockups[0].src.endsWith('fictional-men-shirt-detail.webp'));
  assert.equal(submitted[0].items[0].retailPrice, 24.99);
});

test('sports orders preserve design, colour, garment, size and the matching mockup', async () => {
  const supplier = load('src/lib/inkthreadable.ts', { './shop': shop });
  let session; const submitted = [];
  const fulfill = load('src/lib/fulfill-tote.ts', {
    './shop': shop, './inkthreadable': { ...supplier, submitSupplierOrder: async order => { submitted.push(order); return '991'; } },
    './shop-orders': { claimOrder: async () => ({ acquired: true, record: { sessionId: session.id, state: 'submitting' }, etag: 'one' }), saveOrder: async () => {} },
  }).fulfillTote;
  const stripe = { checkout: { sessions: { retrieve: async () => session } } };
  for (const product of shop.SPORTS_PRODUCTS) {
    process.env[product.priceEnv] = 'price_'+product.slug;
    process.env[product.artEnv] = 'https://example.com/'+product.sport+'.png';
    for (const colour of ['black','white']) for (const size of product.kind === 'shirt' ? shop.SHIRT_SIZES : [undefined]) {
      session = fixture({ metadata: { website_slug: product.slug, website_colour: colour, website_size: size }, amount_total: product.pricePence,
        line_items: { data: [{ quantity: 1, amount_total: product.pricePence, price: { id: process.env[product.priceEnv] } }] } });
      await fulfill(stripe, session.id);
      const item = submitted.at(-1).items[0], code = colour === 'white' ? 'WHI' : 'BLK';
      assert.equal(item.pn, product.kind === 'shirt' ? `STTW079-${code}-${size}` : `STAU773-${code}`);
      assert.equal(item.designs[0].src, 'https://example.com/'+product.sport+'.png');
      assert.ok(item.mockups[0].src.endsWith(product.imagePrefix+'-'+colour+'-detail.webp'));
    }
    const count = submitted.length;
    for (const bad of [undefined, 'natural', 'White', '', ['white'], 'white-SKU']) {
      session.metadata.website_colour = bad;
      await assert.rejects(fulfill(stripe, session.id));
    }
    session.metadata.website_colour = 'black';session.line_items.data[0].price.id = 'price_wrong_design';
    await assert.rejects(fulfill(stripe, session.id));assert.equal(submitted.length, count);
  }
  assert.equal(submitted.length, 32);
  assert.equal(shop.getProductColour(shop.TOTE_SLUG, undefined), 'black');
  assert.equal(shop.getProductColour(shop.SHIRT_SLUG, 'white'), undefined);
});

test('checkout validates sports colours and keeps colour changes in separate sessions', async () => {
  for (const key of ['STRIPE_RESTRICTED_KEY','STRIPE_WEBHOOK_SECRET','INKTHREADABLE_APP_ID','INKTHREADABLE_SECRET','INKTHREADABLE_BRAND','INKTHREADABLE_TOTE_PN','BLOB_READ_WRITE_TOKEN']) process.env[key] = 'fixture';
  process.env.SHOP_CHECKOUT_ENABLED = process.env.SHOP_FULFILLMENT_ENABLED = 'true';
  const sessions=[];
  const { POST } = load('src/app/api/shop/checkout/route.ts', {
    '@/lib/shop': shop, '@/lib/stripe': { stripeClient: () => ({checkout:{sessions:{create:async(params,options)=>{sessions.push({params,options});return{livemode:true,url:'https://checkout.stripe.com/fixture'};}}}}) },
  });
  const request=body=>new Request(shop.SHOP_URL+'/api/shop/checkout',{method:'POST',headers:{origin:shop.SHOP_URL},body:JSON.stringify(body)});
  for(const product of shop.SPORTS_PRODUCTS){
    process.env[product.priceEnv]='price_'+product.slug;process.env[product.productEnv]='prod_fixture';process.env[product.artEnv]='https://example.com/print.png';
    const body={productSlug:product.slug,size:'3XL',country:'GB',quantity:1,requestId:'11111111-1111-1111-1111-111111111111'};
    for(const colour of [undefined,'natural',['white'],'WHITE'])assert.equal((await POST(request({...body,colour}))).status,400);
    const start=sessions.length;
    for(const colour of ['black','white']){
      assert.equal((await POST(request({...body,colour,pn:'attacker-sku',price:1}))).status,200);
      const {params}=sessions.at(-1);assert.equal(params.metadata.website_colour,colour);assert.equal(params.payment_intent_data.metadata.website_colour,colour);
      assert.equal(params.line_items[0].price,'price_'+product.slug);assert.match(params.custom_text.submit.message,new RegExp(colour==='white'?'White':'Black'));
    }
    assert.notEqual(sessions[start].options.idempotencyKey,sessions[start+1].options.idempotencyKey);
  }
});


test('mug delivery uses 150 g bands, its included UK allowance, courier thresholds and ceramic duty', () => {
  const slug = shop.MUG_PRODUCT.slug;
  for (const q of [1, 2, 3, 4, 5, 6]) assert.equal(shop.deliveryQuote('GB', q, slug).amount, 0);
  for (const [country, postage] of Object.entries({
    DE: [1086,1086,1327,1327,2389,2389], ES: [1303,1303,1592,1592,2389,2389],
    CA: [1499,1499,1499,1499,3780,3780], AU: [2006,2006,3050,3050,3780,3780],
  })) for (let q = 1; q <= 6; q++) {
    const quote = shop.deliveryQuote(country, q, slug);
    assert.equal(quote.amount, Math.max(0, postage[q - 1] - 378 * q));
    assert.equal(quote.label.includes('courier'), q >= 5);
  }
  const postage = [1489,1614,1897,2394,3780,3780];
  for (let q = 1; q <= 6; q++) {
    const fee = shop.deliveryQuote('US', q, slug).amount;
    const duty = (1299 * q + fee) * 0.185;
    assert.ok(fee + 378 * q >= postage[q - 1] + duty);
    assert.ok(fee + 378 * q < postage[q - 1] + duty + 1);
  }
});

test('paid mug orders use white ceramic, the two-sided wrap and appropriate carrier; forged selections fail', async () => {
  const product = shop.MUG_PRODUCT;
  process.env[product.priceEnv] = 'price_mug';
  process.env[product.artEnv] = 'https://example.com/mug-wrap.png';
  const supplier = load('src/lib/inkthreadable.ts', { './shop': shop });
  let session; const submitted = [];
  const fulfill = load('src/lib/fulfill-tote.ts', {
    './shop': shop, './inkthreadable': { ...supplier, submitSupplierOrder: async order => { submitted.push(order); return '992'; } },
    './shop-orders': { claimOrder: async () => ({ acquired: true, record: { sessionId: session.id, state: 'submitting' }, etag: 'one' }), saveOrder: async () => {} },
  }).fulfillTote;
  const stripe = { checkout: { sessions: { retrieve: async () => session } } };
  for (const country of ['GB','DE','US']) for (let q = 1; q <= 6; q++) {
    const fee = shop.deliveryQuote(country, q, product.slug).amount;
    session = fixture({ metadata: { website_slug: product.slug, website_colour: 'white' }, amount_total: 1299*q+fee, total_details: { amount_shipping: fee },
      collected_information: { shipping_details: { name: 'Test Buyer', address: { line1: '1 Test Road', city: 'Test City', country } } },
      line_items: { data: [{ quantity: q, amount_total: 1299*q, price: { id: 'price_mug' } }] } });
    await fulfill(stripe, session.id);
    const order = submitted.at(-1), item = order.items[0];
    assert.equal(item.pn, 'MUG-CER-WHI'); assert.equal(item.quantity, q); assert.equal(item.retailPrice, 12.99);
    assert.equal(item.designs[0].src, 'https://example.com/mug-wrap.png'); assert.equal(item.designs[0].title, 'Printing Mug');
    assert.match(item.description, /200 x 90 mm/); assert.match(item.description, /both sides/);
    assert.ok(item.mockups[0].src.endsWith('sweet-romance-mug-model.webp'));
    assert.equal(order.shipping.shippingMethod, country !== 'GB' && q >= 5 ? 'courier' : 'recorded');
  }
  const count = submitted.length;
  for (const colour of [undefined, 'black', '', 'White']) {
    session.metadata.website_colour = colour;
    await assert.rejects(fulfill(stripe, session.id));
  }
  session.metadata.website_colour = 'white'; session.line_items.data[0].price.id = 'price_wrong';
  await assert.rejects(fulfill(stripe, session.id)); assert.equal(submitted.length, count);
});

test('mug checkout charges the fixed mug price and carries white selection through Stripe', async () => {
  for (const key of ['STRIPE_RESTRICTED_KEY','STRIPE_WEBHOOK_SECRET','INKTHREADABLE_APP_ID','INKTHREADABLE_SECRET','INKTHREADABLE_BRAND','BLOB_READ_WRITE_TOKEN']) process.env[key] = 'fixture';
  process.env.SHOP_CHECKOUT_ENABLED = process.env.SHOP_FULFILLMENT_ENABLED = 'true';
  const product = shop.MUG_PRODUCT;
  process.env[product.priceEnv] = 'price_mug'; process.env[product.productEnv] = 'prod_mug'; process.env[product.artEnv] = 'https://example.com/mug.png';
  const sessions = [];
  const { POST } = load('src/app/api/shop/checkout/route.ts', {
    '@/lib/shop': shop, '@/lib/stripe': { stripeClient: () => ({checkout:{sessions:{create:async(params)=>{sessions.push(params);return{livemode:true,url:'https://checkout.stripe.com/fixture'};}}}}) },
  });
  const request = body => new Request(shop.SHOP_URL+'/api/shop/checkout', { method:'POST', headers:{origin:shop.SHOP_URL}, body:JSON.stringify(body) });
  const body = {productSlug:product.slug,country:'GB',quantity:1,colour:'white',requestId:'11111111-1111-1111-1111-111111111111',price:1,pn:'wrong'};
  assert.equal((await POST(request({...body,colour:'black'}))).status,400);
  assert.equal((await POST(request(body))).status,200);
  assert.equal(sessions[0].line_items[0].price,'price_mug');
  assert.equal(sessions[0].metadata.website_colour,'white'); assert.match(sessions[0].custom_text.submit.message,/White/);
  assert.equal(sessions[0].shipping_options[0].shipping_rate_data.fixed_amount.amount,0);
});

test('rainbow mug keeps its own print file, mockup and price when fulfilled', async () => {
  const product = shop.PLOT_MUG_PRODUCT;
  process.env[product.priceEnv] = 'price_plot_mug';
  process.env[product.artEnv] = 'https://example.com/rainbow-plot-mug-wrap.png';
  const supplier = load('src/lib/inkthreadable.ts', { './shop': shop });
  const submitted = [];
  const session = fixture({ metadata: { website_slug: product.slug, website_colour: 'white' }, amount_total: 1299, total_details: { amount_shipping: 0 },
    collected_information: { shipping_details: { name: 'Test Buyer', address: { line1: '1 Test Road', city: 'Test City', country: 'GB' } } },
    line_items: { data: [{ quantity: 1, amount_total: 1299, price: { id: 'price_plot_mug' } }] } });
  const fulfill = load('src/lib/fulfill-tote.ts', {
    './shop': shop, './inkthreadable': { ...supplier, submitSupplierOrder: async order => { submitted.push(order); return '993'; } },
    './shop-orders': { claimOrder: async () => ({ acquired: true, record: { sessionId: session.id, state: 'submitting' }, etag: 'one' }), saveOrder: async () => {} },
  }).fulfillTote;
  const stripe = { checkout: { sessions: { retrieve: async () => session } } };
  await fulfill(stripe, session.id);
  const item = submitted[0].items[0];
  assert.equal(item.pn, 'MUG-CER-WHI');
  assert.equal(item.designs[0].src, 'https://example.com/rainbow-plot-mug-wrap.png');
  assert.ok(item.mockups[0].src.endsWith('rainbow-plot-mug-model.webp'));
  assert.doesNotMatch(item.description, /51778643/);
  session.line_items.data[0].price.id = process.env[shop.MUG_PRODUCT.priceEnv];
  await assert.rejects(fulfill(stripe, session.id));
  assert.equal(submitted.length, 1);
});

test('vampire tote keeps its selected print and price, and rejects a different tote price', async () => {
  const product = shop.VAMPIRE_TOTE_PRODUCT;
  process.env[product.priceEnv] = 'price_vampire_tote';
  process.env[product.artEnv] = 'https://example.com/vampire-boyfriend-tote-print.png';
  const supplier = load('src/lib/inkthreadable.ts', { './shop': shop });
  const submitted = [];
  const session = fixture({ metadata: { website_slug: product.slug, website_colour: 'black' }, amount_total: 1999, total_details: { amount_shipping: 0 },
    collected_information: { shipping_details: { name: 'Test Buyer', address: { line1: '1 Test Road', city: 'Test City', country: 'GB' } } },
    line_items: { data: [{ quantity: 1, amount_total: 1999, price: { id: 'price_vampire_tote' } }] } });
  const fulfill = load('src/lib/fulfill-tote.ts', {
    './shop': shop, './inkthreadable': { ...supplier, submitSupplierOrder: async order => { submitted.push(order); return '994'; } },
    './shop-orders': { claimOrder: async () => ({ acquired: true, record: { sessionId: session.id, state: 'submitting' }, etag: 'one' }), saveOrder: async () => {} },
  }).fulfillTote;
  const stripe = { checkout: { sessions: { retrieve: async () => session } } };
  await fulfill(stripe, session.id);
  const item = submitted[0].items[0];
  assert.equal(item.pn, process.env.INKTHREADABLE_TOTE_PN);
  assert.equal(item.designs[0].src, 'https://example.com/vampire-boyfriend-tote-print.png');
  assert.equal(item.designs[0].title, 'Printing Front - DTG');
  assert.ok(item.mockups[0].src.endsWith('vampire-boyfriend-tote-detail.webp'));
  session.line_items.data[0].price.id = process.env[shop.TOTE_PRODUCTS[0].priceEnv];
  await assert.rejects(fulfill(stripe, session.id));
  assert.equal(submitted.length, 1);
});
