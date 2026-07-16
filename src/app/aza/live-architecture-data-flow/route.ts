import { NextResponse } from 'next/server';

import { getAzaLiveArchitectureDataFlowMap } from '../_lib/liveArchitectureDataFlowMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = async () => {
  return NextResponse.json(await getAzaLiveArchitectureDataFlowMap());
};
