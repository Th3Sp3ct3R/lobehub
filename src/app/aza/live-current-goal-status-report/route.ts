import { NextResponse } from 'next/server';

import { getAzaLiveCurrentGoalStatusReportMap } from '../_lib/liveCurrentGoalStatusReportMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveCurrentGoalStatusReportMap());
}
