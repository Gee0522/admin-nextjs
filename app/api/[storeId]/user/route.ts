import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { z } from "zod";
import { hash } from "bcrypt";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": " GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  password2: z.string(),
});

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// API for creating a user
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = createUserSchema.parse(await req.json());
    const { name, email, password, password2 } = body;
    const hashedPassword = await hash(password, 20);

    if (!name || !email || !password) {
      return new NextResponse("Name, email and password are required", {
        status: 400,
      });
    }

    if (password !== password2) {
      return new NextResponse("Passwords do not match", { status: 400 });
    }

    // if no storeId
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    // to prevent modification by unauthorized user
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // if success
    const user = await prismadb.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(user, { headers: corsHeaders });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      const validationErrors = error.errors.map((issue) => issue.message);
      return new NextResponse(validationErrors.join(), { status: 400 });
    }

    // api route if error
    console.log("[USER_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
