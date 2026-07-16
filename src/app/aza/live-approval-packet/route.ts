import { NextResponse } from 'next/server';

import { getAzaLiveApprovalPacketMap } from '../_lib/liveApprovalPacketMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveApprovalPacketMap());
}
