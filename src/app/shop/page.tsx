import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { checkoutReady, TOTE_PRODUCTS } from '@/lib/shop';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'The Bookish Shop',
  description: 'Cheeky organic cotton totes for readers distracted by fictional men and filthy bookshelves. Shop the Marlow Quinn bookish collection.',
  alternates: { canonical: '/shop' },
};
const descriptions = [
  'A perfectly respectable bag for your entirely unrespectable reading list. Ivory and magenta lettering, a shelf of rainbow books and absolutely no explanation owed.',
  'You had things to do. Then he appeared on the page. Ivory, magenta and rainbow lettering for readers whose favourite men live between the covers.',
];
export default function ShopPage() {
  return <main id="main-content" className="page-width shop-page">
    <section className="shop-intro">
      <p className="eyebrow">The Marlow Quinn shop</p>
      <h1>Good books.<br/><em>Questionable company.</em></h1>
      <p>For the fictional men you can’t stop thinking about, and the books you probably shouldn’t read in public.</p>
      <a className="text-link" href="#collection">Find your next book bag <span aria-hidden="true">↓</span></a>
    </section>
    <section id="collection" aria-labelledby="collection-heading">
      <div className="section-heading"><div><p className="eyebrow">Pick your kind of trouble</p><h2 id="collection-heading">A little bookish baggage.</h2></div></div>
      <div className="shop-collection">{TOTE_PRODUCTS.map((product, index) => {
        const open = checkoutReady(product.slug);
        return <article className="shop-product-card" key={product.slug}>
          <Link className="shop-feature-photo" href={'/shop/'+product.slug} aria-label={'Explore the '+product.name+' tote'}>
            <Image src={'/shop/'+product.imagePrefix+'-model.webp'} alt={'Model carrying the black '+product.name+' organic cotton tote'} width={1157} height={1359} priority={index === 0} sizes="(max-width:767px) calc(100vw - 36px), (max-width:1200px) 45vw, 575px"/>
            <span className="shop-photo-badge">{open ? 'Available now' : 'Coming soon'}</span>
          </Link>
          <div className="shop-product-card-body">
            <p className="eyebrow">The bookish tote · Black</p><h3>{product.name}</h3><p>{descriptions[index]}</p>
            <p className="shop-card-price">£19.99 <span>including UK tracked delivery</span></p>
            <Link href={'/shop/'+product.slug} className="button-primary">{open ? 'Shop this tote' : 'Take a closer look'} <span aria-hidden="true">→</span></Link>
          </div>
        </article>;
      })}</div>
      <p className="fine-print shop-note">Made to order in organic cotton. International delivery is calculated by destination and quantity on each product page.</p>
    </section>
    <section className="shop-next" aria-labelledby="next-heading">
      <div><p className="eyebrow">A little more temptation</p><h2 id="next-heading">Your reading habit.<br/>Soon, on everything.</h2></div>
      <div><p>Totes first. Cheeky mugs and T-shirts are in the works, with the same love of books, fictional men and questionable decisions.</p><Link href="/newsletter" className="text-link">Join the reader list for shop news <span aria-hidden="true">→</span></Link></div>
    </section>
  </main>;
}
