import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'Admin',
      },
    });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return NextResponse.json({ token }, { status: 201 });
  } catch (error) {
    console.error('Error during admin registration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 