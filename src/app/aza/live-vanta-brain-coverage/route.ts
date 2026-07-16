import { NextResponse } from 'next/server';

import { getAzaLiveVantaBrainCoverageMap } from '../_lib/liveVantaBrainCoverageMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveVantaBrainCoverageMap());
}
