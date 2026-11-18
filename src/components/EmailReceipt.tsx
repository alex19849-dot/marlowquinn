'use client';
import { useState } from 'react';
export default function EmailReceipt({sessionId}:{sessionId:string}) {
  const [busy,setBusy]=useState(false), [message,setMessage]=useState('');
  return <div><button className="button-secondary" disabled={busy} onClick={async()=>{
    setBusy(true); setMessage('');
    try {
      const response=await fetch('/api/shop/receipt',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId}),signal:AbortSignal.timeout(25000)});
      const result=await response.json();setMessage(result.message);
    } catch {setMessage('We could not request your receipt. Please try again later.');}
    finally {setBusy(false);}
  }}>{busy?'Requesting receipt…':'Email my receipt'}</button><p role="status" className="fine-print">{message}</p></div>;
}
