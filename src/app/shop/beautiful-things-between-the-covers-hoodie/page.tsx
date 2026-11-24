import type { Metadata } from 'next';
import Link from 'next/link';
import ToteGallery from '@/components/ToteGallery';
import ToteCheckout from '@/components/ToteCheckout';
import { checkoutReady, BUTTERFLY_HOODIE_SLUG, HOODIE_SIZES } from '@/lib/shop';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Beautiful Things Happen Between the Covers Black Hoodie',
  description: 'A black AWDis College Hoodie with an open book, folded book-page butterflies, colourful accents and ivory lettering. XS to 2XL. £39.99 with UK delivery included.',
  alternates: { canonical: '/shop/beautiful-things-between-the-covers-hoodie' },
  openGraph: { images: [{ url: '/shop/butterfly-book-hoodie-detail.webp', width: 1254, height: 1254, alt: 'Book-page butterfly print on a black hoodie' }] },
};
const measurements = [
  { name: 'Half chest', values: [49, 51, 56, 61, 65, 69] },
  { name: 'Body length', values: [64, 67, 70, 73, 76, 79] },
  { name: 'Sleeve length', values: [57.5, 59, 60.5, 62, 63.5, 65] },
];
const chest = [34, 36, 40, 44, 48, 52];
export default function ButterflyHoodiePage() {
  return <main id="main-content" className="page-width page-section">
    <nav aria-label="Breadcrumb" className="shop-breadcrumb"><Link href="/shop">Shop</Link><span aria-hidden="true">/</span><span>Between the Covers Hoodie</span></nav>
    <div className="tote-detail">
      <ToteGallery photos={[
        { src: '/shop/butterfly-book-hoodie-editorial.webp', label: 'The reading chair', alt: 'Black butterfly book hoodie styled on a plum reading chair, showing the complete Beautiful things happen between the covers print', width: 1254, height: 1254 },
        { src: '/shop/butterfly-book-hoodie-detail.webp', label: 'Print close-up', alt: 'Close-up of folded book-page butterflies, an open plum book and ivory Beautiful things happen between the covers lettering on black fleece', width: 1254, height: 1254 },
      ]}/>
      <section className="tote-copy" aria-labelledby="product-heading">
        <p className="eyebrow">Bookish things · Let your imagination take flight</p>
        <h1 id="product-heading">Beautiful things happen<br/><em>between the covers.</em></h1>
        <p className="shop-product-type">The book-page butterfly hoodie · Classic unisex fit</p>
        <p>A little wonder. A little double meaning. A very good reason to read another chapter.</p>
        <p>An open book releases delicate butterflies folded from its pages, with violet, teal, pink and amber accents. Fine shooting-star trails and flowing ivory lettering bring the whole design together on jet black.</p>
        <div className="tote-colour"><span className="tote-swatch" aria-hidden="true"/><span>Colour: <strong>Jet Black</strong></span></div>
        <ToteCheckout enabled={checkoutReady(BUTTERFLY_HOODIE_SLUG)} productSlug={BUTTERFLY_HOODIE_SLUG}/>
        <details className="content-notes" open><summary>The hoodie</summary><ul><li>AWDis College Hoodie, classic unisex shape with a modern fit.</li><li>80% ringspun cotton and 20% polyester.</li><li>280 gsm fabric with a soft cotton face and brushed inner.</li><li>Drop shoulders and a front kangaroo pouch pocket.</li><li>Ribbed cuffs and hem, with twin needle stitching.</li><li>WRAP-certified production.</li></ul></details>
        <details className="content-notes"><summary>The design</summary><p className="muted">“Beautiful things happen between the covers” with our open book, folded book-page butterflies and fine star trails. Front print only, centred above the pocket, approximately 26 cm wide, with the original artwork kept in proportion. The back is plain black. Images are mockups; colour and placement may vary slightly.</p></details>
        <section id="size-guide" className="shirt-size-guide" aria-labelledby="size-guide-heading">
          <h2 id="size-guide-heading">Size guide</h2><p>XS to 2XL. Lay a hoodie you like flat and compare its measurements before choosing. 2XL is the supplier’s XXL size.</p>
          <div className="shirt-measurements-scroll" role="region" aria-label="Hoodie measurements, scroll horizontally on small screens" tabIndex={0}><table className="shirt-measurements"><caption>Garment measurements in centimetres</caption><thead><tr><th scope="col">Measurement</th>{HOODIE_SIZES.map(size => <th scope="col" key={size}>{size}</th>)}</tr></thead><tbody>{measurements.map(row => <tr key={row.name}><th scope="row">{row.name}</th>{row.values.map((value, index) => <td key={index}>{value}</td>)}</tr>)}</tbody></table></div>
          <div className="shirt-measurements-scroll" role="region" aria-label="To fit chest sizes in inches, scroll horizontally on small screens" tabIndex={0}><table className="shirt-measurements"><caption>To fit chest, in inches</caption><thead><tr><th scope="col">Size</th>{HOODIE_SIZES.map(size => <th scope="col" key={size}>{size}</th>)}</tr></thead><tbody><tr><th scope="row">Chest</th>{chest.map(value => <td key={value}>{value}</td>)}</tr></tbody></table></div>
          <p className="fine-print">Half chest is measured flat, not around the body. Garment measurements are approximate and provided as a guide.</p>
        </section>
        <details className="content-notes"><summary>Care & delivery</summary><p className="muted">Wash at 30°C. Do not tumble dry. Do not iron. Colours may look slightly different on your screen.</p><p className="muted">£39.99 with UK tracked delivery included. Made to order in 3 to 5 working days, plus delivery. Currently available for UK delivery. For other destinations, please contact us.</p></details>
      </section>
    </div>
  </main>;
}
