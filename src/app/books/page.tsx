import type { Metadata } from 'next';
import { BookCatalogue } from '@/components/ReaderTools';
export const metadata: Metadata={title:'Books',description:'Find your next Marlow Quinn MM romance. Browse by genre, trope and Kindle Unlimited availability.',alternates:{canonical:'/books'}};
export default async function BooksPage({searchParams}:{searchParams:Promise<{category?:string;trope?:string}>}){
  const params=await searchParams;
  const category=typeof params.category==='string'?params.category:'';
  const trope=typeof params.trope==='string'?params.trope:'';
  return <main id="main-content" className="page-width page-section"><header className="page-heading"><p className="eyebrow">The Marlow Quinn bookshelf</p><h1>Find your next obsession.</h1><p>Follow a favourite trope, choose your mood or explore the whole collection.</p></header><BookCatalogue key={category+':'+trope} initialCategory={category} initialTrope={trope}/></main>;
}
