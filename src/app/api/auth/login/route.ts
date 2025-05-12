import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword, generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log('Login attempt for email:', email); // Debug log

    if (!email || !password) {
      console.log('Missing email or password'); // Debug log
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('User not found for email:', email); // Debug log
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log('Found user with role:', user.role); // Debug log

    if (user.role !== "BusinessOwner") {
      console.log('User is not a business owner:', user.role); // Debug log
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    console.log('Password validation result:', isPasswordValid); // Debug log

    if (!isPasswordValid) {
      console.log('Invalid password for user:', email); // Debug log
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    try {
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });
      console.log('Generated token successfully'); // Debug log

      return NextResponse.json({ token }, { status: 200 });
    } catch (error) {
      console.error("Error generating token:", error);
      return NextResponse.json(
        { error: "Failed to generate authentication token" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
