import { NextResponse } from 'next/server';

import { getAzaLiveTeamDataRoutingMap } from '../_lib/liveTeamDataRoutingMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveTeamDataRoutingMap());
}
