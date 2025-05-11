import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getLastNDates(n: number) {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    dates.push(new Date(d));
  }
  return dates;
}

export async function GET() {
  try {
    const days = 30;
    const dates = getLastNDates(days);

    // Users
    const userCounts = await Promise.all(
      dates.map(async (date) => {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        const count = await prisma.user.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDay,
            },
          },
        });
        return count;
      })
    );

    // Restaurants
    const restaurantCounts = await Promise.all(
      dates.map(async (date) => {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        const count = await prisma.restaurant.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDay,
            },
          },
        });
        return count;
      })
    );

    // Bookings
    const bookingCounts = await Promise.all(
      dates.map(async (date) => {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        const count = await prisma.booking.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDay,
            },
          },
        });
        return count;
      })
    );

    return NextResponse.json({
      dates: dates.map(d => d.toISOString().slice(0, 10)),
      userCounts,
      restaurantCounts,
      bookingCounts,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
  }
} 