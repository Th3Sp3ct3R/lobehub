import { NextResponse } from 'next/server';

import { getAzaLiveDailyCommandWorkflowMap } from '../_lib/liveDailyCommandWorkflowMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveDailyCommandWorkflowMap());
}
