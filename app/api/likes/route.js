import { NextResponse } from 'next/server';
import { ARTWORKS_DATA } from '../../artworks/artworksData';

export const dynamic = 'force-dynamic';

// Works with Upstash Redis, or Vercel's Upstash integration (KV_* names)
const URL_ = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const HASH = 'artwork_likes';
const IDS = new Set(ARTWORKS_DATA.map((a) => a.id));

async function redis(...cmd) {
  const res = await fetch(URL_, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('redis');
  return (await res.json()).result;
}

const notConfigured = () => NextResponse.json({ error: 'not_configured' }, { status: 503 });

export async function GET() {
  if (!URL_ || !TOKEN) return notConfigured();
  try {
    const flat = (await redis('HGETALL', HASH)) || [];
    const counts = {};
    for (let i = 0; i < flat.length; i += 2) {
      if (IDS.has(flat[i])) counts[flat[i]] = Math.max(0, Number(flat[i + 1]) || 0);
    }
    return NextResponse.json({ counts });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 502 });
  }
}

export async function POST(req) {
  if (!URL_ || !TOKEN) return notConfigured();
  try {
    const { id, delta } = await req.json();
    if (!IDS.has(id) || (delta !== 1 && delta !== -1)) {
      return NextResponse.json({ error: 'bad_request' }, { status: 400 });
    }
    let count = Number(await redis('HINCRBY', HASH, id, delta));
    if (count < 0) {
      await redis('HSET', HASH, id, 0);
      count = 0;
    }
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 502 });
  }
}