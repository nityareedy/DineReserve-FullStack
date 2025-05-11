import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: Number(id) },
      include: {
        owner: true,
        reviews: true,
      },
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    return NextResponse.json(restaurant);
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
