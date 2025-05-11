import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const cuisine = searchParams.get('cuisine');
  const zipcode = searchParams.get('zipcode');
  const priceRange = searchParams.get('priceRange');

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

export async function POST(request: Request) {
  try {
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
      },
    });

    return NextResponse.json(newRestaurant, { status: 201 });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json({ error: 'Error creating restaurant' }, { status: 500 });
  }
}