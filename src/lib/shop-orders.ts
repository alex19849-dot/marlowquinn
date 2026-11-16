import { get, put } from '@vercel/blob';

export type OrderRecord = {
  sessionId: string;
  state: 'submitting' | 'submitted' | 'review';
  updatedAt: string;
  supplierOrderId?: string;
};

function orderPath(sessionId: string) {
  if (!/^cs_(live|test)_[a-zA-Z0-9]+$/.test(sessionId)) throw new Error('Invalid order reference.');
  return `shop-orders/${sessionId}.json`;
}

export async function readOrder(sessionId: string) {
  const result = await get(orderPath(sessionId), { access: 'private', useCache: false });
  if (!result) return null;
  if (result.statusCode !== 200) throw new Error('Order record could not be read.');
  const record = await new Response(result.stream).json() as OrderRecord;
  if (record.sessionId !== sessionId || !['submitting','submitted','review'].includes(record.state)) throw new Error('Order record is invalid.');
  return { record, etag: result.blob.etag };
}

export async function claimOrder(sessionId: string) {
  const record: OrderRecord = { sessionId, state: 'submitting', updatedAt: new Date().toISOString() };
  try {
    const blob = await put(orderPath(sessionId), JSON.stringify(record), {
      access: 'private', addRandomSuffix: false, allowOverwrite: false, contentType: 'application/json',
    });
    return { acquired: true as const, record, etag: blob.etag };
  } catch (error) {
    // Only treat an existing valid record as a duplicate; storage failures must be retried.
    const prior = await readOrder(sessionId);
    if (prior) return { acquired: false as const, ...prior };
    throw error;
  }
}

export async function saveOrder(record: OrderRecord, etag: string) {
  await put(orderPath(record.sessionId), JSON.stringify({ ...record, updatedAt: new Date().toISOString() }), {
    access: 'private', addRandomSuffix: false, allowOverwrite: true, ifMatch: etag, contentType: 'application/json',
  });
}
