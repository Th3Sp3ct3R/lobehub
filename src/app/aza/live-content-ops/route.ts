import { NextResponse } from 'next/server';

import { getAzaLiveContentOpsMap } from '../_lib/liveContentOpsMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveContentOpsMap());
}
