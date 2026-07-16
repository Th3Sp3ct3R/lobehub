import { NextResponse } from 'next/server';

import { getAzaLiveMemoryIntakeFunnelMap } from '../_lib/liveMemoryIntakeFunnelMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveMemoryIntakeFunnelMap());
}
