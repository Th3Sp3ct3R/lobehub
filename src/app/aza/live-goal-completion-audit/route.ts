import { NextResponse } from 'next/server';

import { getAzaLiveGoalCompletionAuditMap } from '../_lib/liveGoalCompletionAuditMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveGoalCompletionAuditMap());
}
