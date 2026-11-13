import { NextResponse } from 'next/server'
import { getUnifiedCapabilities } from '@/lib/unified-manifest'

export async function GET() {
  return NextResponse.json({
    ok: true,
    ...getUnifiedCapabilities(),
  }, {
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
