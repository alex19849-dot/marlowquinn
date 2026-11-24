import { get } from '@vercel/blob';

// Only these two public product photographs may be served from the private store.
// Order records and other stored files are never addressable through this helper.
export async function butterflyPhoto(view: 'editorial' | 'detail') {
  const image = await get(`shop-images/butterfly-book-hoodie-${view}.webp`, { access: 'private' });
  if (!image || image.statusCode !== 200) return new Response('Image unavailable', { status: 404 });
  return new Response(image.stream, { headers: { 'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } });
}
