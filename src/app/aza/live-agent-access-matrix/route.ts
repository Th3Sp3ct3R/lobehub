import { NextResponse } from 'next/server';

import { getAzaLiveAgentAccessMatrixMap } from '../_lib/liveAgentAccessMatrixMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveAgentAccessMatrixMap());
}
