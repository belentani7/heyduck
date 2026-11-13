import { NextResponse } from 'next/server'
import catalog from '@/data/fl-studio-plugin-catalog.json'

export async function GET() {
  return NextResponse.json({
    ok: true,
    source: 'local-catalog',
    policy: 'metadata-only; installation requires explicit verification',
    count: catalog.length,
    plugins: catalog,
  }, { headers: { 'Cache-Control': 'no-store' } })
}
