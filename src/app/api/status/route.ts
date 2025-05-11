import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { JwtPayload } from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    let token = request.headers.get('authorization');
    if (!token) {
      // Try to get from cookies (if SSR)
      const cookies = request.headers.get('cookie');
      if (cookies) {
        const match = cookies.match(/(user-token|admin-token)=([^;]+)/);
        if (match) token = `Bearer ${match[2]}`;
      }
    }
    if (!token || !token.startsWith('Bearer ')) {
      return NextResponse.json({ authenticated: false, role: null }, { status: 401 });
    }
    token = token.replace('Bearer ', '');
    let payload: JwtPayload;
    try {
      payload = verifyToken(token) as JwtPayload;
    } catch {
      return NextResponse.json({ authenticated: false, role: null }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true, role: payload.role || null });
  } catch (error) {
    return NextResponse.json({ authenticated: false, role: null }, { status: 500 });
  }
}
