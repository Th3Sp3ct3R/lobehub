import { NextResponse } from 'next/server';

import { getAzaLiveGtmTeamOperatingStatusMap } from '../_lib/liveGtmTeamOperatingStatusMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveGtmTeamOperatingStatusMap({ depth: 'summary' }));
}
