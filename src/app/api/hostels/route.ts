import { auth } from "@/app/api/auth/[...nextauth]/route";
import Hostel from "@/lib/models/hostel";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { z } from "zod";

const createHostelSchema = z.object({
  name: z.string().min(2, "Hostel name must be at least 2 characters"),
  shortCode: z
    .string()
    .min(2, "Short code must be at least 2 characters")
    .max(10, "Short code must be at most 10 characters")
    .regex(
      /^[A-Z0-9]+$/,
      "Short code must contain only uppercase letters and numbers"
    ),
  address: z.string().min(5, "Address must be at least 5 characters"),
  type: z.enum(["BOYS", "GIRLS"], "Type must be either BOYS or GIRLS"),
  seats: z.object({
    total: z.number().int().min(1, "Total seats must be at least 1"),
    occupied: z.number().int().min(0, "Occupied seats cannot be negative"),
    availableForRent: z
      .number()
      .int()
      .min(0, "Available seats cannot be negative"),
    inMaintenance: z
      .number()
      .int()
      .min(0, "Maintenance seats cannot be negative"),
  }),
  location: z
    .object({
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional(),
});

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createHostelSchema.parse(body);

    await connectDB();

    // Check if shortCode already exists
    const existingHostel = await Hostel.findOne({
      shortCode: validatedData.shortCode.toUpperCase(),
    });

    if (existingHostel) {
      return NextResponse.json(
        {
          error: "A hostel with this short code already exists",
        },
        { status: 400 }
      );
    }

    // Validate seat numbers
    const { total, occupied, availableForRent, inMaintenance } =
      validatedData.seats;
    if (occupied + availableForRent + inMaintenance > total) {
      return NextResponse.json(
        {
          error:
            "Sum of occupied, available, and maintenance seats cannot exceed total seats",
        },
        { status: 400 }
      );
    }

    // Create hostel
    const hostel = await Hostel.create({
      name: validatedData.name,
      shortCode: validatedData.shortCode.toUpperCase(),
      address: validatedData.address,
      type: validatedData.type,
      owner: session.user.id,
      seats: validatedData.seats,
      location: validatedData.location
        ? {
            type: "Point",
            coordinates: validatedData.location.coordinates,
          }
        : undefined,
      rules: [],
      members: [],
    });

    return NextResponse.json(
      {
        message: "Hostel created successfully",
        hostel: {
          id: hostel._id,
          name: hostel.name,
          shortCode: hostel.shortCode,
          address: hostel.address,
          type: hostel.type,
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

    // Handle duplicate key error
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json(
        { error: "A hostel with this short code already exists" },
        { status: 400 }
      );
    }

    console.error("Hostel creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
