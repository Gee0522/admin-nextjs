import prismadb from "@/lib/prismadb";
// import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// API for creating a review
export async function POST(req: Request) {
  try {
    // using clerk to authenticate this post route
    // const { userId } = auth();
    const body = await req.json();

    const { rating, comment, productId, userId } = body;

    // if there is no user ID
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // if there is no name for store
    // if (!productId) {
    //   return new NextResponse("Name is required", { status: 400 });
    // }

    // if success
    const review = await prismadb.review.create({
      data: {
        comment,
        rating,
        userId,
        productId,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    // api route if error
    console.log("[REVIEW_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
