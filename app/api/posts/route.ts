import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ success: true, code: 200, data: null, message: '' })
}
