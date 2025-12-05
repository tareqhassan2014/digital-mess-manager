import User from "@/lib/models/user";
import connectDB from "@/lib/mongodb";
import { registerSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    await connectDB();

    // Check if user with phone or email already exists
    const existingUser = await User.findOne({
      $or: [
        { phone: validatedData.phone },
        ...(validatedData.email ? [{ email: validatedData.email }] : []),
      ],
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "User with this phone number or email already exists",
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user
    const user = await User.create({
      name: validatedData.fullName,
      phone: validatedData.phone,
      email: validatedData.email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
