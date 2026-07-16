import { NextResponse } from 'next/server';

import { getAzaLiveVantaBrainDiagnosticsMap } from '../_lib/liveVantaBrainDiagnosticsMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveVantaBrainDiagnosticsMap());
}
