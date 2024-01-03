import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { z } from "zod";
import toast from "react-hot-toast";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": " GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds } = await req.json();

  const productArr = productIds.map((product: any) => product.id);

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productArr,
      },
    },
  });

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product) => {
    const cartItem = productIds.find(
      (orderItem: any) => product.id === orderItem.id
    );
    line_items.push({
      quantity: cartItem.quantity,
      price_data: {
        currency: "USD",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber() * 100,
      },
    });
  });

  // const userId = req.userId;

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((item: any) => {
          const cartItem = productIds.find(
            (orderItem: any) => item.id === orderItem.id
          );

          return {
            productId: item.id,
            orderQuantity: cartItem.quantity,
          };
        }),
      },
    },
    include: {
      orderItems: true,
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  // Update product quantities based on the order
  for (const orderItem of order.orderItems) {
    const product = orderItem.productId;
    await prismadb.product.updateMany({
      where: {
        id: product,
      },
      data: {
        quantity: {
          decrement: orderItem.orderQuantity,
        },
      },
    });
  }

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}
