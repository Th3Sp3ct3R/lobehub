import { NextResponse } from 'next/server';

import { getAzaLiveToolingRecommendationPlanMap } from '../_lib/liveToolingRecommendationPlanMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveToolingRecommendationPlanMap());
}
