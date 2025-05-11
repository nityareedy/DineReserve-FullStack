import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { content, rating, userId, restaurantId } = data;

    if(!content || !rating || !userId || !restaurantId) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

    const newReview = await prisma.review.create({
        data: {
            content,
            rating,
            userId,
            restaurantId,
        },
        });

    return NextResponse.json(newReview, { status: 201 });
    }
    catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json({ error: 'Error creating review' }, { status: 500 });
    }
}