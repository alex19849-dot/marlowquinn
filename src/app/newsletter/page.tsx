import type { Metadata } from 'next';
import { NewsletterForm } from '@/components/ReaderTools';
export const metadata:Metadata={title:'Reader list',description:'Join Marlow Quinn’s reader list for new releases, cover reveals and reader extras.',alternates:{canonical:'/newsletter'}};
export default function NewsletterPage(){return <main id="main-content" className="page-width page-section"><section className="form-shell"><p className="eyebrow">Stay for the next chapter</p><h1>Something good to open.</h1><p>New releases, cover reveals and reader extras from Marlow Quinn. Join the reader list so you know when the next story arrives.</p><NewsletterForm/></section></main>;}
