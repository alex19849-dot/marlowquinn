import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { checkoutReady, SHOP_PRODUCTS, hasColourOptions, productImagePrefix } from '@/lib/shop';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'The Bookish Shop',
  description: 'Browse cheeky bookish mugs, organic cotton totes and T-shirts. Find your next Marlow Quinn favourite, with UK delivery included.',
  alternates: { canonical: '/shop' },
};
const categories = [
  { key: 'all', label: 'Everything' },
  { key: 'mug', label: 'Mugs' },
  { key: 'tote', label: 'Tote bags' },
  { key: 'shirt', label: 'T-shirts' },
  { key: 'hoodie', label: 'Hoodies' },
] as const;
const titles: Record<string, string> = {
  'quarterbacks-thighs-football-tote': 'The Quarterback’s Thighs',
  'quarterbacks-thighs-football-t-shirt': 'The Quarterback’s Thighs',
};
const pageSize = 6;
type Props = { searchParams: Promise<{ category?: string | string[]; page?: string | string[] }> };

export default async function ShopPage({ searchParams }: Props) {
  const query = await searchParams;
  const category = categories.find(item => item.key === query.category) || categories[0];
  // Alternate product types on the main shelf so visitors see the range at a glance.
  const groups = ['hoodie', 'tote', 'shirt', 'mug'].map(kind => SHOP_PRODUCTS.filter(product => product.kind === kind));
  const featured = Array.from({ length: Math.max(...groups.map(group => group.length)) }, (_, index) => groups.flatMap(group => group[index] ? [group[index]] : [])).flat();
  const collection = category.key === 'all' ? featured : SHOP_PRODUCTS.filter(product => product.kind === category.key);
  const pageCount = Math.max(1, Math.ceil(collection.length / pageSize));
  const requestedPage = typeof query.page === 'string' && /^\d{1,6}$/.test(query.page) ? Number(query.page) : 1;
  const page = Math.min(pageCount, Math.max(1, requestedPage));
  const first = (page - 1) * pageSize;
  const products = collection.slice(first, first + pageSize);
  const href = (key: string, number = 1) => `/shop${key === 'all' && number === 1 ? '' : '?' + new URLSearchParams({ ...(key !== 'all' ? { category: key } : {}), ...(number > 1 ? { page: String(number) } : {}) }).toString()}#collection`;

  return <main id="main-content" className="page-width shop-page shop-browse">
    <section className="shop-intro">
      <p className="eyebrow">The Marlow Quinn shop</p>
      <h1>Good books.<br/><em>Questionable company.</em></h1>
      <p>A little something for your reading habit. Find your favourite, wear your confession, or put the kettle on.</p>
      <div className="shop-promises"><span>UK delivery included</span><span>Made to order</span><span>Secure checkout</span></div>
    </section>
    <section id="collection" className="shop-catalogue" aria-labelledby="collection-heading">
      <nav className="shop-categories" aria-label="Shop by product type">
        {categories.map(item => {
          const count = item.key === 'all' ? SHOP_PRODUCTS.length : SHOP_PRODUCTS.filter(product => product.kind === item.key).length;
          return <Link href={href(item.key)} className="shop-category" key={item.key} aria-current={category.key === item.key ? 'page' : undefined}>{item.label}<span>{count}</span></Link>;
        })}
      </nav>
      <div className="shop-catalogue-heading"><div><p className="eyebrow">Pick your kind of trouble</p><h2 id="collection-heading">{category.key === 'all' ? 'The bookish collection' : category.label}</h2></div><p className="shop-product-count">{collection.length > pageSize ? `${first + 1}–${Math.min(first + pageSize, collection.length)} of ${collection.length}` : collection.length} {collection.length === 1 ? 'favourite' : 'favourites'}</p></div>
      <div className="shop-collection">{products.map((product, index) => {
        const open = checkoutReady(product.slug);
        const mug = product.kind === 'mug';
        const shirt = product.kind === 'shirt';
        const hoodie = product.kind === 'hoodie';
        const type = hoodie ? 'Hoodie' : shirt ? 'T-shirt' : mug ? 'Mug' : 'Tote bag';
        const title = titles[product.slug] || product.name;
        const colours = hasColourOptions(product.slug) ? 'Black or white' : mug ? 'White' : 'Black';
        return <article className="shop-product-card" key={product.slug}>
          <Link className={'shop-feature-photo'+(mug ? ' shop-mug-photo' : '')} href={'/shop/'+product.slug} aria-label={'View '+title+' '+type.toLowerCase()}>
            <Image src={'/shop/'+productImagePrefix(product.slug)+'-model.webp'} alt={mug ? 'White ceramic mug with the '+product.name+' bookish design' : ((shirt || hoodie) ? 'Model wearing the black ' : 'Model carrying the black ')+product.name+(hoodie ? ' cotton-blend ' : ' organic cotton ')+type.toLowerCase()} width={mug ? (product.imagePrefix === 'rainbow-plot-mug' ? 1254 : 360) : 1157} height={mug ? (product.imagePrefix === 'rainbow-plot-mug' ? 1254 : 422) : 1359} priority={index < 3} sizes="(max-width:600px) calc((100vw - 48px) / 2), (max-width:900px) 45vw, 380px"/>
            {!open && <span className="shop-photo-badge">Coming soon</span>}
          </Link>
          <div className="shop-product-card-body">
            <p className="shop-card-kind">{type}{mug ? ' · 11oz' : hoodie ? ' · XS to 2XL' : shirt ? ' · XS–3XL' : ''}</p>
            <h3><Link href={'/shop/'+product.slug}>{title}</Link></h3>
            <p className="shop-card-options">{mug ? 'Glossy ceramic' : hoodie ? 'Cotton blend' : 'Organic cotton'} · {colours}</p>
            <div className="shop-card-footer"><p className="shop-card-price">£{(product.pricePence / 100).toFixed(2)}<span>UK delivery included</span></p><Link href={'/shop/'+product.slug} className="button-secondary" aria-label={'View '+title+' '+type.toLowerCase()}>View item <span aria-hidden="true">→</span></Link></div>
          </div>
        </article>;
      })}</div>
      {pageCount > 1 && <nav className="shop-pagination" aria-label="Product pages">
        {page > 1 && <Link href={href(category.key, page - 1)} className="button-secondary">← Previous</Link>}
        <div className="shop-page-numbers">{Array.from({ length: pageCount }, (_, i) => i + 1).map(number => number === page ? <span key={number} aria-current="page" aria-label={'Page '+number}>{number}</span> : <Link key={number} href={href(category.key, number)} aria-label={'Page '+number}>{number}</Link>)}</div>
        {page < pageCount && <Link href={href(category.key, page + 1)} className="button-secondary">Next →</Link>}
      </nav>}
      <p className="fine-print shop-note">International delivery is calculated on each product page. Choose a design to see more photos, colours and product details.</p>
    </section>
    <section className="shop-reader-note"><div><p className="eyebrow">More temptation, less inbox clutter</p><h2>Your next favourite is coming.</h2><p>Join the reader list for new designs, new books and fictional men worth losing sleep over.</p></div><Link href="/newsletter" className="button-secondary">Join the reader list <span aria-hidden="true">→</span></Link></section>
  </main>;
}
