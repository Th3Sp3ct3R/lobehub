import { NextResponse } from 'next/server';

import { getAzaLiveCommandRecordSchemaMap } from '../_lib/liveCommandRecordSchemaMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveCommandRecordSchemaMap());
}
