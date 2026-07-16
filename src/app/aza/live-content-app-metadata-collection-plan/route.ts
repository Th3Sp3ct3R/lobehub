import { NextResponse } from 'next/server';

import { getAzaLiveContentAppMetadataCollectionPlanMap } from '../_lib/liveContentAppMetadataCollectionPlanMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveContentAppMetadataCollectionPlanMap());
}
