import { NextResponse } from 'next/server';

import { getAzaLiveAppMap } from '../_lib/liveAppMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveAppMap());
}
