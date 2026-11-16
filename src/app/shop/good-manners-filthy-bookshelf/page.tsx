import type { Metadata } from 'next';
import Link from 'next/link';
import ToteGallery from '@/components/ToteGallery';
import ToteCheckout from '@/components/ToteCheckout';
import { checkoutReady } from '@/lib/shop';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Good Manners, Filthy Bookshelf Tote',
  description: 'A black bookish tote with bold magenta lettering and rainbow books. Shop the first Marlow Quinn organic cotton tote.',
  alternates: { canonical: '/shop/good-manners-filthy-bookshelf' },
  openGraph: {
    title: 'Good Manners. Filthy Bookshelf.',
    description: 'The first Marlow Quinn bookish tote. £19.99 including UK tracked delivery.',
    url: '/shop/good-manners-filthy-bookshelf',
    images: [{ url: '/shop/filthy-bookshelf-detail.webp', width: 1254, height: 1254, alt: 'Good Manners, Filthy Bookshelf black tote' }],
  },
};

export default function TotePage() {
  return <main id="main-content" className="page-width page-section">
    <nav aria-label="Breadcrumb" className="shop-breadcrumb"><Link href="/shop">Shop</Link><span aria-hidden="true">/</span><span>Good Manners, Filthy Bookshelf</span></nav>
    <div className="tote-detail">
      <ToteGallery/>
      <section className="tote-copy" aria-labelledby="product-heading">
        <p className="eyebrow">Bookish things · The first drop</p>
        <h1 id="product-heading">Good manners.<br/><em>Filthy bookshelf.</em></h1>
        <p className="shop-product-type">The bookish tote</p>
        <p>Your manners can be impeccable. Your reading list is another matter entirely.</p>
        <p>A black tote with statement ivory and magenta lettering, a tiny heart and a shelf of rainbow books. For readers who like their stories a little less well-behaved.</p>
        <div className="tote-colour"><span className="tote-swatch" aria-hidden="true"/><span>Colour: <strong>Black</strong></span></div>
        <ToteCheckout enabled={checkoutReady()}/>
        <details className="content-notes"><summary>The design</summary><p className="muted">“Good manners. Filthy bookshelf.” in ivory and magenta, finished with a small heart and six books in rainbow colours.</p></details>
        <details className="content-notes" open><summary>The bag</summary><ul><li>100% organic ring-spun combed cotton.</li><li>Lightweight 160 gsm fabric in a plain weave.</li><li>Double-folded top edge for strength and a clean finish.</li><li>Long handles with reinforced cross stitching.</li></ul></details>
        <details className="content-notes"><summary>Size & fit</summary><dl className="tote-measurements"><div><dt>Width</dt><dd>37 cm</dd></div><div><dt>Height</dt><dd>42 cm</dd></div><div><dt>Strap length</dt><dd>65 cm</dd></div></dl><p className="muted">One size. Measurements are approximate and provided as a guide.</p></details>
        <details className="content-notes"><summary>Colour & delivery</summary><p className="muted">Black with an ivory, magenta and rainbow design. Colours may vary slightly from your screen.</p><p className="muted">£19.99 per tote with UK tracked delivery included. International delivery varies by destination and order size.</p></details>
        <Link href="/books" className="text-link">Find something filthy for your bookshelf <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  </main>;
}
