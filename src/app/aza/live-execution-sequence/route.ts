import { NextResponse } from 'next/server';

import { getAzaLiveExecutionSequenceMap } from '../_lib/liveExecutionSequenceMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveExecutionSequenceMap());
}
