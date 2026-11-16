'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { books } from '@/data/books';
export type Book = (typeof books)[number];
export function BookCard({book}: {book: Book}) {
  return <article className="book-card"><Link className="cover-link" href={'/books/'+book.slug} tabIndex={-1} aria-hidden="true"><Image className="book-cover" src={book.cover} alt="" width={400} height={600} sizes="(max-width:479px) 112px, (max-width:767px) 44vw, (max-width:1023px) 29vw, 280px" /></Link><div className="book-card-body"><p className="eyebrow">{book.subgenre}</p><h3 className="card-title"><Link href={'/books/'+book.slug}>{book.title}</Link></h3><p className="card-hook">{book.blurb.split(/\n\s*\n/)[0]}</p><ul className="tag-list" aria-label="Book tropes">{book.tropes.slice(0,3).map(trope=><li key={trope}><span className="tag tag-static">{trope}</span></li>)}</ul>{book.ku && <p className="availability">Available in Kindle Unlimited</p>}<Link className="text-link card-action" href={'/books/'+book.slug} aria-label={'Read about '+book.title}>Book details <span aria-hidden="true">→</span></Link></div></article>;
}
const categories = ['All books','Sports','Contemporary','College','Paranormal','Suspense & horror','Seasonal'];
function matches(book: Book, category: string) {
  const text = (book.subgenre+' '+book.tropes.join(' ')).toLowerCase();
  switch(category) {
    case 'Sports': return /sports|hockey|football|quarterback|goalies|coach \/ player/.test(text);
    case 'Contemporary': return /contemporary|workplace|single dads|neighbours/.test(text);
    case 'College': return /college|professor|student/.test(text);
    case 'Paranormal': return /paranormal|vampire|werewolf|fated mates/.test(text);
    case 'Suspense & horror': return /suspense|thriller|horror|motorcycle/.test(text);
    case 'Seasonal': return /christmas|halloween|holiday/.test(text);
    default: return true;
  }
}
export function BookCatalogue({initialCategory='',initialTrope=''}: {initialCategory?:string;initialTrope?:string}) {
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState(categories.includes(initialCategory)?initialCategory:'All books');
  const [trope,setTrope]=useState(initialTrope);
  const [sort,setSort]=useState('featured');
  const [kuOnly,setKuOnly]=useState(false);
  const tropes=Array.from(new Set(books.flatMap(book=>book.tropes))).sort((a,b)=>a.localeCompare(b));
  const words=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const results=books.filter(book=>{
    const text=(book.title+' '+book.subgenre+' '+book.tropes.join(' ')+' '+book.blurb).toLowerCase();
    return words.every(word=>text.includes(word))&&matches(book,category)&&(!trope||book.tropes.includes(trope))&&(!kuOnly||book.ku);
  });
  if(sort!=='featured') results.sort((a,b)=>sort==='az'?a.title.localeCompare(b.title):b.title.localeCompare(a.title));
  const active=!!query||category!=='All books'||!!trope||kuOnly||sort!=='featured';
  function reset(){setQuery('');setCategory('All books');setTrope('');setSort('featured');setKuOnly(false);}
  return <><div className="filter-panel" role="search" aria-label="Find a book"><div className="filter-grid"><div className="search-field"><label htmlFor="book-search">Search books</label><input id="book-search" type="search" placeholder="Title, trope or something you love…" value={query} onChange={e=>setQuery(e.target.value)}/></div><div><label htmlFor="book-category">Genre / mood</label><select id="book-category" value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(item=><option key={item}>{item}</option>)}</select></div><div><label htmlFor="book-trope">Trope</label><select id="book-trope" value={trope} onChange={e=>setTrope(e.target.value)}><option value="">All tropes</option>{tropes.map(item=><option key={item}>{item}</option>)}</select></div><div><label htmlFor="book-sort">Sort by</label><select id="book-sort" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured order</option><option value="az">Title: A to Z</option><option value="za">Title: Z to A</option></select></div></div><div className="filter-bottom"><label className="checkbox-label"><input type="checkbox" checked={kuOnly} onChange={e=>setKuOnly(e.target.checked)}/>Kindle Unlimited only</label>{active&&<button type="button" className="text-link" onClick={reset}>Clear filters</button>}</div></div><p className="result-count" role="status" aria-live="polite" aria-atomic="true">{results.length} {results.length===1?'book':'books'}{active?' matching your choices':' to explore'}</p>{results.length?<div className="book-grid">{results.map(book=><BookCard key={book.slug} book={book}/>)}</div>:<div className="empty-state"><h2>No books match just yet</h2><p>Try a different word or clear a filter to see more stories.</p><button className="button-primary" onClick={reset}>Show all books</button></div>}</>;
}
export function NewsletterForm({id='newsletter'}:{id?:string}){
  const [email,setEmail]=useState('');
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState('');
  const [error,setError]=useState(false);
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();if(loading)return;
    const form=event.currentTarget;
    setLoading(true);setMessage('');setError(false);
    try{
      const response=await fetch('/api/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,website:new FormData(form).get('website')}),signal:AbortSignal.timeout(15000)});
      const data=await response.json();
      setMessage(data.message||'Please try again.');setError(!response.ok);if(response.ok)setEmail('');
    }catch{setMessage('We could not connect. Your email is still here, please try again.');setError(true);}
    finally{setLoading(false);}
  }
  return <form className="reader-form" onSubmit={submit} aria-busy={loading}><div><label htmlFor={id+'-email'}>Email address</label><input id={id+'-email'} name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></div><div className="honeypot" aria-hidden="true"><label htmlFor={id+'-website'}>Leave this empty</label><input id={id+'-website'} name="website" type="text" tabIndex={-1} autoComplete="off"/></div><button type="submit" className="button-primary" disabled={loading}>{loading?'Joining…':'Join the reader list'}</button><p className="fine-print">By joining, you agree to receive Marlow Quinn’s reader emails. Unsubscribe using the link in any email. <Link href="/privacy" className="text-link">Privacy notice</Link>.</p><p className="form-message" data-error={error} role="status" aria-live="polite" aria-atomic="true">{message}</p></form>;
}
