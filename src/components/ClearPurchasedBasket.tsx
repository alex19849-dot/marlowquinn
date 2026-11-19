'use client';
import { useEffect } from 'react';
import { useBasket } from './BasketProvider';
import type { BasketItem } from '@/lib/basket';
export default function ClearPurchasedBasket({ items, session }: { items: BasketItem[]; session: string }) {
  const { clearPurchased } = useBasket();
  useEffect(() => { clearPurchased(items, session); }, [items, session, clearPurchased]);
  return null;
}
