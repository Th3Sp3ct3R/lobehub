import { NextResponse } from 'next/server';

import { getAzaLiveBrowserTaskToolingMap } from '../_lib/liveBrowserTaskToolingMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveBrowserTaskToolingMap());
}
