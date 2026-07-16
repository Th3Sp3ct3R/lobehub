import { NextResponse } from 'next/server';

import { getAzaLiveGtmMap } from '../_lib/liveGtmMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveGtmMap());
}
