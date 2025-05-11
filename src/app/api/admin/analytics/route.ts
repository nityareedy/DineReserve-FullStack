import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const totalUsers = await prisma.user.count();
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, name: true, email: true, createdAt: true }
    });
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const newUsersLast7Days = await prisma.user.count({
      where: { createdAt: { gte: last7Days } }
    });

    return NextResponse.json({
      totalUsers,
      newUsersLast7Days,
      recentUsers
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
} 