import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'The Bookish Shop',
  description: 'Bookish things for readers with good manners and filthy bookshelves. Explore the first Marlow Quinn tote, coming soon.',
  alternates: { canonical: '/shop' },
};

export default function ShopPage() {
  return <main id="main-content" className="page-width shop-page">
    <section className="shop-intro">
      <p className="eyebrow">The Marlow Quinn shop</p>
      <h1>Good books.<br/><em>Questionable company.</em></h1>
      <p>For the fictional men you can’t stop thinking about, and the books you probably shouldn’t read in public.</p>
      <a className="text-link" href="#first-drop">Meet your next book bag <span aria-hidden="true">↓</span></a>
    </section>
    <section id="first-drop" className="shop-feature" aria-labelledby="tote-heading">
      <Link className="shop-feature-photo" href="/shop/good-manners-filthy-bookshelf" aria-label="Explore the Good Manners, Filthy Bookshelf tote">
        <Image src="/shop/filthy-bookshelf-model.webp" alt="Model carrying the black Good Manners, Filthy Bookshelf tote with magenta lettering and rainbow books" width={1157} height={1359} priority sizes="(max-width:767px) calc(100vw - 36px), 55vw"/>
        <span className="shop-photo-badge">The first drop · Coming soon</span>
      </Link>
      <div className="shop-feature-copy">
        <p className="eyebrow">Meet the first of the collection</p>
        <h2 id="tote-heading">Good manners.<br/><em>Filthy bookshelf.</em></h2>
        <p className="shop-product-type">The bookish tote · Black</p>
        <p>A perfectly respectable bag for your entirely unrespectable reading list. Bold magenta lettering, a little rainbow pride and absolutely no explanation owed.</p>
        <Link href="/shop/good-manners-filthy-bookshelf" className="button-primary">Take a closer look <span aria-hidden="true">&nbsp;→</span></Link>
        <p className="fine-print shop-note">Coming soon. Get to know the design before the shop opens.</p>
      </div>
    </section>
    <section className="shop-next" aria-labelledby="next-heading">
      <div><p className="eyebrow">A little more temptation</p><h2 id="next-heading">Your reading habit.<br/>Soon, on everything.</h2></div>
      <div><p>Totes first. Cheeky mugs and T-shirts are in the works, with the same love of books, fictional men and questionable decisions.</p><Link href="/newsletter" className="text-link">Join the reader list for shop news <span aria-hidden="true">→</span></Link></div>
    </section>
  </main>;
}
