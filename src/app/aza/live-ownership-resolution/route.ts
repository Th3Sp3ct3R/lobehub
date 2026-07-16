import { NextResponse } from 'next/server';

import { getAzaLiveOwnershipResolutionMap } from '../_lib/liveOwnershipResolutionMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveOwnershipResolutionMap());
}
