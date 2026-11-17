import type { Metadata } from 'next';
import Link from 'next/link';
import ToteGallery from '@/components/ToteGallery';
import ToteCheckout from '@/components/ToteCheckout';
import { checkoutReady, SHIRT_SLUG, SHIRT_SIZES } from '@/lib/shop';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Good Manners, Filthy Bookshelf T-Shirt',
  description: 'A black fitted organic cotton T-shirt with ivory and magenta lettering and rainbow books. Sizes XS to 3XL. £24.99 including UK tracked delivery.',
  alternates: { canonical: '/shop/good-manners-filthy-bookshelf-t-shirt' },
  openGraph: { title: 'Good Manners. Filthy Bookshelf. T-Shirt', description: 'Wear your reading habits. £24.99 including UK tracked delivery.', url: '/shop/good-manners-filthy-bookshelf-t-shirt', images: [{ url: '/shop/good-manners-shirt-detail.webp', width: 1254, height: 1254, alt: 'Good Manners, Filthy Bookshelf black T-shirt with rainbow books' }] },
};
const measurements = [
  { name: 'Body length', values: [59, 62, 64, 66, 68, 70, 72] },
  { name: 'Half chest', values: [41.5, 44.5, 47.5, 50.5, 53.5, 57.5, 61.5] },
  { name: 'Sleeve length', values: [17, 17.5, 18, 18.5, 19, 20, 20.5] },
];
export default function GoodMannersShirtPage() {
  return <main id="main-content" className="page-width page-section">
    <nav aria-label="Breadcrumb" className="shop-breadcrumb"><Link href="/shop">Shop</Link><span aria-hidden="true">/</span><span>Good Manners, Filthy Bookshelf T-shirt</span></nav>
    <div className="tote-detail">
      <ToteGallery photos={[
        { src: '/shop/good-manners-shirt-model.webp', label: 'On the model', alt: 'Model wearing the black fitted Good Manners, Filthy Bookshelf T-shirt with ivory and magenta lettering and rainbow books', width: 1121, height: 1403 },
        { src: '/shop/good-manners-shirt-detail.webp', label: 'Print close-up', alt: 'Close-up of the Good Manners, Filthy Bookshelf print and six rainbow books on black cotton', width: 1254, height: 1254 },
      ]}/>
      <section className="tote-copy" aria-labelledby="product-heading">
        <p className="eyebrow">Bookish things · Wear your reading habits</p>
        <h1 id="product-heading">Good manners.<br/><em>Filthy bookshelf.</em></h1>
        <p className="shop-product-type">The bookish T-shirt · Women’s fitted cut</p>
        <p>Perfectly polite. Questionable reading material.</p>
        <p>Your favourite bookshelf confession, now on a soft black organic cotton T-shirt. Ivory and magenta lettering, a little heart and a row of rainbow books. Good taste in books was never the problem.</p>
        <div className="tote-colour"><span className="tote-swatch" aria-hidden="true"/><span>Colour: <strong>Black</strong></span></div>
        <ToteCheckout enabled={checkoutReady(SHIRT_SLUG)} productSlug={SHIRT_SLUG}/>
        <details className="content-notes" open><summary>The T-shirt</summary><ul><li>Stanley/Stella Stella Expresser 2.0, women’s fitted cut.</li><li>100% organic ring-spun combed cotton, fabric-washed single jersey.</li><li>Lightweight 155 gsm fabric.</li><li>Set-in sleeves and a 1×1 rib neck collar.</li><li>Self-fabric back neck tape.</li><li>Narrow twin-needle topstitching at the sleeve cuffs and hem.</li></ul></details>
        <details className="content-notes"><summary>The design</summary><p className="muted">“Good Manners. Filthy Bookshelf.” in ivory and magenta, with an ivory heart and six rainbow books. Front print only, within a maximum print area of 26 × 30 cm. The back is plain black.</p></details>
        <section id="size-guide" className="shirt-size-guide" aria-labelledby="size-guide-heading">
          <h2 id="size-guide-heading">Size guide</h2><p>XS to 3XL. This is a fitted T-shirt. Lay a T-shirt you like flat and compare its measurements before choosing.</p>
          <div className="shirt-measurements-scroll" role="region" aria-label="T-shirt measurements in centimetres, scroll horizontally on small screens" tabIndex={0}><table className="shirt-measurements"><caption>Garment measurements in centimetres</caption><thead><tr><th scope="col">Measurement</th>{SHIRT_SIZES.map(size => <th scope="col" key={size}>{size}</th>)}</tr></thead><tbody>{measurements.map(row => <tr key={row.name}><th scope="row">{row.name}</th>{row.values.map((value, index) => <td key={index}>{value}</td>)}</tr>)}</tbody></table></div>
          <p className="fine-print">Half chest is measured flat from armpit to armpit, not around the body. All measurements are approximate and provided as a guide.</p>
        </section>
        <details className="content-notes"><summary>Care, colour & delivery</summary><p className="muted">Wash at 30°C. Do not tumble dry or iron the print. Colours and print placement may vary slightly from the mockups and your screen.</p><p className="muted">£24.99 per T-shirt with UK tracked delivery included. Made to order in 3 to 5 working days, plus delivery. International delivery varies by destination and quantity.</p></details>
        <Link href="/shop/good-manners-filthy-bookshelf" className="text-link">Match it with the tote <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  </main>;
}
