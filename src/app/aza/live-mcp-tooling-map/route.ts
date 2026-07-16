import { NextResponse } from 'next/server';

import { getAzaLiveMcpToolingMap } from '../_lib/liveMcpToolingMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveMcpToolingMap());
}
