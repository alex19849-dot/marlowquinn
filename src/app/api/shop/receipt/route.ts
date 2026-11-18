import { stripeClient } from '@/lib/stripe';
import { emailPaymentReceipt } from '@/lib/payment-receipt';
import { SHOP_URL } from '@/lib/shop';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (request.headers.get('origin') !== SHOP_URL) return Response.json({message:'Please use the shop website.'},{status:403});
  try {
    const text = await request.text();
    if (text.length > 512) return Response.json({message:'Invalid order reference.'},{status:400});
    const body = JSON.parse(text);
    if (typeof body.sessionId !== 'string') return Response.json({message:'Invalid order reference.'},{status:400});
    await emailPaymentReceipt(stripeClient(), body.sessionId);
    return Response.json({message:'Your receipt has been requested for the email address used at checkout.'},{headers:{'Cache-Control':'no-store'}});
  } catch {
    return Response.json({message:'We could not email your receipt. Please contact us with your order reference.'},{status:502});
  }
}
