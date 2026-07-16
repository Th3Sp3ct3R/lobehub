import { NextResponse } from 'next/server';

import { getAzaLiveContentAppAuditMap } from '../_lib/liveContentAppAuditMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveContentAppAuditMap());
}
