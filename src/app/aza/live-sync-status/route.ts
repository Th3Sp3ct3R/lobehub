import { NextResponse } from 'next/server';

import { getAzaLiveSyncStatusMap } from '../_lib/liveSyncStatusMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveSyncStatusMap());
}
