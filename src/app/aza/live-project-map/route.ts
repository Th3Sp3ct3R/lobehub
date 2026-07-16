import { NextResponse } from 'next/server';

import { getAzaLiveProjectMap } from '../_lib/liveProjectMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveProjectMap());
}
