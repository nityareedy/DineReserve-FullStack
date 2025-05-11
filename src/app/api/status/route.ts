import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const token = cookieHeader?.split('=')[1]; 

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const decodedPayload = decoded as jwt.JwtPayload;

    // Return success response
    return NextResponse.json({ authenticated: true, userId: decodedPayload.id }, { status: 200 });
  } catch (error) {
    console.error('Invalid token:', error);

    // Handle invalid token
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
