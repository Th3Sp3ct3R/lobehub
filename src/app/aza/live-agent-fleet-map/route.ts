import { NextResponse } from 'next/server';

import { getAzaLiveAgentFleetMap } from '../_lib/liveAgentFleetMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveAgentFleetMap());
}
