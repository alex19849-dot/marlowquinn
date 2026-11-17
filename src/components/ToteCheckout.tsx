'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { deliveryQuote, MAX_TOTE_QUANTITY, SHOP_COUNTRIES, TOTE_PRICE_PENCE, TOTE_SLUG } from '@/lib/shop';

const money = (pence: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100);
const names = new Intl.DisplayNames(['en-GB'], { type: 'region' });
const countries = SHOP_COUNTRIES.map(code => ({ code, name: names.of(code) || code })).sort((a, b) => a.code === 'GB' ? -1 : b.code === 'GB' ? 1 : a.name.localeCompare(b.name));

export default function ToteCheckout({ enabled, productSlug = TOTE_SLUG }: { enabled: boolean; productSlug?: string }) {
  const [country, setCountry] = useState('GB');
  const [quantity, setQuantity] = useState(1);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef('');
  const quote = deliveryQuote(country, quantity)!;

  async function checkout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true); setError('');
    requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch('/api/shop/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ country, quantity, productSlug, requestId: requestId.current }), signal: AbortSignal.timeout(25000) });
      const result = await response.json();
      if (!response.ok || typeof result.url !== 'string') throw new Error(result.message || 'Checkout could not open. Please try again.');
      const url = new URL(result.url);
      if (url.protocol !== 'https:' || url.hostname !== 'checkout.stripe.com') throw new Error('Checkout could not open. Please try again.');
      window.location.assign(url.href);
    } catch (cause) {
      setError(cause instanceof Error && cause.name !== 'TimeoutError' ? cause.message : 'Checkout took too long. Please try again.');
      setPending(false);
    }
  }

  if (!enabled) return <div className="shop-launch"><span className="shop-status">Coming soon</span><p>£19.99 with UK tracked delivery included. International delivery will be calculated at checkout.</p><Link href="/newsletter" className="button-primary">Keep me in the loop</Link></div>;
  return <form className="shop-launch tote-checkout" onSubmit={checkout}>
    <p className="tote-price">£19.99 <span>per tote</span></p>
    <div className="tote-checkout-fields"><div><label htmlFor="tote-country">Deliver to</label><select id="tote-country" value={country} disabled={pending} onChange={event => { setCountry(event.target.value); requestId.current = ''; setError(''); }}>{countries.map(item => <option key={item.code} value={item.code}>{item.name}</option>)}</select></div><div><label htmlFor="tote-quantity">Quantity</label><select id="tote-quantity" value={quantity} disabled={pending} onChange={event => { setQuantity(Number(event.target.value)); requestId.current = ''; setError(''); }}>{Array.from({ length: MAX_TOTE_QUANTITY }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</select></div></div>
    <dl className="tote-measurements" aria-live="polite"><div><dt>{quantity === 1 ? 'Tote' : `${quantity} totes`}</dt><dd>{money(quantity * TOTE_PRICE_PENCE)}</dd></div><div><dt>{country === 'US' ? 'Delivery & US duty' : 'Tracked delivery'}</dt><dd>{quote.amount ? money(quote.amount) : 'Included'}</dd></div><div><dt>Total</dt><dd>{money(quantity * TOTE_PRICE_PENCE + quote.amount)}</dd></div></dl>
    <button type="submit" className="button-primary" disabled={pending}>{pending ? 'Opening secure checkout…' : 'Checkout securely'}</button>
    <p className="form-message" role="status" data-error={Boolean(error)}>{error}</p>
    <p className="fine-print">Made to order in 3 to 5 working days, plus delivery. {country === 'US' ? 'US import duty is included in the delivery charge.' : country !== 'GB' ? 'Local import taxes or duties may be payable on arrival.' : 'UK tracked delivery is included.'}</p>
    <p className="fine-print">For larger orders or another destination, <Link href="/contact" className="text-link">contact us</Link>.</p>
  </form>;
}
