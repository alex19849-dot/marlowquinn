'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect,useRef,useState } from 'react';
const links=[{href:'/',label:'Home'},{href:'/books',label:'Books'},{href:'/about',label:'About'},{href:'/newsletter',label:'Reader list'},{href:'/contact',label:'Contact'}];
export default function Navbar(){
  const pathname=usePathname();
  const [isOpen,setIsOpen]=useState(false);
  const button=useRef<HTMLButtonElement>(null);
  useEffect(()=>{function escape(event:KeyboardEvent){if(event.key==='Escape'){setIsOpen(false);button.current?.focus();}}if(isOpen)document.addEventListener('keydown',escape);return()=>document.removeEventListener('keydown',escape);},[isOpen]);
  const active=(href:string)=>href==='/'?pathname==='/':pathname.startsWith(href);
  return <header className="site-header" onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))setIsOpen(false);}}><nav className="site-nav" aria-label="Main navigation"><Link href="/" className="wordmark" onClick={()=>setIsOpen(false)}>Marlow <span>Quinn</span></Link><div className="desktop-nav">{links.map(link=><Link key={link.href} href={link.href} aria-current={active(link.href)?'page':undefined}>{link.label}</Link>)}</div><button ref={button} type="button" className="menu-button" aria-expanded={isOpen} aria-controls="mobile-navigation" aria-label={isOpen?'Close navigation menu':'Open navigation menu'} onClick={()=>setIsOpen(open=>!open)}><span aria-hidden="true">{isOpen?'✕':'☰'}</span><span>Menu</span></button></nav><nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" hidden={!isOpen}>{links.map(link=><Link key={link.href} href={link.href} aria-current={active(link.href)?'page':undefined} onClick={()=>setIsOpen(false)}>{link.label}</Link>)}</nav></header>;
}
