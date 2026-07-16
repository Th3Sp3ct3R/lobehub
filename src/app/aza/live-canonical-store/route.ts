import { NextResponse } from 'next/server';

import { getAzaLiveCanonicalStoreMap } from '../_lib/liveCanonicalStoreMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveCanonicalStoreMap());
}
