'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { BasketItem, basketKey, normaliseBasket } from '@/lib/basket';
const storageKey = 'marlow-quinn-basket-v1';
type Context = { items: BasketItem[]; ready: boolean; add: (item: BasketItem) => boolean; update: (key: string, quantity: number) => void; clearPurchased: (items: BasketItem[], session: string) => void };
const BasketContext = createContext<Context | null>(null);
export function useBasket() { const basket = useContext(BasketContext); if (!basket) throw new Error('Basket unavailable.'); return basket; }
export default function BasketProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    function read() { try { setItems(normaliseBasket(JSON.parse(localStorage.getItem(storageKey) || '[]')) || []); } catch { setItems([]); } }
    read(); setReady(true);
    function changed(event: StorageEvent) { if (event.key === storageKey) read(); }
    window.addEventListener('storage', changed); return () => window.removeEventListener('storage', changed);
  }, []);
  function save(value: BasketItem[]) { setItems(value); try { localStorage.setItem(storageKey, JSON.stringify(value)); } catch { /* A private browser can still use an in-memory basket. */ } }
  function add(item: BasketItem) { const next = normaliseBasket([...items, item]); if (!next) return false; save(next); return true; }
  function update(key: string, quantity: number) { const next = items.map(item => basketKey(item) === key ? { ...item, quantity } : item).filter(item => item.quantity > 0); const valid = next.length ? normaliseBasket(next) : []; if (valid) save(valid); }
  const clearPurchased = useCallback((purchased: BasketItem[], session: string) => {
    try {
      if (localStorage.getItem('mq-paid-' + session)) return;
      const current = normaliseBasket(JSON.parse(localStorage.getItem(storageKey) || '[]')) || [];
      const remaining = current.map(item => ({ ...item, quantity: Math.max(0, item.quantity - (purchased.find(row => basketKey(row) === basketKey(item))?.quantity || 0)) })).filter(item => item.quantity > 0);
      localStorage.setItem(storageKey, JSON.stringify(remaining)); localStorage.setItem('mq-paid-' + session, '1'); setItems(remaining);
    } catch { /* Keep a saved basket rather than remove unverified items. */ }
  }, []);
  return <BasketContext.Provider value={{ items, ready, add, update, clearPurchased }}>{children}</BasketContext.Provider>;
}
