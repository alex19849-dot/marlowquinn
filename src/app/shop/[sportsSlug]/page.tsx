import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SportsProduct from '@/components/SportsProduct';
import LiteraryProduct from '@/components/LiteraryProduct';
import { SPORTS_PRODUCTS, LITERARY_PRODUCTS, checkoutReady, hasColourOptions, productImagePrefix } from '@/lib/shop';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ sportsSlug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sportsSlug } = await params;
  const product = [...SPORTS_PRODUCTS, ...LITERARY_PRODUCTS].find(item => item.slug === sportsSlug);
  if (!product) return {};
  const type = product.kind === 'shirt' ? 'T-Shirt' : 'Tote';
  return { title: `${product.name} ${type}`, description: `${product.name} ${type} in ${hasColourOptions(product.slug) ? 'black or white' : 'black'} organic cotton. £${(product.pricePence / 100).toFixed(2)} including UK tracked delivery.`, alternates: { canonical: '/shop/'+product.slug }, openGraph: { title: product.name+' '+type, url: '/shop/'+product.slug, images: [{ url: '/shop/'+productImagePrefix(product.slug)+'-detail.webp', width: 1254, height: 1254, alt: product.name+' '+type }] } };
}
export default async function SportsPage({ params }: Props) {
  const { sportsSlug } = await params;
  const product = [...SPORTS_PRODUCTS, ...LITERARY_PRODUCTS].find(item => item.slug === sportsSlug);
  if (!product) notFound();
  if (LITERARY_PRODUCTS.some(item => item.slug === product.slug)) return <LiteraryProduct slug={product.slug} enabled={checkoutReady(product.slug)}/>;
  return <SportsProduct slug={product.slug} enabled={checkoutReady(product.slug)}/>;
}
