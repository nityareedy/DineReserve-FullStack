import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';
import { JwtPayload } from 'jsonwebtoken';

const prisma = new PrismaClient();

// GET /api/bookings - Get all bookings for a restaurant
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');
    const date = searchParams.get('date');

    if (!restaurantId || !date) {
      return NextResponse.json({ error: 'Restaurant ID and date are required' }, { status: 400 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        restaurantId: parseInt(restaurantId),
        date: new Date(date),
      },
      select: {
        time: true,
        numberOfPeople: true,
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token
    const token = authHeader.split(' ')[1];
    let payload: JwtPayload;
    try {
      payload = verifyToken(token) as JwtPayload;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { restaurantId, date, time, numberOfPeople, customerName, customerEmail, customerPhone } = body;

    // Validate required fields
    if (!restaurantId || !date || !time || !numberOfPeople || !customerName || !customerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if the time slot is available
    const existingBooking = await prisma.booking.findFirst({
      where: {
        restaurantId: parseInt(restaurantId),
        date: new Date(date),
        time,
        status: 'confirmed',
      },
    });

    if (existingBooking) {
      return NextResponse.json({ error: 'This time slot is already booked' }, { status: 400 });
    }

    // Create the booking with userId
    const booking = await prisma.booking.create({
      data: {
        userId: payload.id ? Number(payload.id) : undefined,
        restaurantId: parseInt(restaurantId),
        date: new Date(date),
        time,
        numberOfPeople,
        customerName,
        customerEmail,
        customerPhone,
        status: 'confirmed',
      },
    });

    // TODO: Send confirmation email/SMS here
    // You can implement email/SMS sending logic using services like SendGrid, Twilio, etc.

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 