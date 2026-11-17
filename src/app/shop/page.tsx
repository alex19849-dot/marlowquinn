import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { checkoutReady, SHOP_PRODUCTS, hasColourOptions, productImagePrefix } from '@/lib/shop';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'The Bookish Shop',
  description: 'Cheeky organic cotton T-shirts and totes for readers distracted by fictional men and filthy bookshelves. Shop the Marlow Quinn bookish collection.',
  alternates: { canonical: '/shop' },
};
const descriptions = [
  'A perfectly respectable bag for your entirely unrespectable reading list. Ivory and magenta lettering, a shelf of rainbow books and absolutely no explanation owed.',
  'You had things to do. Then he appeared on the page. Ivory, magenta and rainbow lettering for readers whose favourite men live between the covers.',
  'Perfectly polite. Questionable reading material. Your favourite bookshelf confession on a fitted black organic cotton T-shirt, with rainbow books. XS to 3XL.',
  'You had things to do. Then he appeared on the page. Rainbow lettering and a bookish confession on a fitted black organic cotton T-shirt. XS to 3XL.',
  'Five stars. Several penalties. No clean thoughts. A hockey romance confession in raspberry, teal and gold. Black or white.',
  'For the hockey players who live rent-free in your reading list. Fitted organic cotton, black or white, XS to 3XL.',
  'Here for the plot. And the quarterback’s thighs. American football romance, carried with absolutely no shame. Black or white.',
  'A very respectable interest in American football. And thighs. Fitted organic cotton, black or white, XS to 3XL.',
];
export default function ShopPage() {
  return <main id="main-content" className="page-width shop-page">
    <section className="shop-intro">
      <p className="eyebrow">The Marlow Quinn shop</p>
      <h1>Good books.<br/><em>Questionable company.</em></h1>
      <p>For the fictional men you can’t stop thinking about, and the books you probably shouldn’t read in public.</p>
      <a className="text-link" href="#collection">Find your next bookish favourite <span aria-hidden="true">↓</span></a>
    </section>
    <section id="collection" aria-labelledby="collection-heading">
      <div className="section-heading"><div><p className="eyebrow">Pick your kind of trouble</p><h2 id="collection-heading">Wear it. Carry it. Own it.</h2></div></div>
      <div className="shop-collection">{SHOP_PRODUCTS.map((product, index) => {
        const open = checkoutReady(product.slug);
        return <article className="shop-product-card" key={product.slug}>
          <Link className="shop-feature-photo" href={'/shop/'+product.slug} aria-label={'Explore the '+product.name+' '+(product.kind === 'shirt' ? 'T-shirt' : 'tote')}>
            <Image src={'/shop/'+productImagePrefix(product.slug)+'-model.webp'} alt={(product.kind === 'shirt' ? 'Model wearing the black ' : 'Model carrying the black ')+product.name+' organic cotton '+(product.kind === 'shirt' ? 'T-shirt' : 'tote')} width={1157} height={1359} priority={index === 0} sizes="(max-width:767px) calc(100vw - 36px), (max-width:1200px) 45vw, 575px"/>
            <span className="shop-photo-badge">{open ? 'Available now' : 'Coming soon'}</span>
          </Link>
          <div className="shop-product-card-body">
            <p className="eyebrow">{product.kind === 'shirt' ? 'Fitted T-shirt · '+(hasColourOptions(product.slug) ? 'Black or white' : 'Black')+' · XS to 3XL' : 'The bookish tote · '+(hasColourOptions(product.slug) ? 'Black or white' : 'Black')}</p><h3>{product.name}{product.kind === 'shirt' ? ' T-shirt' : hasColourOptions(product.slug) ? ' Tote' : ''}</h3><p>{descriptions[index]}</p>
            <p className="shop-card-price">£{(product.pricePence / 100).toFixed(2)} <span>including UK tracked delivery</span></p>
            <Link href={'/shop/'+product.slug} className="button-primary">{open ? (product.kind === 'shirt' ? 'Shop this T-shirt' : 'Shop this tote') : 'Take a closer look'} <span aria-hidden="true">→</span></Link>
          </div>
        </article>;
      })}</div>
      <p className="fine-print shop-note">Made to order in organic cotton. International delivery is calculated by destination and quantity on each product page.</p>
    </section>
    <section className="shop-next" aria-labelledby="next-heading">
      <div><p className="eyebrow">A little more temptation</p><h2 id="next-heading">Your reading habit.<br/>Soon, on everything.</h2></div>
      <div><p>Totes and T-shirts are here. Cheeky mugs are next, with the same love of books, fictional men and questionable decisions.</p><Link href="/newsletter" className="text-link">Join the reader list for shop news <span aria-hidden="true">→</span></Link></div>
    </section>
  </main>;
}
