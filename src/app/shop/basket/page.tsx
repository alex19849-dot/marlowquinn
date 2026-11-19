import type { Metadata } from 'next';
import Link from 'next/link';
import BasketPage from '@/components/BasketPage';
export const metadata: Metadata = { title: 'Your basket', robots: { index: false, follow: false } };
export default function Basket() { return <main id="main-content" className="page-width page-section basket-page"><nav className="shop-breadcrumb" aria-label="Breadcrumb"><Link href="/shop">Shop</Link><span aria-hidden="true">/</span><span>Your basket</span></nav><h1>Your basket.</h1><BasketPage/></main>; }
