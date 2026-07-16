import { NextResponse } from 'next/server';

import { getAzaLiveMemoryMap } from '../_lib/liveMemoryMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveMemoryMap());
}
