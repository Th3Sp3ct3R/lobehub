import { NextResponse } from 'next/server';

import { getAzaLiveOperatingRecordsMap } from '../_lib/liveOperatingRecordsMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveOperatingRecordsMap());
}
