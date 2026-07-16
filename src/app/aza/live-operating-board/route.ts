import { NextResponse } from 'next/server';

import { getAzaLiveOperatingBoard } from '../_lib/liveOperatingBoard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveOperatingBoard());
}
