'use client';
import Link from 'next/link';
import { useState } from 'react';
import ToteGallery from './ToteGallery';
import ToteCheckout from './ToteCheckout';
import { SPORTS_PRODUCTS, SHIRT_SIZES } from '@/lib/shop';

const measurements = [
  { name: 'Body length', values: [59, 62, 64, 66, 68, 70, 72] },
  { name: 'Half chest', values: [41.5, 44.5, 47.5, 50.5, 53.5, 57.5, 61.5] },
  { name: 'Sleeve length', values: [17, 17.5, 18, 18.5, 19, 20, 20.5] },
];
export default function SportsProduct({ slug, enabled }: { slug: string; enabled: boolean }) {
  const product = SPORTS_PRODUCTS.find(item => item.slug === slug)!;
  const [colour, setColour] = useState<'black' | 'white'>('black');
  const shirt = product.kind === 'shirt';
  const hockey = product.sport === 'hockey';
  const type = shirt ? 'T-shirt' : 'tote';
  const colourName = colour === 'white' ? 'White' : 'Black';
  const prefix = `/shop/${product.imagePrefix}-${colour}`;
  const matching = SPORTS_PRODUCTS.find(item => item.sport === product.sport && item.kind !== product.kind)!;
  return <main id="main-content" className="page-width page-section">
    <nav aria-label="Breadcrumb" className="shop-breadcrumb"><Link href="/shop">Shop</Link><span aria-hidden="true">/</span><span>{hockey ? 'No Clean Thoughts' : 'Quarterback’s Thighs'} {type}</span></nav>
    <div className="tote-detail">
      <ToteGallery key={colour} photos={[
        { src: `${prefix}-model.webp`, label: 'On the model', alt: `Model ${shirt ? 'wearing' : 'carrying'} the ${colour} ${hockey ? 'Five Stars, Several Penalties, No Clean Thoughts hockey' : 'Here for the Plot, And the Quarterback’s Thighs football'} ${type}`, width: shirt ? 1121 : 1157, height: shirt ? 1403 : 1359 },
        { src: `${prefix}-detail.webp`, label: 'Print close-up', alt: `Close-up of the ${hockey ? 'hockey sticks, stars and No Clean Thoughts' : 'American football helmet and Quarterback’s Thighs'} print on the ${colour} cotton ${type}`, width: 1254, height: 1254 },
      ]}/>
      <section className="tote-copy" aria-labelledby="product-heading">
        <p className="eyebrow">Sports romance · {hockey ? 'Hockey' : 'American football'}</p>
        <h1 id="product-heading">{hockey ? <>Five stars.<br/>Several penalties.<br/><em>No clean thoughts.</em></> : <>Here for the plot.<br/>And the quarterback’s <em>thighs.</em></>}</h1>
        <p className="shop-product-type">The bookish {type} · {shirt ? 'Women’s fitted cut · XS to 3XL' : 'Organic cotton'}</p>
        <p>{hockey ? 'Your book rating is respectable. Your thoughts about the players? Less so.' : 'A completely innocent interest in the game. Mostly.'}</p>
        <p>{hockey ? 'Five stars, crossed hockey sticks and a confession for readers who like their rivals competitive and their romance spicy.' : 'For the readers who appreciate a well-developed plot. And a very well-developed quarterback.'} Raspberry, teal and gold lettering with contrasting outlines, on your choice of black or white cotton.</p>
        {!enabled && <p className="muted">Available in black or white.</p>}
        <ToteCheckout enabled={enabled} productSlug={product.slug} colour={colour} onColourChange={setColour}/>
        <details className="content-notes" open><summary>{shirt ? 'The T-shirt' : 'The bag'}</summary>{shirt ? <ul><li>Stanley/Stella Stella Expresser 2.0, women’s fitted cut.</li><li>100% organic ring-spun combed cotton, fabric-washed single jersey.</li><li>Lightweight 155 gsm fabric.</li><li>Set-in sleeves and a 1×1 rib neck collar.</li><li>Self-fabric back neck tape.</li><li>Narrow twin-needle topstitching at the sleeve cuffs and hem.</li></ul> : <ul><li>100% organic ring-spun combed cotton.</li><li>Lightweight 160 gsm fabric in a plain weave.</li><li>Double-folded top edge for strength and a clean finish.</li><li>Long handles with reinforced cross stitching.</li></ul>}</details>
        <details className="content-notes"><summary>The design</summary><p className="muted">{hockey ? '“Five Stars. Several Penalties. No Clean Thoughts.” with five stars, crossed hockey sticks, a heart and a puck.' : '“Here for the Plot. And the Quarterback’s Thighs.” with an American football helmet, ball and heart accents.'} Raspberry, teal and gold with dark plum and ivory outlines. Front print only; the back is plain {colourName.toLowerCase()}. {shirt ? 'Printed within a maximum area of 26 × 30 cm.' : 'Print approximately 22 cm wide, preserving the artwork proportions.'}</p></details>
        {shirt ? <section id="size-guide" className="shirt-size-guide" aria-labelledby="size-guide-heading"><h2 id="size-guide-heading">Size guide</h2><p>XS to 3XL. This is a fitted T-shirt. Lay a T-shirt you like flat and compare its measurements before choosing.</p><div className="shirt-measurements-scroll" role="region" aria-label="T-shirt measurements in centimetres, scroll horizontally on small screens" tabIndex={0}><table className="shirt-measurements"><caption>Garment measurements in centimetres</caption><thead><tr><th scope="col">Measurement</th>{SHIRT_SIZES.map(size => <th scope="col" key={size}>{size}</th>)}</tr></thead><tbody>{measurements.map(row => <tr key={row.name}><th scope="row">{row.name}</th>{row.values.map((value, i) => <td key={i}>{value}</td>)}</tr>)}</tbody></table></div><p className="fine-print">Half chest is measured flat from armpit to armpit, not around the body. Measurements are approximate and provided as a guide.</p></section> : <details className="content-notes"><summary>Size & fit</summary><dl className="tote-measurements"><div><dt>Width</dt><dd>37 cm</dd></div><div><dt>Height</dt><dd>42 cm</dd></div><div><dt>Strap length</dt><dd>65 cm</dd></div></dl><p className="fine-print">One size. Measurements are approximate and provided as a guide.</p></details>}
        <details className="content-notes"><summary>Colour & delivery</summary><p className="muted">{colourName} cotton with raspberry, teal and gold artwork. Product mockups show the design; colours and print placement may vary slightly.</p><p className="muted">£{(product.pricePence / 100).toFixed(2)} per {type} including UK tracked delivery. Made to order in 3 to 5 working days, plus delivery. International delivery varies by destination and quantity.</p>{shirt && <p className="muted">Wash at 30°C. Do not tumble dry or iron the print.</p>}</details>
        <Link className="text-link" href={'/shop/'+matching.slug}>Match it with the {shirt ? 'tote' : 'T-shirt'} <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  </main>;
}
