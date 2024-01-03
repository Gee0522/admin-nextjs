import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// this route is to target individual user

// update route
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    if (!params.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    const user = await prismadb.user.findUnique({
      where: {
        id: params.userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    // api route if error
    console.log("[USER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

//Delete route

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    if (!params.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    const user = await prismadb.user.delete({
      where: {
        id: params.userId,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    // api route if error
    console.log("[USER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
