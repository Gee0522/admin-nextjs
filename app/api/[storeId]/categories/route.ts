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

    const { name, billboardId } = body;

    // if there is no user ID
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    // if there is no label
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
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

    // to prevent modification by an authorized user
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // if success
    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    // api route if error
    console.log("[CATEGORIES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// to use in front-end and to get all the categories
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
    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    // api route if error
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
