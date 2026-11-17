'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { deliveryQuote, MAX_TOTE_QUANTITY, SHOP_COUNTRIES, TOTE_SLUG, getToteProduct, SHIRT_SIZES } from '@/lib/shop';

const money = (pence: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100);
const names = new Intl.DisplayNames(['en-GB'], { type: 'region' });
const countries = SHOP_COUNTRIES.map(code => ({ code, name: names.of(code) || code })).sort((a, b) => a.code === 'GB' ? -1 : b.code === 'GB' ? 1 : a.name.localeCompare(b.name));

export default function ToteCheckout({ enabled, productSlug = TOTE_SLUG, colour = 'black', onColourChange }: { enabled: boolean; productSlug?: string; colour?: 'black' | 'white'; onColourChange?: (colour: 'black' | 'white') => void }) {
  const product = getToteProduct(productSlug)!;
  const shirt = product.kind === 'shirt';
  const [size, setSize] = useState('');
  const [country, setCountry] = useState('GB');
  const [quantity, setQuantity] = useState(1);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef('');
  const quote = deliveryQuote(country, quantity, productSlug)!;

  async function checkout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true); setError('');
    requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch('/api/shop/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ country, quantity, productSlug, colour, size: shirt ? size : undefined, requestId: requestId.current }), signal: AbortSignal.timeout(25000) });
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

  if (!enabled) return <div className="shop-launch"><span className="shop-status">Coming soon</span><p>{money(product.pricePence)} with UK tracked delivery included. International delivery will be calculated at checkout.</p><Link href="/newsletter" className="button-primary">Keep me in the loop</Link></div>;
  return <form className="shop-launch tote-checkout" onSubmit={checkout}>
    {onColourChange && <div className="shirt-size-field"><label htmlFor="product-colour">Colour</label><select id="product-colour" value={colour} disabled={pending} onChange={event => { onColourChange(event.target.value as 'black' | 'white'); requestId.current = ''; setError(''); }}><option value="black">Black</option><option value="white">White</option></select></div>}
    <p className="tote-price">{money(product.pricePence)} <span>per {shirt ? 'T-shirt' : 'tote'}</span></p>
    {shirt && <div className="shirt-size-field"><label htmlFor="shirt-size">Size</label><select id="shirt-size" required value={size} disabled={pending} onChange={event => { setSize(event.target.value); requestId.current = ''; setError(''); }}><option value="" disabled>Choose your size</option>{SHIRT_SIZES.map(value => <option key={value} value={value}>{value}</option>)}</select><a className="text-link" href="#size-guide">Check the size guide</a><p className="fine-print">Women’s fitted cut. Compare the measurements with a T-shirt you already own.</p></div>}
    <div className="tote-checkout-fields"><div><label htmlFor="tote-country">Deliver to</label><select id="tote-country" value={country} disabled={pending} onChange={event => { setCountry(event.target.value); requestId.current = ''; setError(''); }}>{countries.map(item => <option key={item.code} value={item.code}>{item.name}</option>)}</select></div><div><label htmlFor="tote-quantity">Quantity</label><select id="tote-quantity" value={quantity} disabled={pending} onChange={event => { setQuantity(Number(event.target.value)); requestId.current = ''; setError(''); }}>{Array.from({ length: MAX_TOTE_QUANTITY }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</select></div></div>
    <dl className="tote-measurements" aria-live="polite"><div><dt>{shirt ? (quantity === 1 ? 'T-shirt' : `${quantity} T-shirts`) : (quantity === 1 ? 'Tote' : `${quantity} totes`)}</dt><dd>{money(quantity * product.pricePence)}</dd></div><div><dt>{country === 'US' ? 'Delivery & US duty' : 'Tracked delivery'}</dt><dd>{quote.amount ? money(quote.amount) : 'Included'}</dd></div><div><dt>Total</dt><dd>{money(quantity * product.pricePence + quote.amount)}</dd></div></dl>
    <button type="submit" className="button-primary" disabled={pending}>{pending ? 'Opening secure checkout…' : 'Checkout securely'}</button>
    <p className="form-message" role="status" data-error={Boolean(error)}>{error}</p>
    <p className="fine-print">Made to order in 3 to 5 working days, plus delivery. {country === 'US' ? 'US import duty is included in the delivery charge.' : country !== 'GB' ? 'Local import taxes or duties may be payable on arrival.' : 'UK tracked delivery is included.'}</p>
    <p className="fine-print">For larger orders or another destination, <Link href="/contact" className="text-link">contact us</Link>.</p>
  </form>;
}
