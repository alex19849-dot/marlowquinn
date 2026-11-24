import Link from 'next/link';
import ToteGallery from './ToteGallery';
import ToteCheckout from './ToteCheckout';
import { LITERARY_PRODUCTS, SHIRT_SIZES } from '@/lib/shop';

const measurements = [
  { name: 'Body length', values: [59, 62, 64, 66, 68, 70, 72] },
  { name: 'Half chest', values: [41.5, 44.5, 47.5, 50.5, 53.5, 57.5, 61.5] },
  { name: 'Sleeve length', values: [17, 17.5, 18, 18.5, 19, 20, 20.5] },
];

export default function LiteraryProduct({ slug, enabled }: { slug: string; enabled: boolean }) {
  const product = LITERARY_PRODUCTS.find(item => item.slug === slug)!;
  const shirt = product.kind === 'shirt';
  const butterfly = product.design === 'butterfly';
  const type = shirt ? 'T-shirt' : 'tote';
  const matching = LITERARY_PRODUCTS.find(item => item.design === product.design && item.kind !== product.kind)!;
  const description = butterfly
    ? 'An open book releases delicate butterflies folded from its pages, with violet, teal, pink and amber accents. Fine shooting-star trails and flowing ivory lettering complete the design.'
    : 'A richly detailed moth with book-page wings, raspberry, plum and teal accents, and flowing ivory lettering. A little gothic, a little romantic, and made for your next late-night chapter.';
  return <main id="main-content" className="page-width page-section">
    <nav aria-label="Breadcrumb" className="shop-breadcrumb"><Link href="/shop">Shop</Link><span aria-hidden="true">/</span><span>{butterfly ? 'Between the Covers' : 'Good Books. Bad Intentions.'} {type}</span></nav>
    <div className="tote-detail">
      <ToteGallery photos={[
        { src: `/shop/${product.imagePrefix}-editorial.webp`, label: 'Styled view', alt: `Black ${type} with the ${product.name} ${butterfly ? 'book-page butterfly' : 'literary moth'} design, styled in a reading nook`, width: 1254, height: 1254 },
        { src: `/shop/${product.imagePrefix}-detail.webp`, label: 'Print close-up', alt: `Close-up of the ${product.name} print on black cotton`, width: 1254, height: 1254 },
      ]}/>
      <section className="tote-copy" aria-labelledby="product-heading">
        <p className="eyebrow">Bookish things · {butterfly ? 'Let your imagination take flight' : 'A darker reading habit'}</p>
        <h1 id="product-heading">{butterfly ? <>Beautiful things happen<br/><em>between the covers.</em></> : <>Good books.<br/><em>Bad intentions.</em></>}</h1>
        <p className="shop-product-type">The {butterfly ? 'book-page butterfly' : 'literary moth'} {type} · {shirt ? 'Women’s fitted cut · XS to 3XL' : 'Organic cotton'}</p>
        <p>{butterfly ? 'A little wonder. A little double meaning. A very good reason to read another chapter.' : shirt ? 'Wear your reading habits on your sleeve. Well, your chest.' : 'For carrying good books and questionable intentions.'}</p>
        <p>{description}</p>
        <div className="tote-colour"><span className="tote-swatch" aria-hidden="true"/><span>Colour: <strong>Black</strong></span></div>
        <ToteCheckout enabled={enabled} productSlug={product.slug}/>
        <details className="content-notes" open><summary>{shirt ? 'The T-shirt' : 'The bag'}</summary>{shirt ? <ul><li>Stanley/Stella Stella Expresser 2.0, women’s fitted cut.</li><li>100% organic ring-spun combed cotton, fabric-washed single jersey.</li><li>Lightweight 155 gsm fabric.</li><li>Set-in sleeves and a 1×1 rib neck collar.</li><li>Self-fabric back neck tape.</li><li>Narrow twin-needle topstitching at the sleeve cuffs and hem.</li></ul> : <ul><li>Stanley/Stella Light Tote Bag.</li><li>100% organic ring-spun combed cotton.</li><li>Lightweight 160 gsm fabric in a plain weave.</li><li>Double-folded top edge for strength and a clean finish.</li><li>Long handles with reinforced cross stitching.</li></ul>}</details>
        <details className="content-notes"><summary>The design</summary><p className="muted">{description} Front print only, with a plain black back. {shirt ? 'Printed within a maximum area of 26 × 30 cm, keeping the artwork in proportion.' : 'Print approximately 22 cm wide, keeping the artwork in proportion.'} Images are product mockups; colour and print placement may vary slightly.</p></details>
        {shirt ? <section id="size-guide" className="shirt-size-guide" aria-labelledby="size-guide-heading"><h2 id="size-guide-heading">Size guide</h2><p>XS to 3XL. This is a fitted T-shirt. Lay a T-shirt you like flat and compare its measurements before choosing.</p><div className="shirt-measurements-scroll" role="region" aria-label="T-shirt measurements in centimetres, scroll horizontally on small screens" tabIndex={0}><table className="shirt-measurements"><caption>Garment measurements in centimetres</caption><thead><tr><th scope="col">Measurement</th>{SHIRT_SIZES.map(size => <th scope="col" key={size}>{size}</th>)}</tr></thead><tbody>{measurements.map(row => <tr key={row.name}><th scope="row">{row.name}</th>{row.values.map((value, i) => <td key={i}>{value}</td>)}</tr>)}</tbody></table></div><p className="fine-print">Half chest is measured flat from armpit to armpit, not around the body. Measurements are approximate and provided as a guide.</p></section> : <details className="content-notes"><summary>Size & fit</summary><dl className="tote-measurements"><div><dt>Width</dt><dd>37 cm</dd></div><div><dt>Height</dt><dd>42 cm</dd></div><div><dt>Strap length</dt><dd>65 cm</dd></div></dl><p className="fine-print">One size. Measurements are approximate and provided as a guide.</p></details>}
        <details className="content-notes"><summary>Care & delivery</summary>{shirt && <p className="muted">Wash at 30°C. Do not tumble dry or iron the print.</p>}<p className="muted">£{(product.pricePence / 100).toFixed(2)} per {type}, including UK tracked delivery. Made to order in 3 to 5 working days, plus delivery. International delivery is calculated in your basket.</p></details>
        <p><Link className="text-link" href={'/shop/'+matching.slug}>Match it with the {shirt ? 'tote' : 'T-shirt'}</Link></p>
        <p><Link className="text-link" href={'/shop/'+(butterfly ? 'beautiful-things-between-the-covers-hoodie' : 'good-books-bad-intentions-hoodie')}>Explore the matching hoodie</Link></p>
      </section>
    </div>
  </main>;
}
