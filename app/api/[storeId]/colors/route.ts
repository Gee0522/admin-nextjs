import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// API for creating a Billboard
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    // using clerk to authenticate this post route
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    // if there is no user ID
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    // if there is no label
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }
    // if no storeId
    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // to prevent modification by unauthorized user
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // if success
    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    // api route if error
    console.log("[COLORS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// to use in front-end and to get all the billbords
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    // if no storeId
    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    // if success
    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    // api route if error
    console.log("[COLORS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
