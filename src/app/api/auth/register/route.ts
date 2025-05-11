import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import jwt from 'jsonwebtoken';
export async function POST(request: Request) {
  try {
    
    const { name, email, password } = await request.json();
    
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
    
    const hashedPassword = await hashPassword(password);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'BusinessOwner', 
      },
    });
    
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET || 'your-secret-key', 
      { expiresIn: '1d' } 
    );
    
    return NextResponse.json({ token }, { status: 201 });
  } catch (error) {
    console.error('Error during registration:', error);
    
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}