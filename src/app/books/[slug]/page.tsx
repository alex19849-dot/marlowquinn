import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {books} from '@/data/books';
import {BookCard} from '@/components/ReaderTools';
type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return books.map(book=>({slug:book.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;const book=books.find(item=>item.slug===slug);
 if(!book)return {title:'Book not found',robots:{index:false,follow:false}};
 const description=book.blurb.split(/\n\s*\n/)[0];
 return {title:book.title,description,alternates:{canonical:'/books/'+book.slug},openGraph:{title:book.title+' | Marlow Quinn',description,type:'book',url:'/books/'+book.slug,images:[{url:book.cover,width:400,height:600,alt:book.title+' book cover'}]},twitter:{card:'summary_large_image',title:book.title+' | Marlow Quinn',description,images:[book.cover]}};
}
export default async function BookPage({params}:Props){
 const {slug}=await params;const book=books.find(item=>item.slug===slug);if(!book)notFound();
 const paragraphs=book.blurb.split(/\n\s*\n/);
 const regional=(region:'uk'|'us')=>{const url=new URL(book.amazon);url.hostname=region==='uk'?'www.amazon.co.uk':'www.amazon.com';return url.toString();};
 const related=books.filter(item=>item.slug!==book.slug).map(item=>({book:item,score:item.tropes.filter(trope=>book.tropes.includes(trope)).length*2+Number(item.subgenre===book.subgenre)})).filter(item=>item.score>0).sort((a,b)=>b.score-a.score).slice(0,3);
 const schema={'@context':'https://schema.org','@type':'Book',name:book.title,author:{'@type':'Person',name:'Marlow Quinn'},genre:book.subgenre,image:'https://www.marlowquinn.com'+book.cover,url:'https://www.marlowquinn.com/books/'+book.slug,sameAs:book.amazon,description:book.blurb};
 const heat=/^★+$/.test(book.heat)?book.heat.length+'/5 heat · '+(book.heat.length>=4?'High heat':'Medium heat'):book.heat;
 const purchase=<div className="purchase-links"><div className="button-row"><a href={regional('uk')} target="_blank" rel="noopener noreferrer" className="button-primary">View on Amazon UK</a><a href={regional('us')} target="_blank" rel="noopener noreferrer" className="button-secondary">Amazon US</a></div><p>Opens Amazon in a new tab. Choose your format and check local availability there.</p></div>;
 return <main id="main-content" className="page-width page-section"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/><Link href="/books" className="text-link back-link">← Back to all books</Link><article className="book-detail"><div className="book-intro"><p className="eyebrow">{book.subgenre}</p><h1>{book.title}</h1><p className="book-hook">{paragraphs[0]}</p>{book.ku&&<p className="availability">Available in Kindle Unlimited</p>}{purchase}</div><Image className="book-detail-cover" src={book.cover} alt={book.title+' book cover'} width={400} height={600} sizes="(max-width:767px) 190px, (max-width:1023px) 260px, 320px" priority/><div className="book-content"><h2 className="sr-only">About the book</h2><div className="book-blurb">{paragraphs.slice(1).map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div><ul className="tag-list" aria-label="Explore these tropes">{book.tropes.map(trope=><li key={trope}><Link className="tag" href={'/books?trope='+encodeURIComponent(trope)}>{trope}</Link></li>)}</ul><dl className="book-facts"><div><dt>Genre</dt><dd>{book.subgenre}</dd></div><div><dt>Heat level</dt><dd>{heat}</dd></div><div><dt>Length</dt><dd>{book.length}</dd></div><div><dt>Ending</dt><dd>{book.ending==='HEA'?'Happily ever after':book.ending}</dd></div></dl><details className="content-notes"><summary>Content notes & warnings</summary><ul>{book.contentWarnings.map(warning=><li key={warning}>{warning}</li>)}</ul></details>{purchase}<p className="fine-print">Want to hear about the next release? <Link href="/newsletter" className="text-link">Join the reader list</Link>.</p></div></article>{related.length>0&&<section className="section"><div className="section-heading"><div><p className="eyebrow">Keep exploring</p><h2>You might also like…</h2></div></div><div className="book-grid three-books">{related.map(item=><BookCard key={item.book.slug} book={item.book}/>)}</div></section>}</main>;
}
