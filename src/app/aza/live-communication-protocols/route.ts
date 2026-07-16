import { NextResponse } from 'next/server';

import { getAzaLiveCommunicationProtocolMap } from '../_lib/liveCommunicationProtocolMap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getAzaLiveCommunicationProtocolMap());
}
