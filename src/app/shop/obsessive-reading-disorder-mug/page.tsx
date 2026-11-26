import type { Metadata } from 'next';
import Link from 'next/link';
import ToteGallery from '@/components/ToteGallery';
import ToteCheckout from '@/components/ToteCheckout';
import { ORD_MUG_PRODUCT, checkoutReady } from '@/lib/shop';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: "I've Got O.R.D. Mug",
  description: 'An 11oz glossy white ceramic mug for readers who always need one more chapter. Dishwasher and microwave safe. £12.99 including UK tracked delivery.',
  alternates: { canonical: '/shop/obsessive-reading-disorder-mug' },
  openGraph: { title: "I've Got O.R.D. Mug", url: '/shop/obsessive-reading-disorder-mug', images: [{ url: '/shop/photos/ord-mug-model.webp', width: 1254, height: 1254, alt: 'White ceramic mug with I’ve got O.R.D. Obsessive Reading Disorder lettering and an open book' }] },
};

export default function OrdMugPage() {
  return <main id="main-content" className="page-width page-section">
    <nav aria-label="Breadcrumb" className="shop-breadcrumb"><Link href="/shop">Shop</Link><span aria-hidden="true">/</span><span>O.R.D. mug</span></nav>
    <div className="tote-detail">
      <ToteGallery photos={[
        { src: '/shop/photos/ord-mug-model.webp', label: 'The mug', alt: 'Glossy white 11oz mug with I’ve got O.R.D. Obsessive Reading Disorder lettering, black and magenta lettering and an open book', width: 1254, height: 1254 },
        { src: '/shop/photos/ord-mug-detail.webp', label: 'Artwork close-up', alt: 'Artwork close-up: I’ve got O.R.D. Obsessive Reading Disorder in black and magenta lettering above an open book', width: 1254, height: 1254 },
      ]}/>
      <section className="tote-copy" aria-labelledby="product-heading">
        <p className="eyebrow">The bookish mug</p>
        <h1 id="product-heading">I’ve got<br/><em>O.R.D.</em></h1>
        <p className="shop-product-type">Glossy white ceramic · 11oz</p>
        <p>One more chapter. One more brew. Absolutely no intention of putting the book down.</p>
        <p>For the reader whose TBR is growing faster than their self-control. Bold black lettering, magenta flourishes and an open book, with the same design printed on both sides.</p>
        <ToteCheckout enabled={checkoutReady(ORD_MUG_PRODUCT.slug)} productSlug={ORD_MUG_PRODUCT.slug} colour="white"/>
        <details className="content-notes" open><summary>The mug</summary><ul><li>11oz ceramic mug.</li><li>Glossy white finish.</li><li>Dishwasher safe.</li><li>Microwave safe.</li></ul></details>
        <details className="content-notes"><summary>Size & dimensions</summary><dl className="tote-measurements"><div><dt>Capacity</dt><dd>11oz</dd></div><div><dt>Height</dt><dd>97 mm</dd></div><div><dt>Diameter</dt><dd>82 mm</dd></div></dl></details>
        <details className="content-notes"><summary>The design</summary><p className="muted">“I’ve got O.R.D.” above “Obsessive Reading Disorder”, with an open book, a magenta ribbon and fine flourishes. The artwork appears on both sides, so it works whichever hand holds your brew.</p></details>
        <details className="content-notes"><summary>Colour & delivery</summary><p className="muted">White ceramic with a full-colour print. Colour representation is only as accurate as the web design process allows. Mockups are a guide; colours and print placement may vary slightly.</p><p className="muted">£12.99 per mug, including UK tracked delivery. Made to order in 3 to 5 working days, plus delivery. International delivery is calculated by destination and quantity before checkout.</p></details>
        <Link href="/shop" className="text-link">More bookish temptations <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  </main>;
}
