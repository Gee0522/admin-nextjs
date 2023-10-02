import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


// API for creating a store
export async function POST(
    req: Request,
) 
{
    try {
        // using clerk to authenticate this post route
        const { userId } = auth();
        const body = await req.json();

        const { name } = body;

        // if there is no user ID
        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }
        // if there is no name
        if(!name){
            return new NextResponse("Name is required", { status: 400 });
        }

        // if success
        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        });

        return NextResponse.json(store);
    }
        catch (error) {
            // api route if error
            console.log('[STORES_POST]', error);
            return new NextResponse("Internal error", { status: 500 });
        }
}


