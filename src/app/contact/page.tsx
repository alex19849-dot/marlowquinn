'use client';
import Link from 'next/link';
import {useRef,useState,type FormEvent} from 'react';
export default function ContactPage(){
  const [status,setStatus]=useState('');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(false);
  const busy=useRef(false);
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();if(busy.current)return;busy.current=true;
    const form=event.currentTarget;
    setLoading(true);setError(false);setStatus('');
    try{
      const data=new FormData(form);
      const response=await fetch('https://formspree.io/f/mzdlkarl',{method:'POST',body:data,headers:{Accept:'application/json'},signal:AbortSignal.timeout(15000)});
      if(!response.ok)throw new Error('send failed');
      form.reset();setStatus('Message sent. Thank you for getting in touch.');
    }catch{setError(true);setStatus('Your message could not be sent. It is still here, please try again.');}
    finally{setLoading(false);busy.current=false;}
  }
  return <main id="main-content" className="page-width page-section"><section className="form-shell"><p className="eyebrow">Get in touch</p><h1>Let’s talk books.</h1><p>Reader messages, review enquiries or a question about a story? Send a message below.</p><form onSubmit={submit} aria-busy={loading}><div><label htmlFor="contact-name">Name</label><input id="contact-name" name="name" type="text" autoComplete="name" maxLength={120} required/></div><div><label htmlFor="contact-email">Email address</label><input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required/></div><div><label htmlFor="contact-message">Your message</label><textarea id="contact-message" name="message" rows={7} maxLength={10000} required/></div><div className="honeypot" aria-hidden="true"><label htmlFor="contact-website">Leave this empty</label><input id="contact-website" name="_gotcha" type="text" tabIndex={-1} autoComplete="off"/></div><p className="fine-print">Your details are used to handle your enquiry. This form does not sign you up to the reader list. <Link href="/privacy" className="text-link">Privacy notice</Link>.</p><button type="submit" className="button-primary" disabled={loading}>{loading?'Sending…':'Send message'}</button><p className="form-message" data-error={error} role="status" aria-live="polite" aria-atomic="true">{status}</p></form></section></main>;
}
