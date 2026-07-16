import { NextResponse } from 'next/server';

import { getAzaLiveReadiness } from '../_lib/liveReadiness';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveReadiness());
}
