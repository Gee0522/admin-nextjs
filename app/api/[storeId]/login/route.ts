import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { z } from "zod";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { getSession } from "next-auth/react";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// API for user login
export async function POST(req: Request) {
  try {
    const body = loginUserSchema.parse(await req.json());
    const { email, password } = body;

    if (!email || !password) {
      return new NextResponse("Email and password are required", {
        status: 400,
      });
    }

    const user = await prismadb.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return new NextResponse("Invalid password", { status: 401 });
    }

    // Generate JWT token for authentication
    const token = sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h", // Set the expiration time as needed
    });

    return NextResponse.json({ token }, { headers: corsHeaders });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      const validationErrors = error.errors.map((issue) => issue.message);
      return new NextResponse(validationErrors.join(), { status: 400 });
    }

    // API route if error
    console.log("[LOGIN_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
