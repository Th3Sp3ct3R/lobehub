import { NextResponse } from 'next/server';

import { getAzaLiveDeliveryRoadmapMap } from '../_lib/liveDeliveryRoadmapMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveDeliveryRoadmapMap());
}
