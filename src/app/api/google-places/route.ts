import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const zip = searchParams.get('zip');
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  if (!zip || !apiKey) {
    return NextResponse.json({ error: 'Missing zip or API key' }, { status: 400 });
  }

  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+${zip}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return NextResponse.json(data);
} 