import { NextResponse } from 'next/server';

import { getAzaLiveBrowserOperatingSessionReadinessMap } from '../_lib/liveBrowserOperatingSessionReadinessMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveBrowserOperatingSessionReadinessMap());
}
