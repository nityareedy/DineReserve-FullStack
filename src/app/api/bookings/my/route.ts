import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';
import { JwtPayload } from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    let payload: JwtPayload;
    try {
      payload = verifyToken(token) as JwtPayload;
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const userId = payload.id;
    console.log('JWT payload:', payload);
    console.log('userId:', userId);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 401 });
    }
    // Find bookings for this user (by userId)
    const bookings = await prisma.booking.findMany({
      where: { userId: Number(userId) },
      include: { restaurant: { select: { name: true, address: true } } },
      orderBy: { date: 'asc' },
    });
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 