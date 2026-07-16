import { NextResponse } from 'next/server';

import { getAzaLiveServiceMap } from '../_lib/liveServiceMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveServiceMap());
}
