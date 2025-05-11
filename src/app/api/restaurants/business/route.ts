import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const cuisine = searchParams.get('cuisine');
  const zipcode = searchParams.get('zipcode');
  const priceRange = searchParams.get('priceRange');

  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: 'JWT_SECRET is not configured' }, { status: 500 });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as {
      role: string;
      id: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: Number(decodedToken.id) },
    });

    if (user?.role === 'BusinessOwner') {

      const restaurants = await prisma.restaurant.findMany({

        where: {
          ownerId: Number(decodedToken.id)
        }
      });

      return NextResponse.json(restaurants);
    } else {
      try {
        const restaurants = await prisma.restaurant.findMany({
          where: {
            name: name ? { contains: name, mode: 'insensitive' } : undefined,
            cuisine: cuisine ? { contains: cuisine, mode: 'insensitive' } : undefined,
            zipcode: zipcode || undefined,
            priceRange: priceRange || undefined,
          },
        });

        if (restaurants.length === 0) {
          return NextResponse.json({ message: 'No restaurants found' }, { status: 404 });
        }

        return NextResponse.json(restaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        return NextResponse.json({ error: 'Error fetching restaurants' }, { status: 500 });
      }

    }
  } catch (error) {
    console.error('Error retrieving restaurants:', error);
    return NextResponse.json({
      error: 'Error retrieving restaurants'

    })
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: 'JWT_SECRET is not configured' }, { status: 500 });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as {
      id: string;
    };
    const data = await request.json();
    const { name, description, address, zipcode, cuisine, priceRange, ratings, imageUrl, ownerId } = data;

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
        ownerId: Number(decodedToken.id)
      },
    });

    return NextResponse.json(newRestaurant, { status: 201 });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json({ error: 'Error creating restaurant' }, { status: 500 });
  }
}