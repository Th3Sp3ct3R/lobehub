import { NextResponse } from 'next/server';

import { getAzaLiveCommandGateMap } from '../_lib/liveCommandGateMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveCommandGateMap());
}
