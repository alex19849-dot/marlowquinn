import Link from 'next/link';
export default function NotFound(){return <main id="main-content" className="page-width page-section"><div className="empty-state"><p className="eyebrow">Page not found</p><h1>This chapter is missing.</h1><p>The page may have moved, or the link may be incomplete.</p><Link className="button-primary" href="/books">Explore the books</Link></div></main>;}
