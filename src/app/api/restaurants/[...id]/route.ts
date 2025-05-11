import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: Number(id) },
      include: {
        owner: true,
        reviews: {
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    // Calculate mean rating
    const meanRating = restaurant.reviews.length
      ? (restaurant.reviews.reduce((sum, r) => sum + r.rating, 0) / restaurant.reviews.length).toFixed(1)
      : null;

    return NextResponse.json({ ...restaurant, meanRating });
  } catch (error) {
    return NextResponse.json({ error: 'Error retrieving restaurant details' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  try {
    const deletedRestaurant = await prisma.restaurant.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Restaurant deleted successfully', restaurant: deletedRestaurant });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting restaurant' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const { name, description, address, zipcode, cuisine, priceRange, ratings, imageUrl} = await req.json();

  try {
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: Number(id) },
      data: {
        name: name,
        description: description,
        address: address,
        zipcode: zipcode,
        cuisine: cuisine,
        priceRange: priceRange,
        ratings: Number(ratings), 
        imageUrl: imageUrl, 
      },
    });

    return NextResponse.json({ message: 'Restaurant updated successfully', restaurant: updatedRestaurant });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating restaurant' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const { userId, content, rating } = await req.json();

  if (!userId || !content || !rating) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Create review
    const review = await prisma.review.create({
      data: { userId, restaurantId: Number(id), content, rating },
    });

    // Recalculate mean rating
    const reviews = await prisma.review.findMany({ where: { restaurantId: Number(id) } });
    const meanRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    // Update restaurant's ratings field
    await prisma.restaurant.update({
      where: { id: Number(id) },
      data: { ratings: meanRating },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating review' }, { status: 500 });
  }
}
