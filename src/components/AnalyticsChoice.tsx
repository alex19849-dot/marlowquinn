'use client';
import Script from 'next/script';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
const key='marlow-analytics-v1';
const id='G-BXBMNNQ1TH';
export default function AnalyticsChoice(){
 const [allowed,setAllowed]=useState(false);
 const [open,setOpen]=useState(false);
 const trigger=useRef<HTMLButtonElement>(null);
 const firstChoice=useRef<HTMLButtonElement>(null);
 const requested=useRef(false);
 useEffect(()=>{try{const value=localStorage.getItem(key);setAllowed(value==='allow');setOpen(value===null);}catch{setOpen(true);}function settings(){requested.current=true;setOpen(true);}window.addEventListener('marlow-cookie-settings',settings);return()=>window.removeEventListener('marlow-cookie-settings',settings);},[]);
 useEffect(()=>{if(open&&requested.current)firstChoice.current?.focus();},[open]);
 function choose(value:boolean){
   try{localStorage.setItem(key,value?'allow':'decline');}catch{}
   if(!value){
     const disabledWindow=window as unknown as Record<string,unknown>;disabledWindow['ga-disable-'+id]=true;
     for(const cookie of document.cookie.split(';')){
       const name=cookie.split('=')[0].trim();
       if(name==='_ga'||name.startsWith('_ga_')||name==='_gid'||name.startsWith('_gat')){
         for(const domain of ['',location.hostname,'.marlowquinn.com'])document.cookie=name+'=; Max-Age=0; path=/'+(domain?'; domain='+domain:'');
       }
     }
   }else{const analyticsWindow=window as unknown as Record<string,unknown>;analyticsWindow['ga-disable-'+id]=false;}
   const wasAllowed=allowed;setAllowed(value);setOpen(false);
   if(requested.current){document.getElementById('cookie-settings')?.focus();requested.current=false;}
   if(wasAllowed&&!value)location.reload();
 }
 return <>{allowed&&<><Script src={'https://www.googletagmanager.com/gtag/js?id='+id} strategy="afterInteractive"/><Script id="google-analytics" strategy="afterInteractive">{'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","'+id+'");'}</Script></>}{open&&<section className="privacy-banner" aria-labelledby="cookie-heading"><h2 id="cookie-heading">A quick privacy choice</h2><p>May we use optional analytics to understand visits and improve the site? You can browse either way. <Link className="text-link" href="/privacy">Privacy notice</Link>.</p><div className="button-row"><button ref={firstChoice} className="button-secondary" onClick={()=>choose(false)}>Decline analytics</button><button ref={trigger} className="button-primary" onClick={()=>choose(true)}>Allow analytics</button></div></section>}</>;
}
export function CookieSettings(){return <button id="cookie-settings" type="button" onClick={()=>window.dispatchEvent(new Event('marlow-cookie-settings'))}>Cookie settings</button>;}
