import { NextResponse } from 'next/server';

import { getAzaLiveAccessCapabilityMap } from '../_lib/liveAccessCapabilityMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveAccessCapabilityMap());
}
