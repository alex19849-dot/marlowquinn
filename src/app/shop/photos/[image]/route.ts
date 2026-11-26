import { get } from '@vercel/blob';

const products = ['butterfly-book-tote', 'butterfly-book-shirt', 'literary-moth-tote', 'literary-moth-shirt'];
const photos = new Set([...products.flatMap(product => ['editorial', 'detail'].map(view => `${product}-${view}.webp`)), 'ord-mug-editorial.webp', 'ord-mug-detail.webp', 'ord-mug-model.webp', 'ord-mug-wrap.png']);

export async function GET(_request: Request, { params }: { params: Promise<{ image: string }> }) {
  const { image } = await params;
  if (!photos.has(image)) return new Response('Not found', { status: 404 });
  // Only allowlisted product photos are public. The store's order records stay private.
  const photo = await get(`shop-images/${image}`, { access: 'private' });
  if (!photo || photo.statusCode !== 200) return new Response('Image unavailable', { status: 404 });
  return new Response(photo.stream, { headers: { 'Content-Type': image === 'ord-mug-wrap.png' ? 'image/png' : 'image/webp', 'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } });
}
