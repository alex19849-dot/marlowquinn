import type { Metadata } from 'next';
import Link from 'next/link';
import ToteGallery from '@/components/ToteGallery';
import ToteCheckout from '@/components/ToteCheckout';
import { PLOT_MUG_PRODUCT, checkoutReady } from '@/lib/shop';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'I Came for the Plot. Stayed for the Men. Mug',
  description: 'An 11oz glossy white ceramic mug for readers who came for the plot and stayed for the fictional men. Rainbow books, plum and raspberry lettering. Dishwasher and microwave safe. £12.99 including UK tracked delivery.',
  alternates: { canonical: '/shop/came-for-the-plot-stayed-for-the-men-mug' },
  openGraph: { title: 'I Came for the Plot. Stayed for the Men. Mug', url: '/shop/came-for-the-plot-stayed-for-the-men-mug', images: [{ url: '/shop/rainbow-plot-mug-model.webp', width: 1254, height: 1254, alt: 'White ceramic mug with I came for the plot. Stayed for the men. lettering and rainbow books' }] },
};

export default function PlotMugPage() {
  return <main id="main-content" className="page-width page-section">
    <nav aria-label="Breadcrumb" className="shop-breadcrumb"><Link href="/shop">Shop</Link><span aria-hidden="true">/</span><span>Stayed for the Men mug</span></nav>
    <div className="tote-detail">
      <ToteGallery photos={[
        { src: '/shop/rainbow-plot-mug-model.webp', label: 'The mug', alt: 'Glossy white 11oz mug with I came for the plot. Stayed for the men. lettering and seven rainbow books', width: 1254, height: 1254 },
        { src: '/shop/rainbow-plot-mug-detail.webp', label: 'Artwork close-up', alt: 'Artwork close-up: I came for the plot. Stayed for the men. in plum and raspberry above rainbow books', width: 1254, height: 1254 },
      ]}/>
      <section className="tote-copy" aria-labelledby="product-heading">
        <p className="eyebrow">The bookish mug</p>
        <h1 id="product-heading">I came for the plot.<br/><em>Stayed for the men.</em></h1>
        <p className="shop-product-type">Glossy white ceramic · 11oz</p>
        <p>A gripping plot. A questionable attachment to fictional men.</p>
        <p>You opened it for the story. You stayed because those men had absolutely no business being that good. Deep plum and raspberry lettering with a shelf of rainbow books, printed on both sides of your new reading companion.</p>
        <ToteCheckout enabled={checkoutReady(PLOT_MUG_PRODUCT.slug)} productSlug={PLOT_MUG_PRODUCT.slug} colour="white"/>
        <details className="content-notes" open><summary>The mug</summary><ul><li>11oz ceramic mug.</li><li>Glossy white finish.</li><li>Dishwasher safe.</li><li>Microwave safe.</li></ul></details>
        <details className="content-notes"><summary>Size & dimensions</summary><dl className="tote-measurements"><div><dt>Capacity</dt><dd>11oz</dd></div><div><dt>Height</dt><dd>97 mm</dd></div><div><dt>Diameter</dt><dd>82 mm</dd></div></dl></details>
        <details className="content-notes"><summary>The design</summary><p className="muted">“I came for the plot. Stayed for the men.” in deep plum and raspberry, above seven books in rainbow colours. The artwork appears on both sides, so it works whichever hand holds your brew.</p></details>
        <details className="content-notes"><summary>Colour & delivery</summary><p className="muted">White ceramic with a full-colour print. Colour representation is only as accurate as the web design process allows. Mockups are a guide; colours and print placement may vary slightly.</p><p className="muted">£12.99 per mug, including UK tracked delivery. Made to order in 3 to 5 working days, plus delivery. International delivery is calculated by destination and quantity before checkout.</p></details>
        <Link href="/shop" className="text-link">More bookish temptations <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  </main>;
}
