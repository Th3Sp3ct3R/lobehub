import { NextResponse } from 'next/server';

import { getAzaLiveBrainTopologyMap } from '../_lib/liveBrainTopologyMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveBrainTopologyMap());
}
