import { deliveryQuote, getToteProduct, getProductColour, validProductSize, MAX_TOTE_QUANTITY } from './shop';

export type BasketItem = { slug: string; colour: 'black' | 'white'; size?: string; quantity: number };
export const basketKey = (item: BasketItem) => `${item.slug}:${item.colour}:${item.size || ''}`;
export function normaliseBasket(value: unknown): BasketItem[] | null {
  if (!Array.isArray(value) || !value.length || value.length > MAX_TOTE_QUANTITY) return null;
  const items: BasketItem[] = [];
  let count = 0;
  for (const raw of value) {
    if (!raw || typeof raw !== 'object') return null;
    const product = getToteProduct(raw.slug);
    const colour = product && getProductColour(product.slug, raw.colour);
    if (!product || !colour || !Number.isInteger(raw.quantity) || raw.quantity < 1) return null;
    const sized = product.kind === 'shirt' || product.kind === 'hoodie';
    if (sized ? !validProductSize(product.slug, raw.size) : raw.size !== undefined) return null;
    count += raw.quantity;
    if (count > MAX_TOTE_QUANTITY) return null;
    const item: BasketItem = { slug: product.slug, colour, ...(sized ? { size: raw.size } : {}), quantity: raw.quantity };
    const existing = items.find(row => basketKey(row) === basketKey(item));
    if (existing) existing.quantity += item.quantity; else items.push(item);
  }
  return items;
}
export function basketSubtotal(items: BasketItem[]) { return items.reduce((total, item) => total + getToteProduct(item.slug)!.pricePence * item.quantity, 0); }
export function basketDelivery(country: string, items: BasketItem[]) {
  if (!normaliseBasket(items)) return null;
  // Combine designs with identical prices, duty and shipping bands. In particular,
  // five mugs require the courier band even when they have different prints.
  const groups = new Map<string, { slug: string; quantity: number }>();
  for (const item of items) {
    const product = getToteProduct(item.slug)!;
    const key = `${product.kind}:${product.pricePence}:${product.usDutyPermille}`;
    const group = groups.get(key) || { slug: item.slug, quantity: 0 };
    group.quantity += item.quantity; groups.set(key, group);
  }
  let amount = 0;
  for (const { slug, quantity } of groups.values()) {
    const quote = deliveryQuote(country, quantity, slug);
    if (!quote) return null;
    amount += quote.amount;
  }
  return { amount, label: country === 'GB' ? 'UK tracked delivery included' : country === 'US' ? 'Tracked delivery and US import duty' : 'International tracked delivery' };
}
export function basketMetadata(items: BasketItem[]): Record<string, string> {
  return { basket_version: '1', basket_count: String(items.length), ...Object.fromEntries(items.map((item, index) => [`basket_${index}`, JSON.stringify(item)])) };
}
export function basketFromMetadata(metadata: Record<string, string> | null | undefined) {
  if (metadata?.basket_version !== '1' || !/^[1-6]$/.test(metadata.basket_count || '')) return null;
  try { return normaliseBasket(Array.from({ length: Number(metadata.basket_count) }, (_, index) => JSON.parse(metadata[`basket_${index}`]))); } catch { return null; }
}
export const money = (pence: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100);
export const productKind = (kind: string) => ({ shirt: 'T-shirt', tote: 'Tote bag', mug: 'Mug', hoodie: 'Hoodie' }[kind] || kind);
