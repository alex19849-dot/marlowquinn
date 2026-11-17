import type { Metadata } from 'next';
import Link from 'next/link';
import ToteGallery from '@/components/ToteGallery';
import ToteCheckout from '@/components/ToteCheckout';
import { MUG_PRODUCT, checkoutReady } from '@/lib/shop';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Sweet Romance. Filthy Chapters. Mug',
  description: 'An 11oz glossy white ceramic mug for your favourite brew and your least innocent reading list. Dishwasher and microwave safe. £12.99 including UK tracked delivery.',
  alternates: { canonical: '/shop/sweet-romance-filthy-chapters-mug' },
  openGraph: { title: 'Sweet Romance. Filthy Chapters. Mug', url: '/shop/sweet-romance-filthy-chapters-mug', images: [{ url: '/shop/sweet-romance-mug-model.webp', width: 360, height: 422, alt: 'White ceramic mug with Sweet romance. Filthy chapters. lettering, roses and an open book' }] },
};

export default function RomanceMugPage() {
  return <main id="main-content" className="page-width page-section">
    <nav aria-label="Breadcrumb" className="shop-breadcrumb"><Link href="/shop">Shop</Link><span aria-hidden="true">/</span><span>Sweet Romance mug</span></nav>
    <div className="tote-detail">
      <ToteGallery photos={[
        { src: '/shop/sweet-romance-mug-model.webp', label: 'The mug', alt: 'Glossy white 11oz mug with Sweet romance. Filthy chapters. lettering, burgundy roses and an open book', width: 360, height: 422 },
        { src: '/shop/sweet-romance-mug-detail.webp', label: 'Artwork close-up', alt: 'Artwork close-up: Sweet romance. Filthy chapters. in burgundy and raspberry lettering above roses and an open book', width: 1254, height: 1254 },
      ]}/>
      <section className="tote-copy" aria-labelledby="product-heading">
        <p className="eyebrow">The bookish mug</p>
        <h1 id="product-heading">Sweet romance.<br/><em>Filthy chapters.</em></h1>
        <p className="shop-product-type">Glossy white ceramic · 11oz</p>
        <p>A perfectly innocent cup of tea. Your current chapter? That’s another matter.</p>
        <p>For slow-burn mornings and books that turn the heat up. Burgundy and raspberry lettering, engraved-style roses and an open book, with the same design printed on both sides.</p>
        <ToteCheckout enabled={checkoutReady(MUG_PRODUCT.slug)} productSlug={MUG_PRODUCT.slug} colour="white"/>
        <details className="content-notes" open><summary>The mug</summary><ul><li>11oz ceramic mug.</li><li>Glossy white finish.</li><li>Dishwasher safe.</li><li>Microwave safe.</li></ul></details>
        <details className="content-notes"><summary>Size & dimensions</summary><dl className="tote-measurements"><div><dt>Capacity</dt><dd>11oz</dd></div><div><dt>Height</dt><dd>97 mm</dd></div><div><dt>Diameter</dt><dd>82 mm</dd></div></dl></details>
        <details className="content-notes"><summary>The design</summary><p className="muted">“Sweet romance. Filthy chapters.” in deep burgundy and raspberry, with roses, foliage, a ribbon and an open book. The artwork appears on both sides, so it works whichever hand holds your brew.</p></details>
        <details className="content-notes"><summary>Colour & delivery</summary><p className="muted">White ceramic with a full-colour print. Colour representation is only as accurate as the web design process allows. Mockups are a guide; colours and print placement may vary slightly.</p><p className="muted">£12.99 per mug, including UK tracked delivery. Made to order in 3 to 5 working days, plus delivery. International delivery is calculated by destination and quantity before checkout.</p></details>
        <Link href="/shop" className="text-link">More bookish temptations <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  </main>;
}
