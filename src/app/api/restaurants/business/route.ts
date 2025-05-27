import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { JwtPayload } from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    console.log('Auth header:', authHeader); // Debug log

    if (!authHeader?.startsWith('Bearer ')) {
      console.error('No Bearer token provided');
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token); // Debug log
    let payload: JwtPayload;
    
    try {
      payload = verifyToken(token) as JwtPayload;
      console.log('Token payload:', payload); // Debug log
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ 
        error: 'Invalid token',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.id) },
    });

    if (!user) {
      console.error('User not found for ID:', payload.id);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'BusinessOwner') {
      console.error('User is not a business owner:', user.role);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const restaurants = await prisma.restaurant.findMany({
      where: { ownerId: Number(payload.id) }
    });

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('Error retrieving restaurants:', error);
    return NextResponse.json({ 
      error: 'Error retrieving restaurants',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      console.error('No Bearer token provided');
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let payload: JwtPayload;
    
    try {
      payload = verifyToken(token) as JwtPayload;
      console.log('Token payload:', payload); // Debug log
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.id) },
    });

    if (!user) {
      console.error('User not found for ID:', payload.id);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'BusinessOwner') {
      console.error('User is not a business owner:', user.role);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const data = await request.json();
    const { name, description, address, zipcode, cuisine, priceRange, ratings, imageUrl } = data;

    if (!name || !address || !zipcode || !cuisine || !priceRange) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newRestaurant = await prisma.restaurant.create({
      data: {
        name,
        description,
        address,
        zipcode,
        cuisine,
        priceRange,
        ratings,
        imageUrl,
        ownerId: Number(payload.id)
      },
    });

    return NextResponse.json(newRestaurant, { status: 201 });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json({ 
      error: 'Error creating restaurant',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}