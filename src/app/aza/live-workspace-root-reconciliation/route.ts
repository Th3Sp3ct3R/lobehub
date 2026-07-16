import { NextResponse } from 'next/server';

import { getAzaLiveWorkspaceRootReconciliationMap } from '../_lib/liveWorkspaceRootReconciliationMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveWorkspaceRootReconciliationMap());
}
