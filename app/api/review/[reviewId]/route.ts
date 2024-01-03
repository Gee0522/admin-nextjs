import prismadb from "@/lib/prismadb";
// import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// update route
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // const { userId } = auth();

    //extracting the body from the request
    const body = await req.json();

    const { rating, comment, productId, userId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!productId) {
      return new NextResponse("ProductId is required", { status: 400 });
    }

    // if (!params.storeId) {
    //     return new NextResponse("Store id is required", { status: 400 })
    // }

    const review = await prismadb.review.updateMany({
      where: {
        id: params.id,
        userId,
        productId,
      },
      data: {
        comment,
        rating,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    // api route if error
    console.log("[STORE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

//Delete route

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // const { userId } = auth();

    // if (!userId) {
    //     return new NextResponse("Unauthenticated", { status: 401 } );
    // }

    // if (!params.storeId) {
    //     return new NextResponse("Store id is required", { status: 400 })
    // }

    const store = await prismadb.review.deleteMany({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    // api route if error
    console.log("[REVIEW_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
