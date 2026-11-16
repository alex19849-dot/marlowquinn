export const TOTE_SLUG = 'good-manners-filthy-bookshelf';
export const TOTE_PRICE_PENCE = 1999;
export const SHOP_URL = 'https://www.marlowquinn.com';
export const EUROPE_ONE = ['AT', 'DE', 'FR', 'IT', 'NL'];
export const EUROPE_TWO = ['AL','AD','AM','AZ','BE','BA','BG','HR','CY','CZ','DK','EE','FO','FI','GE','GI','GR','GL','HU','IS','IE','KZ','KG','LV','LI','LT','LU','MK','MT','MD','MC','ME','NO','PL','PT','RO','SM','RS','SK','SI','ES','SE','CH','TJ','TR','TM','UA','UZ','VA'];
// Initial launch destinations. Other destinations require a carrier availability check.
export const SHOP_COUNTRIES = ['GB','US','CA', ...EUROPE_ONE, ...EUROPE_TWO, 'AU','NZ','JP','SG','HK','KR','TW','MY','TH','ZA','AE','IL','MX','BR','AR','CL','IN'];

export const MAX_TOTE_QUANTITY = 6;

export function deliveryQuote(country: string, quantity = 1) {
  if (!SHOP_COUNTRIES.includes(country) || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_TOTE_QUANTITY) return null;
  if (country === 'GB') return { amount: 0, label: 'UK tracked delivery included' };
  let postage: number;
  let label: string;
  if (country === 'US') {
    postage = [1038,1614,1614,1897,2345,2394][quantity - 1];
    // Duty applies to the customer's product price plus the delivery charge itself.
    const amount = Math.max(0, Math.ceil(((postage - 288 * quantity) * 1000 + 163 * TOTE_PRICE_PENCE * quantity) / 837));
    return { amount, label: 'US tracked delivery and import duty' };
  }
  if (country === 'CA') { postage = quantity === 1 ? 1031 : 1499; label = 'Canada tracked delivery'; }
  else if (EUROPE_ONE.includes(country)) { postage = quantity === 1 ? 942 : quantity <= 3 ? 1086 : 1327; label = 'Europe tracked delivery'; }
  else if (EUROPE_TWO.includes(country)) { postage = quantity === 1 ? 1084 : quantity <= 3 ? 1303 : 1592; label = 'Europe tracked delivery'; }
  else { postage = quantity === 1 ? 1224 : quantity <= 3 ? 2006 : 3050; label = 'International tracked delivery'; }
  return { amount: Math.max(0, postage - 288 * quantity), label };
}

export function checkoutReady() {
  return process.env.SHOP_CHECKOUT_ENABLED === 'true' && process.env.SHOP_FULFILLMENT_ENABLED === 'true' && Boolean(
    process.env.STRIPE_RESTRICTED_KEY && process.env.STRIPE_WEBHOOK_SECRET &&
    process.env.STRIPE_TOTE_PRICE_ID && process.env.STRIPE_TOTE_PRODUCT_ID &&
    process.env.INKTHREADABLE_APP_ID && process.env.INKTHREADABLE_SECRET &&
    process.env.INKTHREADABLE_TOTE_PN && process.env.INKTHREADABLE_TOTE_ART_URL &&
    process.env.INKTHREADABLE_BRAND && (process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN)
  );
}
