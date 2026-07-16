import { NextResponse } from 'next/server';

import { getAzaLiveImplementationProofMap } from '../_lib/liveImplementationProofMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveImplementationProofMap());
}
