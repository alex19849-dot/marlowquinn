import type { Metadata } from 'next';
import Link from 'next/link';
import ToteGallery from '@/components/ToteGallery';
import ToteCheckout from '@/components/ToteCheckout';
import { checkoutReady, FICTIONAL_MEN_SLUG } from '@/lib/shop';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Easily Distracted by Fictional Men Tote',
  description: 'A black organic cotton tote for readers easily distracted by fictional men. Ivory, magenta and rainbow lettering, with UK tracked delivery included.',
  alternates: { canonical: '/shop/easily-distracted-by-fictional-men' },
  openGraph: {
    title: 'Easily Distracted by Fictional Men',
    description: 'The Easily Distracted by Fictional Men tote. £19.99 including UK tracked delivery.',
    url: '/shop/easily-distracted-by-fictional-men',
    images: [{ url: '/shop/fictional-men-detail.webp', width: 1254, height: 1254, alt: 'Easily Distracted by Fictional Men black tote' }],
  },
};

export default function FictionalMenTotePage() {
  return <main id="main-content" className="page-width page-section">
    <nav aria-label="Breadcrumb" className="shop-breadcrumb"><Link href="/shop">Shop</Link><span aria-hidden="true">/</span><span>Easily Distracted by Fictional Men</span></nav>
    <div className="tote-detail">
      <ToteGallery photos={[
        { src: '/shop/fictional-men-model.webp', label: 'On the model', alt: 'Model carrying the black Easily Distracted by Fictional Men tote with rainbow lettering', width: 1157, height: 1359 },
        { src: '/shop/fictional-men-detail.webp', label: 'Print close-up', alt: 'Close-up of ivory and magenta lettering, rainbow Fictional Men text and an ivory book on a black tote', width: 1254, height: 1254 },
      ]}/>
      <section className="tote-copy" aria-labelledby="product-heading">
        <p className="eyebrow">Bookish things · A familiar distraction</p>
        <h1 id="product-heading">Easily distracted<br/>by <em>fictional men.</em></h1>
        <p className="shop-product-type">The bookish tote</p>
        <p>You had things to do. Then he appeared on the page.</p>
        <p>For the readers whose favourite men live between the covers. Statement ivory and magenta lettering, rainbow stripes and a little bookish temptation, on a black organic cotton tote.</p>
        <div className="tote-colour"><span className="tote-swatch" aria-hidden="true"/><span>Colour: <strong>Black</strong></span></div>
        <ToteCheckout enabled={checkoutReady(FICTIONAL_MEN_SLUG)} productSlug={FICTIONAL_MEN_SLUG}/>
        <details className="content-notes"><summary>The design</summary><p className="muted">“Easily distracted by fictional men” in ivory, magenta and rainbow stripes, finished with an ivory book, a magenta bookmark, a small heart and star accents.</p></details>
        <details className="content-notes" open><summary>The bag</summary><ul><li>100% organic ring-spun combed cotton.</li><li>Lightweight 160 gsm fabric in a plain weave.</li><li>Double-folded top edge for strength and a clean finish.</li><li>Long handles with reinforced cross stitching.</li></ul></details>
        <details className="content-notes"><summary>Size & fit</summary><dl className="tote-measurements"><div><dt>Width</dt><dd>37 cm</dd></div><div><dt>Height</dt><dd>42 cm</dd></div><div><dt>Strap length</dt><dd>65 cm</dd></div></dl><p className="muted">One size. Measurements are approximate and provided as a guide.</p></details>
        <details className="content-notes"><summary>Colour & delivery</summary><p className="muted">Black with ivory and magenta lettering and rainbow-striped Fictional Men text. Colours may vary slightly from your screen.</p><p className="muted">£19.99 per tote with UK tracked delivery included. International delivery varies by destination and order size.</p></details>
        <Link href="/books" className="text-link">Find something filthy for your bookshelf <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  </main>;
}
