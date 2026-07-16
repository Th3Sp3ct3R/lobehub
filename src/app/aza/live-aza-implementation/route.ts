import { NextResponse } from 'next/server';

import { getAzaLiveAzaImplementationMap } from '../_lib/liveAzaImplementationMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = async () => {
  return NextResponse.json(await getAzaLiveAzaImplementationMap());
};
