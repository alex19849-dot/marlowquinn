import type { Metadata } from 'next';
import Link from 'next/link';
import ToteGallery from '@/components/ToteGallery';
import ToteCheckout from '@/components/ToteCheckout';
import { checkoutReady, VAMPIRE_TOTE_PRODUCT } from '@/lib/shop';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Book Boyfriend Bites Tote',
  description: 'A black organic cotton tote for vampire-romance readers. Raspberry lettering, a crimson ribbon and silver-purple fangs, with UK tracked delivery included.',
  alternates: { canonical: '/shop/my-book-boyfriend-bites-tote' },
  openGraph: {
    title: 'My Book Boyfriend Bites',
    description: 'The My Book Boyfriend Bites tote. £19.99 including UK tracked delivery.',
    url: '/shop/my-book-boyfriend-bites-tote',
    images: [{ url: '/shop/vampire-boyfriend-tote-detail.webp', width: 1254, height: 1254, alt: 'My Book Boyfriend Bites black tote' }],
  },
};

export default function VampireTotePage() {
  return <main id="main-content" className="page-width page-section">
    <nav aria-label="Breadcrumb" className="shop-breadcrumb"><Link href="/shop">Shop</Link><span aria-hidden="true">/</span><span>My Book Boyfriend Bites</span></nav>
    <div className="tote-detail">
      <ToteGallery photos={[
        { src: '/shop/vampire-boyfriend-tote-model.webp', label: 'On the model', alt: 'Model carrying the black My Book Boyfriend Bites tote with raspberry lettering, a red ribbon and vampire fangs', width: 1157, height: 1359 },
        { src: '/shop/vampire-boyfriend-tote-detail.webp', label: 'Print close-up', alt: 'Close-up of My book boyfriend bites in raspberry lettering, with a crimson ribbon, silver-purple fangs and red drops on black cotton', width: 1254, height: 1254 },
      ]}/>
      <section className="tote-copy" aria-labelledby="product-heading">
        <p className="eyebrow">Bookish things · Vampire romance</p>
        <h1 id="product-heading">My book boyfriend<br/><em>bites.</em></h1>
        <p className="shop-product-type">The bookish tote</p>
        <p>A dangerous reading habit. Excellent taste in fictional men.</p>
        <p>For the readers who like their romance a little darker and their book boyfriends with fangs. Raspberry lettering, a crimson ribbon and silver-purple vampire fangs on a black organic cotton tote.</p>
        <div className="tote-colour"><span className="tote-swatch" aria-hidden="true"/><span>Colour: <strong>Black</strong></span></div>
        <ToteCheckout enabled={checkoutReady(VAMPIRE_TOTE_PRODUCT.slug)} productSlug={VAMPIRE_TOTE_PRODUCT.slug}/>
        <details className="content-notes"><summary>The design</summary><p className="muted">“My book boyfriend bites.” in raspberry lettering, finished with a crimson ribbon, silver-purple fangs and two red drops. Printed on the front using your selected design.</p></details>
        <details className="content-notes" open><summary>The bag</summary><ul><li>100% organic ring-spun combed cotton.</li><li>Lightweight 160 gsm fabric in a plain weave.</li><li>Double-folded top edge for strength and a clean finish.</li><li>Long handles with reinforced cross stitching.</li></ul></details>
        <details className="content-notes"><summary>Size & fit</summary><dl className="tote-measurements"><div><dt>Width</dt><dd>37 cm</dd></div><div><dt>Height</dt><dd>42 cm</dd></div><div><dt>Strap length</dt><dd>65 cm</dd></div></dl><p className="muted">One size. Measurements are approximate and provided as a guide.</p></details>
        <details className="content-notes"><summary>Colour & delivery</summary><p className="muted">Black with raspberry lettering, a crimson ribbon and silver-purple fang details. Colours may vary slightly from your screen.</p><p className="muted">£19.99 per tote with UK tracked delivery included. International delivery varies by destination and order size.</p></details>
        <Link href="/books" className="text-link">Find something filthy for your bookshelf <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  </main>;
}
