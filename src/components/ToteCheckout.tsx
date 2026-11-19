'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MAX_TOTE_QUANTITY, TOTE_SLUG, getToteProduct, productSizes } from '@/lib/shop';
import { money } from '@/lib/basket';
import { useBasket } from './BasketProvider';

export default function ToteCheckout({ enabled, productSlug = TOTE_SLUG, colour = 'black', onColourChange }: { enabled: boolean; productSlug?: string; colour?: 'black' | 'white'; onColourChange?: (colour: 'black' | 'white') => void }) {
  const product = getToteProduct(productSlug)!;
  const sized = product.kind === 'shirt' || product.kind === 'hoodie';
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [added, setAdded] = useState(false);
  const basket = useBasket();
  function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ok = basket.add({ slug: productSlug, colour: product.kind === 'mug' ? 'white' : colour, ...(sized ? { size } : {}), quantity });
    setAdded(ok); setMessage(ok ? `${quantity === 1 ? 'Item' : 'Items'} added to your basket.` : 'Your basket can hold up to 6 items. Please review it before adding more.');
  }
  if (!enabled) return <div className="shop-launch"><p>This item is temporarily unavailable.</p><Link href="/shop" className="button-secondary">Explore the collection</Link></div>;
  return <form className="shop-launch tote-checkout product-purchase" onSubmit={add}>
    <p className="tote-price">{money(product.pricePence)} <span>UK delivery included</span></p>
    {onColourChange && <fieldset className="colour-picker"><legend>Colour: {colour === 'black' ? 'Black' : 'White'}</legend>{(['black','white'] as const).map(value => <button key={value} type="button" className={'colour-option colour-' + value} aria-label={value === 'black' ? 'Choose black' : 'Choose white'} aria-pressed={colour === value} onClick={() => { onColourChange(value); setAdded(false); setMessage(''); }}><span/>{value === 'black' ? 'Black' : 'White'}</button>)}</fieldset>}
    <div className={'purchase-options' + (sized ? '' : ' one-option')}>
      {sized && <div className="shirt-size-field"><label htmlFor="shirt-size">Size</label><select id="shirt-size" required value={size} onChange={event => { setSize(event.target.value); setAdded(false); setMessage(''); }}><option value="" disabled>Choose your size</option>{productSizes(productSlug).map(value => <option key={value} value={value}>{value}</option>)}</select></div>}
      <div><label htmlFor="tote-quantity">Quantity</label><select id="tote-quantity" value={quantity} onChange={event => { setQuantity(Number(event.target.value)); setAdded(false); setMessage(''); }}>{Array.from({ length: MAX_TOTE_QUANTITY }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</select></div>
    </div>
    {sized && <p className="fit-note"><a className="text-link" href="#size-guide">Size guide</a><span>{product.kind === 'hoodie' ? 'Classic unisex fit' : 'Women’s fitted cut'}</span></p>}
    <button type="submit" className="button-primary" disabled={!basket.ready}>Add to basket</button>
    <p className="form-message" role="status" data-error={Boolean(message && !added)}>{message}</p>
    {added && <div className="added-actions"><Link className="button-secondary" href="/shop/basket">View basket & checkout</Link><Link className="text-link" href="/shop">Keep browsing</Link></div>}
    <div className="purchase-reassurance"><p>Made for you in 3 to 5 working days, plus delivery.</p><p>{product.kind === 'hoodie' ? 'UK delivery only for this hoodie.' : 'International delivery calculated in your basket.'} Pay securely with Stripe.</p></div>
  </form>;
}
