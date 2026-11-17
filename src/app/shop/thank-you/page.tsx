import type { Metadata } from 'next';
import Link from 'next/link';
import { stripeClient } from '@/lib/stripe';
import { getToteProduct } from '@/lib/shop';

export const metadata: Metadata = { title: 'Your order', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function ThankYou({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  let paid = false;
  let pending = false;
  if (session_id && /^cs_live_[a-zA-Z0-9]+$/.test(session_id)) {
    try {
      const session = await stripeClient().checkout.sessions.retrieve(session_id);
      if (session.livemode && getToteProduct(session.metadata?.website_slug || '')) {
        paid = session.payment_status === 'paid';
        pending = session.status === 'complete' && session.payment_status === 'unpaid';
      }
    } catch { /* Never claim payment was received without confirmation from Stripe. */ }
  }
  return <main id="main-content" className="page-width page-section"><div className="form-shell"><p className="eyebrow">The Marlow Quinn shop</p><h1>{paid ? 'Thank you. Your payment is received.' : pending ? 'Your payment is processing.' : 'Let’s check your order.'}</h1><p>{paid ? 'Your item will be made especially for you. Please allow 3 to 5 working days for production, plus delivery.' : pending ? 'Your payment provider is still confirming the payment. Your item will enter fulfilment once payment is confirmed.' : 'We could not confirm a completed payment here. Please check your Stripe receipt before trying another payment, or contact us if you need help.'}</p><div className="button-row"><Link href="/shop" className="button-primary">Back to the shop</Link><Link href="/contact" className="button-secondary">Ask about an order</Link></div></div></main>;
}
