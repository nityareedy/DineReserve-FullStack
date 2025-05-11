import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword } from "@/lib/auth";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.role !== "BusinessOwner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error("Error during login:", error);

    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
