'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useBasket } from './BasketProvider';
import { basketKey, basketSubtotal, basketDelivery, money, productKind } from '@/lib/basket';
import { getToteProduct, productImagePrefix, SHOP_COUNTRIES, MAX_TOTE_QUANTITY } from '@/lib/shop';
const names = new Intl.DisplayNames(['en-GB'], { type: 'region' });
const countries = SHOP_COUNTRIES.map(code => ({ code, name: names.of(code) || code })).sort((a, b) => a.code === 'GB' ? -1 : b.code === 'GB' ? 1 : a.name.localeCompare(b.name));
export default function BasketPage() {
  const { items, ready, update } = useBasket();
  const [country, setCountry] = useState('GB'); const [email, setEmail] = useState(''); const [pending, setPending] = useState(false); const [error, setError] = useState('');
  const requestId = useRef('');
  const count = items.reduce((total, item) => total + item.quantity, 0);
  const quote = basketDelivery(country, items); const subtotal = basketSubtotal(items);
  const hasHoodie = items.some(item => getToteProduct(item.slug)?.kind === 'hoodie');
  async function checkout(event: React.FormEvent) {
    event.preventDefault(); if (pending) return; setPending(true); setError(''); requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch('/api/shop/basket', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items, country, email, requestId: requestId.current }), signal: AbortSignal.timeout(25000) });
      const result = await response.json();
      if (!response.ok || typeof result.url !== 'string') throw new Error(result.message || 'Checkout could not open.');
      const url = new URL(result.url); if (url.protocol !== 'https:' || url.hostname !== 'checkout.stripe.com') throw new Error('Checkout could not open.');
      window.location.assign(url.href);
    } catch (cause) { setError(cause instanceof Error && cause.name !== 'TimeoutError' ? cause.message : 'Checkout took too long. Your basket is saved. Please try again.'); setPending(false); }
  }
  if (!ready) return <p className="muted" role="status">Opening your basket…</p>;
  if (!items.length) return <section className="basket-empty"><span aria-hidden="true">♡</span><h2>A little room for temptation.</h2><p>Your basket is empty. Let’s fix that.</p><Link className="button-primary" href="/shop">Explore the shop</Link></section>;
  return <div className="basket-layout"><section className="basket-items" aria-label="Basket items"><p className="basket-count">{count} {count === 1 ? 'item' : 'items'} in your basket</p>{items.map(item => {
    const product = getToteProduct(item.slug)!; const key = basketKey(item);
    return <article className="basket-item" key={key}>
      <Link href={'/shop/' + item.slug} tabIndex={-1} aria-hidden="true"><Image src={'/shop/' + productImagePrefix(item.slug, item.colour) + '-detail.webp'} alt="" width={180} height={180}/></Link>
      <div className="basket-item-copy"><p className="shop-card-kind">{productKind(product.kind)}</p><h2><Link href={'/shop/' + item.slug}>{product.name}</Link></h2><p className="muted">{item.colour === 'black' ? 'Black' : 'White'}{item.size ? ' / ' + item.size : ''}</p><div className="basket-item-actions"><label>Quantity<select aria-label={'Quantity for ' + product.name + ' ' + item.colour + (item.size ? ' ' + item.size : '')} value={item.quantity} disabled={pending} onChange={event => { update(key, Number(event.target.value)); requestId.current = ''; setError(''); }}>{Array.from({ length: MAX_TOTE_QUANTITY - count + item.quantity }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}</select></label><button type="button" className="remove-item" aria-label={'Remove ' + product.name + ' ' + item.colour + (item.size ? ' ' + item.size : '')} disabled={pending} onClick={() => { update(key, 0); requestId.current = ''; setError(''); }}>Remove</button></div></div><p className="basket-line-price">{money(product.pricePence * item.quantity)}</p>
    </article>;
  })}<Link href="/shop" className="text-link">Continue shopping</Link><p className="fine-print basket-limit">Up to 6 items per order. For larger orders, <Link href="/contact" className="text-link">get in touch</Link>.</p></section>
    <form className="basket-summary" onSubmit={checkout}><p className="eyebrow">The good part</p><h2>Order summary</h2><label htmlFor="basket-country">Deliver to</label><select id="basket-country" value={country} disabled={pending} onChange={event => { setCountry(event.target.value); requestId.current = ''; setError(''); }}>{countries.map(item => <option key={item.code} value={item.code}>{item.name}</option>)}</select>
      {hasHoodie && <p className="fine-print">Hoodies currently ship to the UK only. Remove the hoodie to order other items internationally.</p>}
      <dl className="tote-measurements"><div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div><div><dt>{country === 'US' ? 'Delivery & US duty' : 'Delivery'}</dt><dd>{quote ? quote.amount ? money(quote.amount) : 'Included' : 'Unavailable'}</dd></div><div className="basket-total"><dt>Total</dt><dd>{quote ? money(subtotal + quote.amount) : 'Choose UK delivery'}</dd></div></dl>
      <label htmlFor="basket-email">Email for your receipt</label><input id="basket-email" type="email" required autoComplete="email" maxLength={254} placeholder="you@example.com" value={email} disabled={pending} onChange={event => { setEmail(event.target.value); requestId.current = ''; }}/><p className="fine-print">Your receipt goes here. No newsletter signup.</p>
      <button type="submit" className="button-primary" disabled={pending || !quote}>{pending ? 'Opening secure checkout…' : 'Checkout securely'}</button><p className="form-message" role="status" data-error={Boolean(error)}>{error}</p><p className="fine-print">Secure payment by Stripe. Made to order in 3 to 5 working days, plus delivery. {country === 'GB' ? 'UK tracked delivery included.' : country === 'US' ? 'US import duty included.' : 'Local import taxes or duties may be payable on arrival.'}</p>{country !== 'GB' && <p className="fine-print">International delivery is calculated per design using the existing product rates and shown before payment.</p>}
    </form>
  </div>;
}
