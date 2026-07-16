import { NextResponse } from 'next/server';

import { getAzaLiveNativeApprovalAdapterMap } from '../_lib/liveNativeApprovalAdapterMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveNativeApprovalAdapterMap());
}
