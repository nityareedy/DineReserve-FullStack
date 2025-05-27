import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { JwtPayload } from 'jsonwebtoken';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token) as JwtPayload;

    // Verify if user is admin
    const user = await prisma.user.findUnique({
      where: { id: Number(payload.id) }
    });

    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { status } = await request.json();
    const restaurantId = parseInt(params.id);

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { status },
      include: {
        owner: {
          select: {
            email: true
          }
        }
      }
    });

    // If rejected, delete the restaurant
    if (status === 'rejected') {
      await prisma.restaurant.delete({
        where: { id: restaurantId }
      });
    }

    return NextResponse.json({ message: `Restaurant ${status} successfully` });
  } catch (error) {
    console.error('Error updating restaurant status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 